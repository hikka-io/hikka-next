import { useRef } from 'react';

import type { TurnstileInstance } from '@marsidev/react-turnstile';

import { getCaptchaToken } from '@/utils/captcha';

export const CAPTCHA_SITE_KEY = '0x4AAAAAAANXs8kaCqjo_FLF';

/**
 * Turnstile captcha wiring shared by the login and signup forms: owns the
 * widget ref and exposes helpers to read the current token and reset it.
 * Render `<Turnstile ref={captchaRef} siteKey={CAPTCHA_SITE_KEY} />`.
 */
export function useCaptcha() {
    const captchaRef = useRef<TurnstileInstance>(undefined);

    return {
        captchaRef,
        getToken: () => getCaptchaToken(captchaRef.current),
        reset: () => captchaRef.current?.reset(),
    };
}
