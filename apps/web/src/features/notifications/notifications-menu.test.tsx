import { act, cloneElement, type ReactElement, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NotificationsMenu from './notifications-menu';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mocks = vi.hoisted(() => ({
    fetchList: vi.fn(),
    markSeen: vi.fn(),
    invalidate: vi.fn(async () => {}),
}));

vi.mock('@hikka/api', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hikka/api')>()),
    notificationsInfiniteOptions: () => ({
        queryKey: ['notifications-list'],
        queryFn: mocks.fetchList,
    }),
    unseenNotificationsCountOptions: () => ({
        queryKey: ['notifications-count'],
        queryFn: async () => ({ unseen: 2 }),
    }),
    notificationSeenMutation: () => ({ mutationFn: mocks.markSeen }),
}));

vi.mock('@/services/hooks/use-media-query', () => ({
    useIsDesktop: () => true,
}));

vi.mock('@/components/ui/dropdown-menu', () => ({
    DropdownMenu: ({ children }: { children?: ReactNode }) => <>{children}</>,
    DropdownMenuTrigger: ({
        render,
        ...props
    }: {
        render: ReactElement<Record<string, unknown>>;
    }) => cloneElement(render, props),
    DropdownMenuContent: ({ children }: { children?: ReactNode }) => (
        <>{children}</>
    ),
    DropdownMenuSeparator: () => null,
}));

vi.mock('./components/notifications-content', () => ({ default: () => null }));

vi.mock('./components/notifications-header', () => ({
    default: ({ onMarkAllSeen }: { onMarkAllSeen: () => void }) => (
        <button type="button" data-testid="mark-all" onClick={onMarkAllSeen} />
    ),
}));

vi.mock('./utils/convert-notification', () => ({
    convertNotification: (n: { reference: string; seen: boolean }) => n,
}));

vi.mock('./utils/group-notifications-by-day', () => ({
    groupNotificationsByDay: () => [],
}));

vi.mock('@/utils/api/invalidate-content-state', () => ({
    invalidateNotifications: mocks.invalidate,
}));

const PAGE = {
    list: [
        { reference: 'n1', seen: false },
        { reference: 'n2', seen: true },
        { reference: 'n3', seen: false },
    ],
    pagination: { page: 1, pages: 1, total: 3 },
};

const teardown: (() => void)[] = [];

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
    vi.clearAllMocks();
});

async function renderMenu() {
    mocks.fetchList.mockResolvedValue(PAGE);
    mocks.markSeen.mockResolvedValue(undefined);

    const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: 60_000, retry: false } },
    });
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
        root.render(
            <QueryClientProvider client={queryClient}>
                <NotificationsMenu />
            </QueryClientProvider>,
        );
    });

    teardown.push(() => {
        root.unmount();
        container.remove();
    });

    const trigger = container.querySelector('button') as HTMLButtonElement;
    const markAll = container.querySelector(
        '[data-testid="mark-all"]',
    ) as HTMLButtonElement;

    return { trigger, markAll };
}

const warm = (trigger: HTMLElement) =>
    act(async () => {
        trigger.focus();
        await new Promise((resolve) => setTimeout(resolve, 20));
    });

describe('NotificationsMenu', () => {
    it('does not fetch the list while the bell is untouched', async () => {
        await renderMenu();

        expect(mocks.fetchList).not.toHaveBeenCalled();
    });

    it('warms the list when the bell receives focus, once while fresh', async () => {
        const { trigger } = await renderMenu();

        await act(async () => {
            trigger.focus();
        });
        await act(async () => {
            trigger.blur();
            trigger.focus();
        });

        expect(mocks.fetchList).toHaveBeenCalledTimes(1);
    });

    it('warms the list when the pointer enters the bell', async () => {
        const { trigger } = await renderMenu();

        await act(async () => {
            trigger.dispatchEvent(
                new MouseEvent('pointerover', { bubbles: true }),
            );
        });

        expect(mocks.fetchList).toHaveBeenCalledTimes(1);
    });

    it('marks every unseen notification and invalidates once', async () => {
        const { trigger, markAll } = await renderMenu();
        await warm(trigger);

        await act(async () => {
            markAll.click();
        });

        expect(mocks.markSeen).toHaveBeenCalledTimes(2);
        expect(mocks.markSeen.mock.calls.map(([vars]) => vars)).toStrictEqual([
            { path: { notification_reference: 'n1' } },
            { path: { notification_reference: 'n3' } },
        ]);
        expect(mocks.invalidate).toHaveBeenCalledTimes(1);
    });

    it('still invalidates once when a request fails', async () => {
        const { trigger, markAll } = await renderMenu();
        mocks.markSeen.mockRejectedValue(new Error('boom'));
        await warm(trigger);

        await act(async () => {
            markAll.click();
        });

        expect(mocks.markSeen).toHaveBeenCalledTimes(2);
        expect(mocks.invalidate).toHaveBeenCalledTimes(1);
    });
});
