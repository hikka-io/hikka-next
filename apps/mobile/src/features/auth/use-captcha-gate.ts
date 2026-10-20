import { useCallback, useState } from 'react';

import { CAPTCHA_BYPASS } from './captcha-config';

// The widget is remounted (new key) after a failed request, since a Turnstile token is single use.
export function useCaptchaGate() {
    const [token, setToken] = useState(CAPTCHA_BYPASS);
    const [widgetKey, setWidgetKey] = useState(0);
    const [waiting, setWaiting] = useState(false);

    const onToken = useCallback((next: string | undefined) => {
        setToken(next);
        if (next) setWaiting(false);
    }, []);

    const reset = useCallback(() => {
        if (CAPTCHA_BYPASS) return;
        setToken(undefined);
        setWidgetKey((key) => key + 1);
    }, []);

    const take = useCallback(() => {
        if (!token) setWaiting(true);
        return token;
    }, [token]);

    return { token, widgetKey, waiting, onToken, reset, take };
}
