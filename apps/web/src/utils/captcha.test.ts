import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getCaptchaBypass, getCaptchaToken } from './captcha';

const widget = { getResponse: () => 'turnstile-token' } as TurnstileInstance;

afterEach(() => {
    vi.unstubAllEnvs();
});

describe('captcha without Cloudflare', () => {
    it('ignores the bypass outside development builds', () => {
        vi.stubEnv('DEV', false);
        vi.stubEnv('VITE_CAPTCHA_BYPASS', 'fake_captcha');

        expect(getCaptchaBypass()).toBeUndefined();
        expect(getCaptchaToken(widget)).toBe('turnstile-token');
    });

    it('uses the Turnstile token when no bypass is configured', () => {
        vi.stubEnv('VITE_CAPTCHA_BYPASS', '');

        expect(getCaptchaBypass()).toBeUndefined();
        expect(getCaptchaToken(widget)).toBe('turnstile-token');
    });

    it("sends the backend's test value instead, with or without a widget", () => {
        vi.stubEnv('VITE_CAPTCHA_BYPASS', 'fake_captcha');

        expect(getCaptchaBypass()).toBe('fake_captcha');
        expect(getCaptchaToken(widget)).toBe('fake_captcha');
        expect(getCaptchaToken(undefined)).toBe('fake_captcha');
    });
});
