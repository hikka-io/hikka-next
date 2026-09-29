import { useRef } from 'react';

import type { TurnstileInstance } from '@marsidev/react-turnstile';

import { getCaptchaToken } from './captcha-config';

/**
 * Turnstile captcha wiring shared by the login and signup forms: owns the
 * widget ref and exposes helpers to read the current token and reset it.
 * Render `<Captcha ref={captchaRef} />`.
 */
export function useCaptcha() {
    const captchaRef = useRef<TurnstileInstance>(undefined);

    return {
        captchaRef,
        getToken: () => getCaptchaToken(captchaRef.current),
        reset: () => captchaRef.current?.reset(),
    };
}
