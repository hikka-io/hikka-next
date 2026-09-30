import { act, forwardRef, useImperativeHandle } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { UploadTypeEnum } from '@hikka/api';

import CropEditorModal from './crop-editor-modal';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mocks = vi.hoisted(() => ({
    mutationFn: vi.fn(),
    invalidateSession: vi.fn(),
    invalidateUserProfile: vi.fn(),
    refresh: vi.fn(),
    success: vi.fn(),
}));

vi.mock('@hikka/api', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hikka/api')>()),
    uploadImageMutation: () => ({ mutationFn: mocks.mutationFn }),
}));

vi.mock('react-avatar-editor', () => ({
    default: forwardRef((_props, ref) => {
        useImperativeHandle(ref, () => ({
            getImageScaledToCanvas: () => document.createElement('canvas'),
        }));
        return null;
    }),
}));

vi.mock('sonner', () => ({ toast: { success: mocks.success } }));

vi.mock('@/components/ui/responsive-modal', () => ({
    ResponsiveModal: ({ children }: { children: React.ReactNode }) => children,
    ResponsiveModalContent: ({ children }: { children: React.ReactNode }) =>
        children,
    ResponsiveModalFooter: ({ children }: { children: React.ReactNode }) =>
        children,
}));

vi.mock('@/components/ui/slider', () => ({ Slider: () => null }));

vi.mock('@/services/session', () => ({
    useSession: () => ({ user: { username: 'testuser' } }),
}));

vi.mock('@/utils/api/invalidate-content-state', () => ({
    invalidateSession: mocks.invalidateSession,
    invalidateUserProfile: mocks.invalidateUserProfile,
}));

vi.mock('@/utils/image', () => ({
    getImage: async () => new File(['x'], 'avatar.jpg'),
}));

vi.mock('@/utils/navigation', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/utils/navigation')>()),
    useRouter: () => ({ refresh: mocks.refresh }),
}));

afterEach(() => {
    vi.clearAllMocks();
});

describe('CropEditorModal', () => {
    it('refreshes the session and profile in place after an upload', async () => {
        mocks.mutationFn.mockResolvedValue({});
        const onOpenChange = vi.fn();
        const queryClient = new QueryClient();
        const container = document.createElement('div');
        const root = createRoot(container);

        act(() =>
            root.render(
                <QueryClientProvider client={queryClient}>
                    <CropEditorModal
                        open
                        onOpenChange={onOpenChange}
                        file={new File(['x'], 'avatar.png')}
                        type={UploadTypeEnum.AVATAR}
                    />
                </QueryClientProvider>,
            ),
        );

        await act(async () => {
            container.querySelector('button')?.click();
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(mocks.mutationFn.mock.calls[0]?.[0]).toMatchObject({
            path: { upload_type: UploadTypeEnum.AVATAR },
        });
        expect(mocks.invalidateSession).toHaveBeenCalledWith(queryClient);
        expect(mocks.invalidateUserProfile).toHaveBeenCalledWith(
            queryClient,
            'testuser',
        );
        expect(mocks.refresh).not.toHaveBeenCalled();
        expect(onOpenChange).toHaveBeenCalledWith(false);
        act(() => root.unmount());
    });
});
