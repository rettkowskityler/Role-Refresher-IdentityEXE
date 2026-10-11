import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SailpointPluginService } from '@core';
import { TranslatePipe } from '@ngx-translate/core';
import { TagModule } from 'primeng/tag';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TagModule, TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly plugin = inject(SailpointPluginService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // Plugin display name. The SailPoint CLI (`sail ui-plugins init`) rewrites the
  // 'starter' literal to the alias the user provides. It is the plugin's own
  // name, not UI copy, so it is intentionally not translated.
  protected readonly title = signal('Role Refresher');
  protected readonly context = this.plugin.context;
  protected readonly status = this.plugin.status;
  protected readonly handshakeSeverity = {
    pending: 'warn',
    ready: 'success',
    failed: 'danger',
  } as const;

  ngOnInit(): void {
    // The host may have deep-linked to a sub-route (e.g. after a reload of
    // /ui/plugin/role-refresher-identityexe/role-refresher). The SDK derives that plugin-relative route
    // as `page.subPath`; adopt it instead of broadcasting our default start
    // route back, which would replace the host URL and drop the suffix.
    const initialSubPath = this.plugin.context()?.page.subPath ?? '';
    let initialNavigationHandled = false;

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        // Hash routes look like '/#/workflows' — extract the path after '#/'
        const hashPath = event.urlAfterRedirects.replace(/^\/#?\/?/, '');

        if (!initialNavigationHandled) {
          initialNavigationHandled = true;
          // Restore the host's route on first load and suppress the broadcast
          // for this initial navigation, so the empty start route never
          // overwrites a deep-linked host URL.
          if (initialSubPath && initialSubPath !== hashPath) {
            this.router.navigateByUrl(`/${initialSubPath}`);
          }
          return;
        }

        // Report the route to the host via the SDK so it mirrors it in the
        // browser URL. Only meaningful once the handshake is ready; standalone
        // dev has no App Shell to talk to.
        if (this.plugin.apiReady()) {
          this.plugin.setRoute(hashPath).catch((err) => {
            console.warn('[plugin] Failed to report route change to the host.', err);
          });
        }
      });
  }
}
