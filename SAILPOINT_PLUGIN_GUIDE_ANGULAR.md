# SailPoint UI Plugin Guide (Angular)

> Angular-specific guide for developing this plugin against SailPoint Identity Security. It is intentionally self-contained so both humans and AI coding assistants have full context without external lookups.

## Context for AI assistants

- This project is a **SailPoint UI plugin**: a standalone Angular app that SailPoint Identity Security loads inside a **sandboxed iframe** at a designated UI **slot**.
- The plugin is isolated from the host. It communicates with the host only through the SailPoint UI Plugin SDK, which wraps a `postMessage` protocol (COIP). Do not assume direct DOM, cookie, or network access to the host page.
- Network calls to SailPoint APIs use a **scoped token** limited to the `apiScopes` declared in `sp-ui-plugin.json`. A call to an undeclared scope fails the same way locally as in production.
- `sp-ui-plugin.json` is the source of truth for the plugin's identity and security posture. Treat it as the contract with the backend.
- Build tooling is the Angular CLI. The SailPoint CLI orchestrates registration and deployment. The CLI does not replace `ng`.

## The configuration file: `sp-ui-plugin.json`

```jsonc
{
	"version": 1,
	"manifest": {
		"alias": "", // tenant-unique, path-safe key (lowercase,
		// alphanumeric + dashes, 3-63 chars)
		"name": { "en": "" }, // localized display name
		"description": { "en": "" }, // localized description
		"apiScopes": ["sp:scopes:all"], // SailPoint API scopes the plugin may use
		"permissionPolicy": {}, // Permissions-Policy directives
		"iframeAllow": {}, // iframe `allow` directives (object form)
		"contentSecurityPolicies": {}, // CSP directives for the plugin's assets
		"slots": [{ "slotId": "full-page" }],
	},
	"build": {
		"outDir": "./dist/<your-plugin>/browser", // compiled assets uploaded on deploy
		"port": 4200, // local dev server port
	},
}
```

