import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideSailPoint } from '@sailpoint/angular-sdk';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { providePrimeNG } from 'primeng/config';
import { firstValueFrom } from 'rxjs';

import { SailpointPluginService } from '@core';
// These will be imported from the SailPoint Design System package when available.
import spdsPrimePreset, { SPDS_DARK_MODE_SELECTOR, SPDS_THEME_PREFIX } from '@core/spds-prime-theme';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Hash-based routing (#/, #/workflows, #/api-examples) works reliably in an
    // iframe without server-side rewrite rules. Multiple routes eliminate the
    // NG04002 issue that required withDisabledInitialNavigation() when the route
    // table was empty.
    provideRouter(routes, withHashLocation()),
    // provideSailPoint() wires up HttpClient and an auth interceptor that reads
    // window.sailpointConfig() on every request. No params here — the plugin
    // host registers that function after the COIP handshake completes below.
    provideSailPoint(),
    // TODO: When the SailPoint Design System package is available,
    // replace this with the thin wrapper from SailPoint Design System
    // that calls providePrimeNG() internally with the ISC-compatible
    // theme preset and design tokens. Interim wiring uses the
    // generated preset in core/spds-prime-theme.ts.
    providePrimeNG({
      theme: {
        preset: spdsPrimePreset,
        options: { darkModeSelector: SPDS_DARK_MODE_SELECTOR, prefix: SPDS_THEME_PREFIX },
      },
    }),

    // ngx-translate: fetch the active catalog (public/i18n/<lang>.json) at
    // runtime and drive the `translate` pipe. useHttpBackend issues the request
    // through HttpBackend so it bypasses the SailPoint auth interceptor — these
    // catalogs are same-origin static assets, not API calls, and must load even
    // before the plugin handshake publishes window.sailpointConfig(). Setting
    // fallbackLang loads en.json up front, so an unknown locale still renders.
    provideTranslateService({
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: 'i18n/',
        suffix: '.json',
        useHttpBackend: true,
      }),
    }),

    // Resolve the COIP handshake + plugin context once, before the app renders,
    // so window.sailpointConfig() is available for the first SDK request.
    // so api.get/post calls never race the handshake.
    provideAppInitializer(async () => {
      try {
        await inject(SailpointPluginService).whenReady();
      } catch (err) {
        // Standalone dev (no App Shell parent / unresolvable origin) or a handshake
        // failure — let bootstrap proceed so UI iteration isn't blocked.
        console.warn('[plugin] App Shell handshake did not complete during startup.', err);
      }
    }),

    // Load the catalog for the browser's language before the first paint, so
    // labels never flash their translation keys. Unknown locales fall back to
    // `en` via fallbackLang above.
    provideAppInitializer(async () => {
      const translate = inject(TranslateService);
      try {
        await firstValueFrom(translate.use(navigator.language));
      } catch (err) {
        console.warn('[plugin] Failed to load translations during startup.', err);
      }
    })
  ]
};
