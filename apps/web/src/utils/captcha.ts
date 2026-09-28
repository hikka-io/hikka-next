import type { TurnstileInstance } from '@marsidev/react-turnstile';

// The backend skips Turnstile when the token equals its `captcha.test` setting;
// gated on DEV so a production build never ships the bypass.
export const getCaptchaBypass = (): string | undefined =>
    (import.meta.env.DEV && import.meta.env.VITE_CAPTCHA_BYPASS) || undefined;

export function getCaptchaToken(ref: TurnstileInstance | undefined): string {
    const bypass = getCaptchaBypass();
    if (bypass) return bypass;

    return String(ref?.getResponse());
}
