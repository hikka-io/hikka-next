import type { TurnstileInstance } from '@marsidev/react-turnstile';

/**
 * Captcha without Cloudflare, for local development.
 *
 * The backend skips the Turnstile check when the `captcha` header equals its
 * `captcha.test` setting (`fake_captcha` in the default `settings.toml`).
 * Set `VITE_CAPTCHA_BYPASS` to that value in a local env file and the app
 * sends it instead of a Turnstile token — and does not load the Turnstile
 * widget at all, so nothing is requested from challenges.cloudflare.com.
 * The variable is honoured only by the dev server (`import.meta.env.DEV`);
 * production builds always use the real widget and token.
 */
export const getCaptchaBypass = (): string | undefined =>
    // Development only: a production build that inherits the variable by
    // accident must still render Turnstile and send a real token.
    (import.meta.env.DEV && import.meta.env.VITE_CAPTCHA_BYPASS) || undefined;

export function getCaptchaToken(ref: TurnstileInstance | undefined): string {
    const bypass = getCaptchaBypass();
    if (bypass) return bypass;

    return String(ref?.getResponse());
}
