import type { TurnstileInstance } from '@marsidev/react-turnstile';

/**
 * Captcha without Cloudflare, for local development.
 *
 * The backend skips the Turnstile check when the `captcha` header equals its
 * `captcha.test` setting (`fake_captcha` in the default `settings.toml`).
 * Set `VITE_CAPTCHA_BYPASS` to that value in a local env file and the app
 * sends it instead of a Turnstile token — and does not load the Turnstile
 * widget at all, so nothing is requested from challenges.cloudflare.com.
 * Unset (production and normal builds), the real widget and token are used.
 */
export const getCaptchaBypass = (): string | undefined =>
    import.meta.env.VITE_CAPTCHA_BYPASS || undefined;

export function getCaptchaToken(ref: TurnstileInstance | undefined): string {
    const bypass = getCaptchaBypass();
    if (bypass) return bypass;

    return String(ref?.getResponse());
}
