import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';

import en from '../../../public/i18n/en.json';

/**
 * ngx-translate wiring for unit tests. Add {@link provideTranslateTesting} to the
 * TestBed providers, then call {@link activateTranslations} after
 * `compileComponents()` so `translate` pipes render the real `en` labels instead
 * of echoing their keys.
 */
export const provideTranslateTesting = () => provideTranslateService({ fallbackLang: 'en' });

export function activateTranslations(): void {
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', en);
  translate.use('en');
}
