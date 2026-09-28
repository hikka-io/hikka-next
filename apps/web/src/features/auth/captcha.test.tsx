import { act, createRef } from 'react';
import { createRoot } from 'react-dom/client';

import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Captcha from './captcha';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const teardown: (() => void)[] = [];

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
    vi.unstubAllEnvs();
    for (const s of document.querySelectorAll('script')) s.remove();
});

async function render() {
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);
    const ref = createRef<TurnstileInstance | undefined>();

    await act(async () => root.render(<Captcha ref={ref} />));
    teardown.push(() => {
        root.unmount();
        container.remove();
    });

    return container;
}

const cloudflareScripts = () =>
    [...document.querySelectorAll('script')].filter((s) =>
        s.src.includes('challenges.cloudflare.com'),
    );

describe('Captcha', () => {
    it('renders nothing and loads nothing from Cloudflare when bypassed', async () => {
        vi.stubEnv('DEV', true);
        vi.stubEnv('VITE_CAPTCHA_BYPASS', 'fake_captcha');

        const container = await render();

        expect(container.innerHTML).toBe('');
        expect(cloudflareScripts()).toHaveLength(0);
    });

    it('renders the Turnstile widget otherwise', async () => {
        vi.stubEnv('VITE_CAPTCHA_BYPASS', '');

        const container = await render();

        expect(container.innerHTML).not.toBe('');
        expect(cloudflareScripts().length).toBeGreaterThan(0);
    });

    it('ignores the bypass outside development builds', async () => {
        vi.stubEnv('DEV', false);
        vi.stubEnv('VITE_CAPTCHA_BYPASS', 'fake_captcha');

        const container = await render();

        expect(container.innerHTML).not.toBe('');
        expect(cloudflareScripts().length).toBeGreaterThan(0);
    });
});
