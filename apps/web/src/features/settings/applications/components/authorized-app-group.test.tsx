import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { AuthTokenInfoResponse } from '@hikka/api';
import { thirdPartyAuthTokensQueryKey } from '@hikka/api';

import AuthorizedAppGroup from './authorized-app-group';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mocks = vi.hoisted(() => ({
    revoke: vi.fn(async (_request: unknown) => ({})),
    toastSuccess: vi.fn(),
    toastError: vi.fn(),
}));

vi.mock('@hikka/api', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hikka/api')>()),
    revokeTokenMutation: () => ({ mutationFn: mocks.revoke }),
}));

vi.mock('sonner', () => ({
    toast: { success: mocks.toastSuccess, error: mocks.toastError },
}));

const tokens = [
    { reference: 'ref-1', created: 1700000000 },
    { reference: 'ref-2', created: 1700000100 },
    { reference: 'ref-3', created: 1700000200 },
] as AuthTokenInfoResponse[];

const teardown: (() => void)[] = [];

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
    vi.clearAllMocks();
});

async function mount() {
    const queryClient = new QueryClient();
    queryClient.setQueryData(thirdPartyAuthTokensQueryKey(), { list: [] });
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);

    await act(async () =>
        root.render(
            <QueryClientProvider client={queryClient}>
                <AuthorizedAppGroup appName="App" tokens={tokens} />
            </QueryClientProvider>,
        ),
    );
    teardown.push(() => {
        root.unmount();
        container.remove();
    });

    return { queryClient, container };
}

const findButton = (root: ParentNode, label: string) =>
    Array.from(root.querySelectorAll('button')).find((button) =>
        button.textContent?.includes(label),
    );

async function revokeAll(container: HTMLElement) {
    await act(async () => findButton(container, 'Відкликати всі')?.click());
    await act(async () => findButton(document.body, 'Підтвердити')?.click());
}

describe('AuthorizedAppGroup revoke all', () => {
    it('revokes every session and refreshes the authorized apps list', async () => {
        const { queryClient, container } = await mount();

        await revokeAll(container);

        expect(mocks.revoke).toHaveBeenCalledTimes(3);
        expect(mocks.revoke.mock.calls.map(([request]) => request)).toEqual(
            tokens.map((token) => ({
                path: { token_reference: token.reference },
            })),
        );
        expect(
            queryClient.getQueryState(thirdPartyAuthTokensQueryKey())
                ?.isInvalidated,
        ).toBe(true);
        expect(mocks.toastSuccess).toHaveBeenCalledTimes(1);
    });

    it('shows its own error toast when one revoke fails', async () => {
        mocks.revoke.mockRejectedValueOnce(new Error('boom'));
        const { queryClient, container } = await mount();

        await revokeAll(container);

        expect(mocks.toastError).toHaveBeenCalledTimes(1);
        expect(mocks.toastSuccess).not.toHaveBeenCalled();
        expect(
            queryClient.getQueryState(thirdPartyAuthTokensQueryKey())
                ?.isInvalidated,
        ).toBe(false);
    });
});
