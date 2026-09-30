import { act, type ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { HikkaApiError } from '@hikka/api';

import ActivationAlert from './activation-alert';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mocks = vi.hoisted(() => ({
    resend: vi.fn(),
    toastError: vi.fn(),
    toastSuccess: vi.fn(),
}));

vi.mock('@hikka/api', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hikka/api')>()),
    activationResendMutation: () => ({ mutationFn: mocks.resend }),
    userProfileOptions: () => ({
        queryKey: ['profile-under-test'],
        queryFn: async () => ({ username: 'newbie' }),
    }),
}));

vi.mock('@/services/session', () => ({
    useSession: () => ({
        user: { username: 'newbie', role: 'not_activated' },
    }),
}));

vi.mock('@/utils/navigation', () => ({
    useParams: () => ({ username: 'newbie' }),
}));

vi.mock('sonner', () => ({
    toast: { success: mocks.toastSuccess, error: mocks.toastError },
}));

const FALLBACK = 'Не вдалося надіслати лист. Спробуйте, будь ласка, ще раз';

const teardown: (() => void)[] = [];

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
    vi.clearAllMocks();
});

async function clickResend() {
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);

    await act(async () =>
        root.render(
            <QueryClientProvider client={new QueryClient()}>
                <ActivationAlert />
            </QueryClientProvider>,
        ),
    );
    teardown.push(() => {
        root.unmount();
        container.remove();
    });

    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
    });
    await act(async () => container.querySelector('button')?.click());
}

const toastText = (node: ReactElement) => renderToStaticMarkup(node);

describe('ActivationAlert resend failures', () => {
    it('explains that the activation link is still valid', async () => {
        mocks.resend.mockRejectedValue(
            new HikkaApiError('valid', 400, 'auth-modal:activation_valid'),
        );

        await clickResend();

        expect(mocks.toastError).toHaveBeenCalledTimes(1);
        expect(
            toastText(mocks.toastError.mock.calls[0]?.[0] as ReactElement),
        ).toContain('Ваше посилання досі активне');
    });

    it('shows the backend message for any other API error', async () => {
        mocks.resend.mockRejectedValue(
            new HikkaApiError('Занадто багато спроб', 429, 'rate_limit'),
        );

        await clickResend();

        expect(mocks.toastError).toHaveBeenCalledWith('Занадто багато спроб');
    });

    it('falls back to the generic message when the error carries none', async () => {
        mocks.resend.mockRejectedValue({ detail: 'nope' });

        await clickResend();

        expect(mocks.toastError).toHaveBeenCalledWith(FALLBACK);
    });

    it('treats a plain error that only mimics the code as a generic failure', async () => {
        mocks.resend.mockRejectedValue(
            Object.assign(new Error('mimic'), {
                code: 'auth-modal:activation_valid',
            }),
        );

        await clickResend();

        expect(mocks.toastError).toHaveBeenCalledWith('mimic');
    });
});
