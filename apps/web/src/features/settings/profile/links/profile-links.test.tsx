import { act, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { API_LIMITS } from '@hikka/api';

import ProfileLinks from './profile-links';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mocks = vi.hoisted(() => ({
    mutationFn: vi.fn(),
    invalidateSession: vi.fn(),
    invalidateUserProfile: vi.fn(),
    success: vi.fn(),
    links: [] as unknown[],
}));

vi.mock('@hikka/api', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hikka/api')>()),
    changeLinksMutation: () => ({ mutationFn: mocks.mutationFn }),
}));

vi.mock('@/components/ui/responsive-modal', () => ({
    ResponsiveModal: ({
        open,
        children,
    }: {
        open: boolean;
        children: ReactNode;
    }) => (open ? children : null),
    ResponsiveModalContent: ({ children }: { children: ReactNode }) => children,
    ResponsiveModalFooter: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('sonner', () => ({ toast: { success: mocks.success } }));

vi.mock('@/services/session', () => ({
    useSession: () => ({
        user: { username: 'testuser', links: mocks.links },
    }),
}));

vi.mock('@/utils/api/invalidate-content-state', () => ({
    invalidateSession: mocks.invalidateSession,
    invalidateUserProfile: mocks.invalidateUserProfile,
}));

const GITHUB = {
    icon: 'github',
    url: 'https://github.com/hikka-io',
    text: null,
};
const TELEGRAM = { icon: 'telegram', url: 'https://t.me/hikka', text: 'Канал' };
const CUSTOM = { icon: 'custom', url: 'https://example.org/me', text: null };

const teardown: (() => void)[] = [];

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
    vi.clearAllMocks();
});

function must<T>(value: T | null | undefined, what: string): T {
    if (value == null) throw new Error(`missing ${what}`);

    return value;
}

async function mount(links: unknown[]) {
    mocks.links = links;
    mocks.mutationFn.mockResolvedValue({});
    const queryClient = new QueryClient();
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);

    await act(async () =>
        root.render(
            <QueryClientProvider client={queryClient}>
                <ProfileLinks />
            </QueryClientProvider>,
        ),
    );
    teardown.push(() => {
        root.unmount();
        container.remove();
    });

    const buttons = (label: string) =>
        [...container.querySelectorAll<HTMLButtonElement>('button')].filter(
            (button) =>
                button.getAttribute('aria-label') === label ||
                button.textContent?.trim() === label,
        );

    return {
        container,
        queryClient,
        buttons,
        labels: () =>
            [
                ...container.querySelectorAll(
                    'button.flex-1 > span:last-child > span:first-child',
                ),
            ].map((el) => el.textContent),
        click: (button: HTMLElement) => act(async () => button.click()),
        save: async () => {
            await act(async () => {
                must(container.querySelector('form'), 'form').dispatchEvent(
                    new Event('submit', { bubbles: true, cancelable: true }),
                );
                await new Promise((resolve) => setTimeout(resolve, 0));
            });
        },
    };
}

const sentLinks = () => mocks.mutationFn.mock.calls[0]?.[0].body.links;

describe('ProfileLinks', () => {
    it('renders the stored links in order', async () => {
        const { labels } = await mount([GITHUB, TELEGRAM, CUSTOM]);

        expect(labels()).toEqual(['GitHub', 'Канал', 'example.org']);
    });

    it('hides stored entries with an unknown icon or a non-web url', async () => {
        const { labels } = await mount([
            GITHUB,
            { icon: 'myspace', url: 'https://myspace.com/x', text: null },
            { icon: 'custom', url: 'javascript:alert(1)', text: null },
        ]);

        expect(labels()).toEqual(['GitHub']);
    });

    it('saves the links in order without ids and invalidates the caches', async () => {
        const { queryClient, save } = await mount([GITHUB, TELEGRAM]);

        await save();

        expect(mocks.mutationFn.mock.calls[0]?.[0]).toEqual({
            body: { links: [GITHUB, TELEGRAM] },
        });
        expect(sentLinks().every((link: object) => !('id' in link))).toBe(true);
        expect(mocks.invalidateSession).toHaveBeenCalledWith(queryClient);
        expect(mocks.invalidateUserProfile).toHaveBeenCalledWith(
            queryClient,
            'testuser',
        );
        expect(mocks.success).toHaveBeenCalled();
    });

    it('reorders with the move buttons and sends the new order', async () => {
        const { buttons, click, labels, save } = await mount([
            GITHUB,
            TELEGRAM,
            CUSTOM,
        ]);

        await click(must(buttons('Перемістити нижче')[0], 'down'));
        expect(labels()).toEqual(['Канал', 'GitHub', 'example.org']);

        await click(must(buttons('Перемістити вище')[2], 'up'));
        expect(labels()).toEqual(['Канал', 'example.org', 'GitHub']);

        await save();

        expect(sentLinks()).toEqual([TELEGRAM, CUSTOM, GITHUB]);
    });

    it('disables the edge move buttons', async () => {
        const { buttons } = await mount([GITHUB, TELEGRAM]);

        expect(buttons('Перемістити вище')[0]?.disabled).toBe(true);
        expect(buttons('Перемістити нижче')[1]?.disabled).toBe(true);
    });

    it('removes a row with the delete button', async () => {
        const { buttons, click, labels, save } = await mount([
            GITHUB,
            TELEGRAM,
        ]);

        await click(must(buttons('Видалити')[0], 'delete'));
        expect(labels()).toEqual(['Канал']);

        await save();

        expect(sentLinks()).toEqual([TELEGRAM]);
    });

    it('disables Add at the link limit', async () => {
        const below = await mount(
            Array.from({ length: API_LIMITS.userLinks.max - 1 }, () => GITHUB),
        );
        expect(below.buttons('Додати посилання')[0]?.disabled).toBe(false);

        const full = await mount(
            Array.from({ length: API_LIMITS.userLinks.max }, () => GITHUB),
        );
        expect(full.buttons('Додати посилання')[0]?.disabled).toBe(true);
    });
});
