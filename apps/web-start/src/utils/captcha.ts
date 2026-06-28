import type { TurnstileInstance } from '@marsidev/react-turnstile';

/**
 * Returns the captcha token to send to the backend.
 *
 * In local development the backend accepts a fixed test value (see
 * `captcha.test` in the backend `settings.toml`) and skips Cloudflare
 * verification. Set `VITE_CAPTCHA_BYPASS=fake_captcha` in a local env file to
 * send that value instead of a real Turnstile token. When the var is unset
 * (production / normal builds) the real Turnstile token is used.
 */
export function getCaptchaToken(ref: TurnstileInstance | undefined): string {
    const bypass = import.meta.env.VITE_CAPTCHA_BYPASS;
    if (bypass) return String(bypass);

    return String(ref?.getResponse());
}
