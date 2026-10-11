import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { SailpointPluginService } from '@core';
import { activateTranslations, provideTranslateTesting } from './testing/i18n.testing';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideTranslateTesting(),
        {
          provide: SailpointPluginService,
          useValue: {
            context: signal({
              tenant: { org: 'acme' },
              user: { displayName: 'Test User', email: 'test@acme.com' },
              page: { route: 'https://acme.identitysoon.com/ui/plugin/role-refresher-identityexe', subPath: '' },
            }),
            status: signal('ready'),
            apiReady: () => false,
            setRoute: () => Promise.resolve(),
          },
        },
      ],
    }).compileComponents();

    activateTranslations();
  });

  it('creates the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the plugin title in content header', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.shell-content__header h1')?.textContent).toContain('Role Refresher');
  });

  it('renders the handshake status badge', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.shell-content__meta p-tag')).toBeTruthy();
  });

  it('renders tenant and user context', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const context = compiled.querySelector('.shell-content__context');
    expect(context?.textContent).toContain('acme');
    expect(context?.textContent).toContain('Test User');
  });
});
