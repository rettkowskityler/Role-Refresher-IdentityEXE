import { TestBed } from '@angular/core/testing';
import type { PluginContext, SailPointPluginSDK, UserCapabilities } from '@sailpoint/ui-plugin-sdk';

import { SailpointPluginService } from './sailpoint-plugin.service';

// The service caches its SDK instance on globalThis under this well-known key.
// Seeding it before the service is constructed lets these tests exercise the
// service without building a real SDK or resolving a live App Shell handshake.
const SINGLETON_KEY = Symbol.for('@sailpoint/ui-plugin-sdk#singleton');

const CAPABILITIES: UserCapabilities = {
  isOrgAdmin: false,
  isHelpdesk: false,
  isDashboard: false,
  isCertAdmin: false,
  isReportAdmin: false,
  isSourceAdmin: false,
  isSourceSubadmin: false,
  isRoleAdmin: false,
  isRoleSubadmin: false,
  isCloudGovAdmin: false,
  isCloudGovUser: false,
  isSaasManagementAdmin: false,
  isSaasManagementReader: false,
};

const CONTEXT: PluginContext = {
  tenant: {
    id: 't1',
    scriptName: 'acme',
    org: 'acme',
    name: 'Acme',
    pod: 'useast1',
    region: 'us-east-1',
    apiUrl: { idn: 'https://acme.api.identitynow.com' },
    products: [],
  },
  user: {
    id: 'u1',
    displayName: 'Test User',
    email: 'test@example.com',
    capabilities: CAPABILITIES,
  },
  page: { route: 'https://acme.identitynow.com/plugins/example', subPath: '' },
  slot: {},
  pluginConfiguration: { pluginId: 'plugin-1' },
};

function makeSdk(api: Record<string, unknown> = {}): SailPointPluginSDK {
  return { api } as unknown as SailPointPluginSDK;
}

describe('SailpointPluginService', () => {
  afterEach(() => {
    delete (globalThis as Record<symbol, unknown>)[SINGLETON_KEY];
  });

  function createService(
    sdk: SailPointPluginSDK | null,
    context: Promise<PluginContext>,
  ): SailpointPluginService {
    (globalThis as Record<symbol, unknown>)[SINGLETON_KEY] = { sdk, context };
    return TestBed.inject(SailpointPluginService);
  }

  it('starts pending before the handshake resolves', () => {
    const service = createService(makeSdk(), new Promise<PluginContext>(() => {}));
    expect(service.status()).toBe('pending');
    expect(service.context()).toBeNull();
    expect(service.tenant()).toBeNull();
    expect(service.user()).toBeNull();
  });

  it('exposes context and slices once the handshake resolves', async () => {
    const service = createService(makeSdk(), Promise.resolve(CONTEXT));
    await service.whenReady();
    expect(service.status()).toBe('ready');
    expect(service.context()).toEqual(CONTEXT);
    expect(service.tenant()).toEqual(CONTEXT.tenant);
    expect(service.user()).toEqual(CONTEXT.user);
  });

  it('reports failed status when the handshake rejects', async () => {
    const service = createService(makeSdk(), Promise.reject(new Error('handshake failed')));
    await service.whenReady().catch(() => undefined);
    expect(service.status()).toBe('failed');
    expect(service.context()).toBeNull();
  });

  it('reports failed status when the SDK cannot be created (standalone dev)', async () => {
    const originError = new Error('Unable to resolve App Shell origin');
    const service = createService(null, Promise.reject(originError));
    await service.whenReady().catch(() => undefined);
    expect(service.status()).toBe('failed');
    expect(service.context()).toBeNull();
    expect(() => service.sdk).toThrow(/not available/i);
    await expect(service.get('/sources/v1')).rejects.toThrow(/not available/i);
    await expect(service.post('/search/v1', {})).rejects.toThrow(/not available/i);
  });

  it('delegates get()/post() to the SDK api and exposes the raw sdk', async () => {
    const get = vi.fn().mockResolvedValue({ ok: true });
    const post = vi.fn().mockResolvedValue({ created: true });
    const sdk = makeSdk({ get, post });
    const service = createService(sdk, Promise.resolve(CONTEXT));

    await expect(service.get('/sources/v1')).resolves.toEqual({ ok: true });
    expect(get).toHaveBeenCalledWith('/sources/v1');

    await expect(service.post('/search/v1', { a: 1 })).resolves.toEqual({ created: true });
    expect(post).toHaveBeenCalledWith('/search/v1', { a: 1 });

    expect(service.sdk).toBe(sdk);
  });

  it('whenReady() resolves with the plugin context', async () => {
    const service = createService(makeSdk(), Promise.resolve(CONTEXT));
    await expect(service.whenReady()).resolves.toEqual(CONTEXT);
  });
});
