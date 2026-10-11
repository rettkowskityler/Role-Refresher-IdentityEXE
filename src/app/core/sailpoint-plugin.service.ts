import { computed, Injectable, signal } from '@angular/core';
import {
  createSDK,
  type PluginContext,
  type SailPointPluginSDK,
} from '@sailpoint/ui-plugin-sdk';

/**
 * Single owner of the SailPoint UI Plugin SDK for the whole plugin.
 *
 * Two things this service exists to guarantee:
 *
 * 1. The SDK is instantiated exactly once and the COIP handshake runs once. The
 *    App Shell answers a single SP_PLUGIN_READY_REQ per iframe mount, so a second
 *    SDK instance (e.g. after an edit-triggered dev rebuild) would send a fresh
 *    READY_REQ that the host silently drops, and that instance would then time
 *    out. Caching the instance on `globalThis` keeps it alive across HMR module
 *    re-evaluation, so a rebuild reuses the already-handshaken SDK.
 *
 * 2. Context is resolved once up front (see `whenReady()` + the app initializer
 *    in app.config.ts) so downstream `api.get` / `api.post` calls never race the
 *    handshake, and it is exposed as signals so components read it reactively.
 *
 * Authors normally never touch this file — inject the service and read the
 * `context` / `status` signals, or call `get()` / `post()` / `sdk`, instead.
 * Components should NOT call `whenReady()`; that exists only for the app
 * initializer to gate bootstrap.
 */

interface PluginSdkSingleton {
  sdk: SailPointPluginSDK | null;
  /** The handshake, kicked off exactly once and shared by every consumer. */
  context: Promise<PluginContext>;
}

const SDK_UNAVAILABLE =
  'SailPoint plugin SDK is not available. Open the plugin in SailPoint Identity Security via ?spPluginDev=<alias>.';

/**
 * `Symbol.for` returns a process-stable key, so the cached singleton survives a
 * dev-server module reload (HMR) that re-evaluates this module. A brand-new SDK
 * would re-attempt the handshake; reusing the existing one avoids that.
 */
const SDK_SINGLETON_KEY = Symbol.for('@sailpoint/ui-plugin-sdk#singleton');

type GlobalWithSdk = typeof globalThis & {
  [SDK_SINGLETON_KEY]?: PluginSdkSingleton;
};

function getOrCreateSingleton(): PluginSdkSingleton {
  const globalRef = globalThis as GlobalWithSdk;
  const existing = globalRef[SDK_SINGLETON_KEY];
  if (existing) {
    return existing;
  }

  // The SDK resolves the App Shell origin itself from the iframe context (the
  // `?parentOrigin` the host adds, reconciled with the browser ancestor origin
  // where available), so no `targetOrigin` is passed. createSDK() throws
  // synchronously when opened outside SailPoint Identity Security with no
  // resolvable origin — catch that so standalone dev-server UI iteration still
  // boots with status 'failed'.
  let sdk: SailPointPluginSDK | null = null;
  let context: Promise<PluginContext>;

  try {
    sdk = createSDK();
    context = sdk.getContext();
  } catch (err) {
    context = Promise.reject(err);
  }

  const singleton: PluginSdkSingleton = { sdk, context };
  globalRef[SDK_SINGLETON_KEY] = singleton;
  return singleton;
}

type PluginStatus = 'pending' | 'ready' | 'failed';

@Injectable({ providedIn: 'root' })
export class SailpointPluginService {
  private readonly singleton = getOrCreateSingleton();

  private readonly _context = signal<PluginContext | null>(null);
  private readonly _status = signal<PluginStatus>('pending');

  /**
   * Reactive plugin context. Populated once the handshake completes; components
   * read this signal directly — no `whenReady()` call, no per-component wiring.
   * Null while pending and if the handshake fails.
   */
  readonly context = this._context.asReadonly();

  /** Handshake lifecycle: 'pending' until it settles, then 'ready' or 'failed'. */
  readonly status = this._status.asReadonly();

  /** Convenience slices for components that only need part of the context. */
  readonly tenant = computed(() => this._context()?.tenant ?? null);
  readonly user = computed(() => this._context()?.user ?? null);

  /** True once the COIP handshake completes and API calls may be made. */
  readonly apiReady = computed(() => this._status() === 'ready');

  constructor() {
    // getOrCreateSingleton() already started the handshake; just mirror its
    // single resolution into signals for reactive consumers.
    this.singleton.context
      .then((context) => {
        this._context.set(context);
        this._status.set('ready');
      })
      .catch(() => this._status.set('failed'));
  }

  /** The raw SDK, for capabilities not wrapped here (events, getToken, etc.). */
  get sdk(): SailPointPluginSDK {
    if (!this.singleton.sdk) {
      throw new Error(SDK_UNAVAILABLE);
    }
    return this.singleton.sdk;
  }

  /**
   * Resolves when the COIP handshake completes and context is available. Awaited
   * once by the app initializer (app.config.ts) to gate bootstrap so `api.get` /
   * `api.post` never race the handshake. Components should read the `context` /
   * `status` signals instead of calling this.
   */
  whenReady(): Promise<PluginContext> {
    return this.singleton.context;
  }

  /** Authenticated GET against the SailPoint API using the plugin's scoped token. */
  get<T>(path: string): Promise<T> {
    if (!this.singleton.sdk) {
      return Promise.reject(new Error(SDK_UNAVAILABLE));
    }
    return this.singleton.sdk.api.get<T>(path);
  }

  /** Authenticated POST against the SailPoint API using the plugin's scoped token. */
  post<T>(path: string, data: unknown): Promise<T> {
    if (!this.singleton.sdk) {
      return Promise.reject(new Error(SDK_UNAVAILABLE));
    }
    return this.singleton.sdk.api.post<T>(path, data);
  }

  /**
   * Report the plugin's current internal route to the App Shell so it mirrors it
   * in the host browser URL (via history.replaceState, so no history entry is
   * pushed). `subPath` is plugin-relative, e.g. 'workflows'. Resolves once the
   * host accepts it; rejects if the SDK is unavailable or the handshake failed.
   */
  setRoute(subPath: string): Promise<void> {
    if (!this.singleton.sdk) {
      return Promise.reject(new Error(SDK_UNAVAILABLE));
    }
    return this.singleton.sdk.navigation.setRoute(subPath);
  }
}
