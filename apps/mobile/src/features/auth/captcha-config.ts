export const CAPTCHA_SITE_KEY = '0x4AAAAAAANXs8kaCqjo_FLF';

// Turnstile checks the page hostname against the site key, so the widget page is loaded as if served from hikka.io.
export const CAPTCHA_ORIGIN = 'https://hikka.io';

// The backend skips Turnstile when the token equals its `captcha.test` setting; gated on __DEV__ so a release build never ships it.
export const CAPTCHA_BYPASS =
    (__DEV__ && process.env.EXPO_PUBLIC_CAPTCHA_BYPASS) || undefined;
