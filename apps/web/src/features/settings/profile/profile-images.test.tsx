import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ProfileImages from './profile-images';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mocks = vi.hoisted(() => ({
    mutationFn: vi.fn(),
    invalidateSession: vi.fn(),
    invalidateUserProfile: vi.fn(),
    refresh: vi.fn(),
}));

vi.mock('@hikka/api', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hikka/api')>()),
    deleteUserImageMutation: () => ({ mutationFn: mocks.mutationFn }),
}));

vi.mock('@/features/users', () => ({ CropEditorModal: () => null }));

vi.mock('@/services/session', () => ({
    useSession: () => ({
        user: { username: 'testuser', avatar: 'a.jpg', cover: 'c.jpg' },
    }),
}));

vi.mock('@/utils/api/invalidate-content-state', () => ({
    invalidateSession: mocks.invalidateSession,
    invalidateUserProfile: mocks.invalidateUserProfile,
}));

vi.mock('@/utils/navigation', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/utils/navigation')>()),
    useRouter: () => ({ refresh: mocks.refresh }),
}));

afterEach(() => {
    vi.clearAllMocks();
});

describe('ProfileImages', () => {
    it('refreshes the session and profile in place after deleting the cover', async () => {
        mocks.mutationFn.mockResolvedValue({});
        const queryClient = new QueryClient();
        const container = document.createElement('div');
        const root = createRoot(container);

        act(() =>
            root.render(
                <QueryClientProvider client={queryClient}>
                    <ProfileImages />
                </QueryClientProvider>,
            ),
        );

        await act(async () => {
            container.querySelector('button')?.click();
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(mocks.mutationFn.mock.calls[0]?.[0]).toEqual({
            path: { image_type: 'cover' },
        });
        expect(mocks.invalidateSession).toHaveBeenCalledWith(queryClient);
        expect(mocks.invalidateUserProfile).toHaveBeenCalledWith(
            queryClient,
            'testuser',
        );
        expect(mocks.refresh).not.toHaveBeenCalled();
        act(() => root.unmount());
    });
});
