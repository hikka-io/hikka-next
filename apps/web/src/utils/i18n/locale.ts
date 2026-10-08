import { uk } from 'date-fns/locale/uk';
import { setDefaultOptions } from 'date-fns/setDefaultOptions';

export const APP_LOCALE = uk;

export const APP_LOCALE_TAG = 'uk-UA';

export const applyDefaultLocale = () => {
    setDefaultOptions({ locale: APP_LOCALE });
};
