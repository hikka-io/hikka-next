import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getIgnoredNotificationsOptions } from '@hikka/api';

import NotificationsSettings from './notifications-settings';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mocks = vi.hoisted(() => ({
    mutationFn: vi.fn(),
    invalidate: vi.fn(),
    success: vi.fn(),
}));

vi.mock('@hikka/api', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hikka/api')>()),
    changeIgnoredNotificationsMutation: () => ({
        mutationFn: mocks.mutationFn,
    }),
}));

vi.mock('@/utils/api/invalidate-content-state', () => ({
    invalidateIgnoredNotifications: mocks.invalidate,
}));

vi.mock('sonner', () => ({ toast: { success: mocks.success } }));

const GROUPS = [
    {
        title: 'Коментарі',
        items: [
            [
                'comment_reply',
                'Відповідь на коментар',
                'Ви отримаєте сповіщення, коли на ваш коментар відповіли',
            ],
            [
                'comment_tag',
                'Згадка в коментарі',
                'Ви отримаєте сповіщення, коли вас згадали(@) в коментарі',
            ],
            [
                'collection_comment',
                'Коментар у колекції',
                'Ви отримаєте сповіщення, коли у вашій колекції залишили коментар',
            ],
            [
                'article_comment',
                'Коментар у статті',
                'Ви отримаєте сповіщення, коли у вашій статті залишили коментар',
            ],
            [
                'edit_comment',
                'Коментар у правці',
                'Ви отримаєте сповіщення, коли вам залишать коментар у правці',
            ],
        ],
    },
    {
        title: 'Оцінки',
        items: [
            [
                'comment_vote',
                'Оцінка коментаря',
                'Ви отримаєте сповіщення, коли ваш коментар оцінили',
            ],
            [
                'collection_vote',
                'Оцінка колекції',
                'Ви отримаєте сповіщення, коли вашу колекцію оцінили',
            ],
            [
                'article_vote',
                'Оцінка статті',
                'Ви отримаєте сповіщення, коли вашу статтю оцінили',
            ],
        ],
    },
    {
        title: 'Правки',
        items: [
            [
                'edit_accepted',
                'Прийнята правка',
                'Ви отримаєте сповіщення, коли ваша правка прийнята',
            ],
            [
                'edit_denied',
                'Відхилена правка',
                'Ви отримаєте сповіщення, коли ваша правка відхилена',
            ],
        ],
    },
    {
        title: 'Аніме',
        items: [
            [
                'schedule_anime',
                'Оновлення аніме',
                'Ви отримаєте сповіщення про вихід нових епізодів аніме',
            ],
        ],
    },
    {
        title: 'Користувачі',
        items: [
            [
                'follow',
                'Підписка на користувача',
                'Ви отримаєте сповіщення, коли хтось підписався на Вас',
            ],
        ],
    },
    {
        title: 'Інше',
        items: [
            [
                'hikka_update',
                'Системні сповіщення',
                'Ви отримаєте сповіщення про системні зміни',
            ],
        ],
    },
];

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

async function mount(ignored: string[]) {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: Infinity, retry: false } },
    });
    queryClient.setQueryData(getIgnoredNotificationsOptions().queryKey, {
        ignored_notifications: ignored,
    });

    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);

    await act(async () =>
        root.render(
            <QueryClientProvider client={queryClient}>
                <NotificationsSettings />
            </QueryClientProvider>,
        ),
    );
    teardown.push(() => {
        root.unmount();
        container.remove();
    });

    const switchOf = (name: string) =>
        must(
            container.querySelector<HTMLElement>(
                `[role="switch"][aria-labelledby="${name}-label"]`,
            ),
            name,
        );

    return {
        container,
        queryClient,
        switchOf,
        toggle: (name: string) =>
            act(async () => {
                switchOf(name).click();
            }),
        submit: () =>
            act(async () => {
                must(container.querySelector('form'), 'form').dispatchEvent(
                    new Event('submit', { bubbles: true, cancelable: true }),
                );
            }),
    };
}

describe('notifications settings', () => {
    it('renders the six groups with their labels and descriptions in order', async () => {
        const { container } = await mount([]);

        const groups = [...container.querySelectorAll('form > div')].map(
            (group) => ({
                title: must(group.querySelector('h4'), 'title').textContent,
                items: [...group.querySelectorAll('[data-slot="field"]')].map(
                    (field) => [
                        must(field.querySelector('label'), 'label').htmlFor,
                        field.querySelector('label')?.textContent,
                        field.querySelector('[data-slot="field-description"]')
                            ?.textContent,
                    ],
                ),
            }),
        );

        expect(groups).toEqual(GROUPS);
        expect(container.querySelectorAll('[role="switch"]')).toHaveLength(13);
    });

    it('sends nothing as ignored while every switch is on', async () => {
        const { switchOf, submit } = await mount([]);

        expect(switchOf('comment_reply').getAttribute('aria-checked')).toBe(
            'true',
        );
        await submit();

        expect(mocks.mutationFn).toHaveBeenCalledTimes(1);
        expect(mocks.mutationFn.mock.calls[0][0]).toEqual({
            body: { ignored_notifications: [] },
        });
        expect(mocks.invalidate).not.toHaveBeenCalled();
        expect(mocks.success).toHaveBeenCalledWith(
            'Ви успішно змінили налаштування сповіщень.',
        );
    });

    it('turns the server ignored list off and round-trips hidden and unknown keys', async () => {
        const { switchOf, toggle, submit } = await mount([
            'comment_vote',
            'thirdparty_login',
            'edit_updated',
            'legacy_type',
        ]);

        expect(switchOf('comment_vote').getAttribute('aria-checked')).toBe(
            'false',
        );

        await toggle('comment_reply');
        await toggle('follow');
        await toggle('follow');
        await submit();

        expect(mocks.mutationFn.mock.calls[0][0]).toEqual({
            body: {
                ignored_notifications: [
                    'comment_reply',
                    'comment_vote',
                    'edit_updated',
                    'thirdparty_login',
                    'legacy_type',
                ],
            },
        });
    });

    it('drops a type from the payload once it is switched back on', async () => {
        const { toggle, submit } = await mount([
            'comment_vote',
            'hikka_update',
        ]);

        await toggle('comment_vote');
        await submit();

        expect(mocks.mutationFn.mock.calls[0][0]).toEqual({
            body: { ignored_notifications: ['hikka_update'] },
        });
    });

    it('writes the saved list from the PUT response into the cache', async () => {
        const saved = { ignored_notifications: ['comment_reply', 'follow'] };
        mocks.mutationFn.mockResolvedValueOnce(saved);
        const { queryClient, toggle, submit } = await mount([]);

        await toggle('comment_reply');
        await toggle('follow');
        await submit();

        expect(
            queryClient.getQueryData(getIgnoredNotificationsOptions().queryKey),
        ).toEqual(saved);
        expect(mocks.invalidate).not.toHaveBeenCalled();
    });
});