- **`manifest`** is sent verbatim to the backend. **`build`** is local-only and never leaves your machine. For the Angular starter, `outDir` defaults to `./dist/<your-plugin>/browser` (Angular's `dist/<project>/browser` output).
- Security fields (`permissionPolicy`, `iframeAllow`, `contentSecurityPolicies`) are declarative — edit them by hand as your plugin needs them. The CLI validates the file against the expected schema before deploying.
- The **alias** is a stable, environment-independent key. The same alias maps to a different plugin instance in each tenant, so you can deploy the same code to staging and production without juggling GUIDs.

### Updating the manifest

`sail ui-plugins init` generates `sp-ui-plugin.json` in this workspace. Review the file and edit it as your plugin needs.

| When you edit                 | What to do                                                                                                                                |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| After `init`, before `create` | Edit `sp-ui-plugin.json`. Then run `sail ui-plugins create`.                                                                              |
| After `create`                | Edit `sp-ui-plugin.json`. Then run `sail ui-plugins push-manifest` (alias `update`) to send the updated `manifest` section to the tenant. |

The `build` section is local only. If you change manifest security fields after `create`, run `push-manifest`. Then run `link` again so the CLI refreshes `angular.json` with updated `devDocumentHeaders`.

## Prerequisites

Install a current Node.js and npm before you install dependencies.

| Tool    | Minimum | Notes                                                                                                                   |
| ------- | ------- | ----------------------------------------------------------------------------------------------------------------------- |
| npm     | 11.12   | Required if you install with npm. Older npm (11.5 and earlier, including the npm bundled with every Node 22 release and with Node 24.7 and earlier) fails during dependency resolution. |
| Node.js | 24.15   | Ships npm 11.12. Any Node that provides npm 11.12 or newer works.                                                       |

If you install with npm and see this error:

```
npm error Cannot read properties of null (reading 'edgesOut')
```

your npm is too old. This is a known bug in npm's dependency resolver, not a problem with this project. The error appears before npm checks any version requirement, so it cannot be prevented with a `package.json` `engines` field. Fix it one of two ways:

- Upgrade npm in place, keeping your current Node: `npm install -g npm@latest`, then run `npm install` again.
- Or switch to a Node version that bundles npm 11.12 or newer (Node 24.15 or later).

This is an npm-specific error. Other package managers (yarn, pnpm, bun) use their own dependency resolvers and are not expected to hit it.

## Local development

```bash
npm install
```

The SailPoint CLI registers your plugin and links your local server for in-tenant development (see [SailPoint CLI](#sailpoint-cli)). The development loop is:

1. Register the plugin with your tenant.
2. Start the Angular dev server — `npm start` (`ng serve`).
3. Link your local server to your identity. Open the returned developer URL (`?spPluginDev=<alias>`). If you are authorized, the host loads your local code inside the live tenant with a local-dev badge. You get a real handshake, a real scoped token, and live data.

Because local dev uses a real scoped token minted from your declared `apiScopes`, an endpoint you did not declare fails locally exactly as it would in production. Add scopes to `sp-ui-plugin.json` before you call an endpoint. If you already ran `create`, run `push-manifest` after you add scopes.

For plugin-document security headers during local dev, see [Local dev document headers](#local-dev-document-headers).

## Local dev document headers

The plugin iframe is governed by plugin-document `Content-Security-Policy` and `Permissions-Policy` headers. In production, a SailPoint service, UMS, stamps these on CDN assets. During local development, your dev server must emit the same headers. If it does not, API calls (for example, fetches to your tenant API) can be blocked by CSP.

**Source of truth for the dev server:** `angular.json` → `projects.<your-plugin>.architect.serve.options.headers`. The dev server does **not** read security headers from `sp-ui-plugin.json`.

### Automatic setup (normal workflow)

After you register the plugin, the SailPoint CLI writes the effective headers into `angular.json` when you run:

- `sail ui-plugins create`
- `sail ui-plugins link`

You do not need to hand-edit these values under the normal CLI workflow.

**Restart required:** If `npm start` (or `ng serve`) is already running when create or link updates `angular.json`, restart the dev server so the new headers take effect.

### Example (after create or link)

```json
"headers": {
  "Content-Security-Policy": "default-src 'self'; connect-src 'self' https://<your-org>.api.cloud.sailpoint.com; ...",
  "Permissions-Policy": "camera=(), microphone=(), ..."
}
```

The CLI populates real values for your tenant. The snippet above uses placeholders only.

### Manifest security fields

`sp-ui-plugin.json` `contentSecurityPolicies` and `permissionPolicy` do **not** directly configure dev-server headers. If you change manifest security fields after `create`, run `push-manifest`. UMS merges your changes with the platform baseline. Then the CLI refreshes `angular.json` on the next create or link.

## Building and deploying

```bash
npm run build        # produces build.outDir (for example, ./dist/<your-plugin>/browser)
```

Deploy the compiled assets with the SailPoint CLI (see [SailPoint CLI](#sailpoint-cli)). Uploaded assets are hosted immutably on the CDN. Deployment targets the plugin instance bound to your **alias** in the CLI's current tenant context. The same commands promote across environments.

### Relative asset paths

SailPoint Identity Security serves production plugin assets from a CDN URL. Built assets must use **relative** paths, not absolute paths like `/assets/main.js`. This starter sets `baseHref: "./"` and `deployUrl: "./"` in `angular.json` build options so production output is CDN-safe. Do not change these to root-absolute values before you upload.

If script or stylesheet URLs in the built `index.html` start with `/`, the plugin can fail to load after upload. The browser console shows 404 errors for JS or CSS.

## SailPoint CLI

These files are typically placed in your project by the SailPoint CLI (`sail ui-plugins init`), which also registers, links, builds, and deploys your plugin. For the authoritative command list, usage, and flags, use the CLI's own help and documentation rather than relying on this guide:

- `sail ui-plugins --help` (and `sail ui-plugins <command> --help`)
- CLI documentation: <https://developer.sailpoint.com/docs/tools/cli>

## SDK setup

This starter is already wired up with the SDK. All access goes through the `SailpointPluginService` in `src/app/core/`. Import it via the `@core` path alias. The service owns a single SDK instance. It runs the COIP handshake exactly once. It exposes the plugin context as signals. The app initializer in `src/app/app.config.ts` awaits the handshake before the app renders. Context is available before any component loads. Components read signals. They never manage the handshake themselves.

### Reading plugin context

Inject the service and read its signals. You do not need promises or setup:

```ts
import { Component, inject } from '@angular/core';
import { SailpointPluginService } from '@core';

@Component({
	selector: 'app-example',
	template: `
		@if (context(); as ctx) {
			<p>{{ ctx.user.displayName }} — {{ ctx.tenant.org }}</p>
		} @else {
			<p>Connecting to the App Shell…</p>
		}
	`,
})
export class Example {
	private readonly plugin = inject(SailpointPluginService);

	protected readonly context = this.plugin.context; // Signal<PluginContext | null>
	protected readonly status = this.plugin.status; // 'pending' | 'ready' | 'failed'
	protected readonly tenant = this.plugin.tenant; // Signal<TenantContext | null>
	protected readonly user = this.plugin.user; // Signal<UserContext | null>
}
```

The context types (`PluginContext`, `TenantContext`, `UserContext`, `PageContext`, `SlotContext`) are re-exported from `@core`, so import them from one place:

```ts
import { PluginContext } from '@core';
```

### Calling the SailPoint API

The app initializer waits for the App Shell handshake before the app renders. After that, you can call the API from an event handler or a service. Requests use the scopes in `sp-ui-plugin.json`. If a scope is not declared, the call fails in local dev and in production.

#### Typed calls with `@sailpoint/angular-sdk`

`@sailpoint/angular-sdk` exposes a partition service for each API area (for example, `TenantService`, `IdentitiesService`, `AccountsService`). Inject the service you need and declare it in the component's `providers` array. No separate install or configuration step — `provideSailPoint()` in `app.config.ts` wires up the HTTP interceptor that reads `window.sailpointConfig()` on every request.

SDK methods return `Observable<T>` directly.

##### Observable style

```ts
import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { EMPTY } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { IdentitiesService } from '@sailpoint/angular-sdk/identities';

@Component({
	imports: [AsyncPipe],
	providers: [IdentitiesService],
	template: `
		<button (click)="getIdentities.set(true)" [disabled]="getIdentities()">Fetch</button>
		@if (loading()) {
			<p>Loading…</p>
		}
		@if (error()) {
			<pre>{{ error() }}</pre>
		}
		@if (getIdentities()) {
			@if (identities$ | async; as list) {
				<pre>{{ list | json }}</pre>
			}
		}
	`,
})
export class Example {
	private readonly svc = inject(IdentitiesService);

	protected readonly getIdentities = signal(false);
	protected readonly loading = signal(false);
	protected readonly error = signal('');

	protected readonly identities$ = this.svc.listIdentitiesV1({ limit: 5 }).pipe(
		tap(() => {
			this.loading.set(true);
			this.error.set('');
		}),
		catchError((err) => {
			this.error.set(String(err));
			return EMPTY;
		}),
		finalize(() => this.loading.set(false)),
	);
}
```

Alternatively, subscribe in the component and write results to signals — useful when you are not using `AsyncPipe`.

##### Promise style

For event handlers or sequential chains, wrap any SDK method with `firstValueFrom()` from `rxjs`:

```ts
import { firstValueFrom } from 'rxjs';

const tenantData = await firstValueFrom(this.tenantSvc.getTenantV1());
```

The starter in `src/app/app.ts` shows both patterns side by side:

- **`identities$` + `getIdentities` gate** — `IdentitiesService.listIdentitiesV1()`, bound in the template with `AsyncPipe`.
- **`promiseApiCall()`** — `TenantService.getTenantV1()` via `firstValueFrom()`.

Both demo buttons are one-shot (disabled after the first call). Check `plugin.apiReady` or `plugin.status` before enabling UI that triggers API calls.

Add the API scopes you need to `sp-ui-plugin.json` before you call an endpoint. If you already ran `create`, run `push-manifest` after adding scopes.

#### Simple calls with `get()` and `post()`

`SailpointPluginService` also exposes `get()` and `post()`. They attach the scoped bearer token and use your tenant API base URL. Pass a path suffix only, not a full URL:

```ts
const identities = await this.plugin.get<Identity[]>('/public-identities/v1?limit=10');
await this.plugin.post('/search/v1', { query: { query: '*' } });
```

Use this approach when you do not need generated types or method names from the API client.

### Events and the raw SDK

For capabilities not wrapped by the service, `plugin.sdk` exposes the underlying SDK — including event subscriptions:

```ts
const unsubscribe = this.plugin.sdk.events.onViewportChange(({ width, height }) => {
	// react to host viewport changes
});
// call unsubscribe() when done
```

`plugin.whenReady()` exists only so the app initializer can gate bootstrap on the handshake. Components read the `context` / `status` signals instead of calling it.

## Routing

UI plugins support Angular routing with the **hash location strategy** (`#/`, `#/workflows`, etc.). Hash-based URLs work reliably in an iframe without server-side rewrite rules.

### Configuration

The starter is configured with `withHashLocation()` in `app.config.ts`:

```ts
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';

provideRouter(routes, withHashLocation());
```

### Route definitions

Define routes in `app.routes.ts`. Use `loadComponent` for lazy loading:

```ts
export const routes: Routes = [
	{ path: '', loadComponent: () => import('./features/overview/overview.component').then(m => m.OverviewComponent) },
	{ path: 'workflows', loadComponent: () => import('./features/workflows/workflows.component').then(m => m.WorkflowsComponent) },
	{ path: 'api-examples', loadComponent: () => import('./features/api-examples/api-examples.component').then(m => m.ApiExamplesComponent) },
];
```

### Sidebar navigation (ISC pattern)

ISC apps use a left sidebar for section navigation. The starter demonstrates this layout with a vertical nav linked to routes:

```html
<div class="shell-body">
	<nav class="shell-sidenav">
		<ul class="shell-sidenav__list">
			<li>
				<a routerLink="/" routerLinkActive="shell-sidenav__link--active" [routerLinkActiveOptions]="{ exact: true }" class="shell-sidenav__link">
					Overview
				</a>
			</li>
			<li>
				<a routerLink="/workflows" routerLinkActive="shell-sidenav__link--active" class="shell-sidenav__link">
					Workflows
				</a>
			</li>
		</ul>
	</nav>
	<main class="shell-content">
		<div class="shell-content__card">
			<router-outlet />
		</div>
	</main>
</div>
```

Key layout elements:

- **Sidebar** — white background flowing from header, with rounded bottom-right corner
- **Active state** — blue background + left border accent
- **Content card** — white panel with rounded corners and shadow on gray page background

Import `RouterLink` and `RouterLinkActive` in the component. The `routerLinkActive` directive applies the active class when the route matches.

## Launchers API

UI plugins can start SailPoint Workflows through the Launchers API. The starter's Workflows tab demonstrates this pattern.

### User-assigned launchers

To list launchers assigned to the signed-in user (the same list Launchpad shows), use the `my/assigned` endpoint:

```ts
const response = await this.plugin.get<{ items?: Launcher[] }>(
	'/beta/launchers/my/assigned?limit=100&sorters=name'
);
const launchers = response.items ?? [];
```

The Angular SDK's `LaunchersService.getLaunchersV1()` returns **all tenant launchers** (admin scope). If you need only the user's assigned launchers, use `plugin.get()` as shown above.

### Starting a launcher

```ts
const response = await this.plugin.post<{ interactiveProcessId?: string }>(
	`/beta/launchers/${encodeURIComponent(launcherId)}/launch`,
	{}
);
const processId = response.interactiveProcessId;
```

The workflow runs server-side. The returned Interactive Process ID is the handle the user needs to complete any interactive steps in the Launchpad.

### Linking to Launchpad

The plugin runs in an iframe and cannot render workflow interactive forms itself. After starting a launcher, link the user to the Launchpad:

```ts
function buildInteractiveProcessUrl(pageRoute: string, processId: string): string {
	const origin = new URL(pageRoute).origin;
	return `${origin}/ui/d/launchpad/interactive-processes/${encodeURIComponent(processId)}`;
}

// Usage:
const url = buildInteractiveProcessUrl(plugin.context()?.page.route, processId);
```

The `page.route` from the plugin context provides the tenant origin.

## Design tokens / theming

**Component library:** [PrimeNG](https://primeng.org/) is the chosen component library for SailPoint UI plugins. It is included in this starter's `package.json`. It is configured in `src/app/app.config.ts` to use the SailPoint Design System theme preset.

**ISC design tokens:** ISC-compatible design tokens and PrimeNG theme configuration will be delivered by the SailPoint Design System package. `provideSpds()` will be a thin wrapper around `providePrimeNG()` that applies the ISC theme preset automatically.

For early development, this starter contains the preset in `src/app/core/spds-prime-theme.ts` and `providePrimeNG()` is already configured in `src/app/app.config.ts`. The PrimeNG preset injects primitive and semantic level design tokens as CSS variables when the application is loaded. Component level design tokens are injected once an instance of that component is used.

Refer to the PrimeNG documentation for more information on design tokens and theming.

**Typography:** The preset injects global heading styles with the application. Native `h1`–`h6` use the bold heading tokens (xlarge through xxsmall). Matching utility classes apply the same sizes on any element: `.spds-h1`–`.spds-h6` (bold) and `.spds-h1--semibold`–`.spds-h6--semibold`.

**Icons:** Font Awesome icons are the standard for SailPoint UI plugins. Bundling mechanism _TBD_.

**CSS isolation:** The plugin iframe has its own CSS scope. Any global styles must be imported in `src/styles.scss`. PrimeNG theme styles configured for this application are injected into the `head` tag of the iframe. They are not inherited from the host page.

## Translations (i18n)

**Stack:** Translations use [ngx-translate](https://ngx-translate.org/) (`@ngx-translate/core` + `@ngx-translate/http-loader`). Language catalogs are plain JSON files under `public/i18n/`, loaded at runtime over HTTP and rendered through the `translate` pipe. Setup lives in `src/app/app.config.ts` via `provideTranslateService({ fallbackLang: 'en', loader: provideTranslateHttpLoader({ prefix: 'i18n/', suffix: '.json', useHttpBackend: true }) })`, and an app initializer calls `translate.use(navigator.language)` so the plugin renders in the viewer's browser language. `useHttpBackend` makes catalog requests skip the SailPoint auth interceptor, since the catalogs are same-origin static assets rather than API calls.

**Adding or updating a label:**

1. Add or edit the key in `public/i18n/en.json`. Nested objects are addressed with dots, e.g. `nav.overview`.
2. Reference it in a template: `{{ 'nav.overview' | translate }}`. For strings that contain inline markup (`<code>`, `<strong>`), bind with `[innerHTML]="'some.key' | translate"` instead.
3. Import `TranslatePipe` from `@ngx-translate/core` in the component's `imports` array.

**Adding a language:** Drop a new catalog into `public/i18n/` named for the locale the browser reports — the starter requests the catalog matching `navigator.language` verbatim. Missing keys, and unmatched locales, fall back to `en`. No code change is needed.

**More documentation:** ngx-translate is well documented — prefer its [official docs](https://ngx-translate.org/) for the `translate` pipe, the `TranslateService` API, parameterized messages, and advanced loaders.

**ISC parity:** ISC's fallback language is English (`en`), and ISC supports 22 languages. To mirror ISC exactly, provide a catalog for each and keep `en` as the fallback: `en` (English, fallback), `cs` (Czech), `da` (Danish), `de` (German), `es` (Spanish), `fi` (Finnish), `fr` (French), `hu` (Hungarian), `it` (Italian), `ja` (Japanese), `ko` (Korean), `lt` (Lithuanian), `nl` (Dutch), `no` (Norwegian), `pl` (Polish), `pt` (Portuguese), `ru` (Russian), `sv` (Swedish), `th` (Thai), `tr` (Turkish), `zh-CN` (Chinese, Simplified), `zh-TW` (Chinese, Traditional).
