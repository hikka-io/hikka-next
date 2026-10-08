import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    ContentTypeEnum,
    type MainContentTypeEnum,
    type ReadResponse,
    type WatchResponse,
} from '@hikka/api';

import { DEBOUNCE_MS } from '@/services/hooks/use-debounce';
import { CHAPTER_FORMS, EPISODE_FORMS } from '@/utils/i18n/word-forms';

import UserContentStats from './user-content-stats';

type Body = Record<string, unknown>;
type Entry = WatchResponse | ReadResponse;
type Sent = {
    path: Record<string, string>;
    body: Body;
    resolve: () => void;
};

const mocks = vi.hoisted(() => ({
    sent: [] as Sent[],
    onSaved: (_body: Body) => {},
}));

vi.mock('@/components/tracking', async () => {
    const { useMutation } = await import('@tanstack/react-query');

    const useAddEntry = () =>
        useMutation({
            mutationFn: ({ path, body }: Omit<Sent, 'resolve'>) =>
                new Promise<Body>((resolve) => {
                    mocks.sent.push({
                        path,
                        body,
                        resolve: () => resolve(body),
                    });
                }),
            onSuccess: (body: Body) => mocks.onSaved(body),
        });

    return { useAddWatch: useAddEntry, useAddRead: useAddEntry };
});

vi.mock('@/components/markdown', () => ({
    MDViewer: ({ children }: { children: ReactNode }) => <p>{children}</p>,
}));

vi.mock('@/components/text-expand', () => ({
    default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

const WATCH_ENTRY = {
    reference: 'watch-reference',
    status: 'watching',
    episodes: 3,
    score: 6,
    note: 'old note',
    rewatches: 1,
    start_date: 1700000000,
    end_date: null,
    anime: { slug: 'anime-slug', episodes_total: 12 },
} as unknown as WatchResponse;

const READ_ENTRY = {
    reference: 'read-reference',
    status: 'reading',
    chapters: 3,
    volumes: 1,
    score: 6,
    note: 'old note',
    rereads: 1,
    start_date: 1700000000,
    end_date: null,
    content: { slug: 'manga-slug', chapters: 12, data_type: 'manga' },
} as unknown as ReadResponse;

const CASES = [
    {
        contentType: ContentTypeEnum.ANIME,
        entry: WATCH_ENTRY,
        path: { slug: 'anime-slug' },
        progressKey: 'episodes',
        unit: EPISODE_FORMS[0],
        snapshot: { rewatches: 1, status: 'watching' },
    },
    {
        contentType: ContentTypeEnum.MANGA,
        entry: READ_ENTRY,
        path: { content_type: ContentTypeEnum.MANGA, slug: 'manga-slug' },
        progressKey: 'chapters',
        unit: CHAPTER_FORMS[0],
        snapshot: { volumes: 1, rereads: 1, status: 'reading' },
    },
] as const;

let root: Root;
let container: HTMLDivElement;
let queryClient: QueryClient;
let current: Entry;

const render = (contentType: MainContentTypeEnum, entry: Entry) => {
    current = entry;
    root.render(
        <QueryClientProvider client={queryClient}>
            <UserContentStats content_type={contentType} listItem={entry} />
        </QueryClientProvider>,
    );
};

const flush = () =>
    act(async () => {
        await vi.advanceTimersByTimeAsync(0);
    });

const advance = (ms: number) =>
    act(async () => {
        await vi.advanceTimersByTimeAsync(ms);
    });

const button = (label: string) => {
    const found = [...container.querySelectorAll('button')].find(
        (el) =>
            el.getAttribute('aria-label') === label ||
            el.textContent?.trim() === label,
    );
    if (!found) throw new Error(`No button ${label}`);
    return found;
};

const click = async (el: HTMLElement) => {
    await act(async () => el.click());
    await flush();
};

const typeNote = async (value: string) => {
    await click(button('Редагувати нотатку'));
    const textarea = container.querySelector('textarea');
    if (!textarea) throw new Error('No note textarea');
    await act(async () => {
        Object.getOwnPropertyDescriptor(
            HTMLTextAreaElement.prototype,
            'value',
        )?.set?.call(textarea, value);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
    });
};

const resolveAll = async () => {
    for (const request of mocks.sent) request.resolve();
    await flush();
};

beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    mocks.sent = [];
    queryClient = new QueryClient();
    container = document.createElement('div');
    root = createRoot(container);
});

afterEach(() => {
    act(() => root.unmount());
    queryClient.clear();
    vi.useRealTimers();
    vi.unstubAllGlobals();
});

describe.each(CASES)(
    'UserContentStats ($contentType)',
    ({ contentType, entry, path, progressKey, unit, snapshot }) => {
        beforeEach(async () => {
            mocks.onSaved = (body) =>
                render(contentType, {
                    ...current,
                    ...body,
                    note: body.note ?? null,
                } as Entry);
            await act(async () => render(contentType, entry));
        });

        it('writes the progress with the full snapshot after the debounce', async () => {
            await click(button(`Додати ${unit}`));

            await advance(DEBOUNCE_MS.commit - 1);
            expect(mocks.sent).toHaveLength(0);

            await advance(1);
            expect(
                mocks.sent.map(({ resolve, ...request }) => request),
            ).toEqual([
                {
                    path,
                    body: {
                        ...snapshot,
                        [progressKey]: 4,
                        score: 6,
                        note: 'old note',
                        start_date: 1700000000,
                        end_date: null,
                    },
                },
            ]);
        });

        it('keeps a note saved while a progress click lands during the save', async () => {
            await typeNote('new note');
            await click(button('Зберегти'));
            expect(mocks.sent.map(({ body }) => body.note)).toEqual([
                'new note',
            ]);

            const add = button(`Додати ${unit}`);
            const disabledDuringSave = [
                add.disabled,
                button(`Прибрати ${unit}`).disabled,
            ];
            await click(add);
            await advance(DEBOUNCE_MS.commit);
            await resolveAll();
            await advance(DEBOUNCE_MS.commit);

            expect(container.querySelector('textarea')).toBeNull();
            expect(mocks.sent.map(({ body }) => body.note)).toEqual([
                'new note',
            ]);
            expect(current.note).toBe('new note');
            expect(disabledDuringSave).toEqual([true, true]);

            expect(button(`Додати ${unit}`).disabled).toBe(false);
            await click(button(`Додати ${unit}`));
            await advance(DEBOUNCE_MS.commit);

            expect(mocks.sent.at(-1)?.body).toEqual({
                ...snapshot,
                [progressKey]: 4,
                score: 6,
                note: 'new note',
                start_date: 1700000000,
                end_date: null,
            });
        });

        it('keeps a note saved while a score change lands during the save', async () => {
            await typeNote('new note');
            await click(button('Зберегти'));

            const rating =
                container.querySelector<HTMLElement>('[role="slider"]');
            await act(async () => {
                rating?.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowRight',
                        bubbles: true,
                    }),
                );
            });
            await advance(DEBOUNCE_MS.commit);
            await resolveAll();
            await advance(DEBOUNCE_MS.commit);

            expect(container.querySelector('textarea')).toBeNull();
            expect(mocks.sent.map(({ body }) => body.note)).toEqual([
                'new note',
            ]);
            expect(current.note).toBe('new note');
        });

        it('sends the pending progress with the note and skips the debounced write', async () => {
            await click(button(`Додати ${unit}`));
            await typeNote('new note');
            await click(button('Зберегти'));
            await advance(DEBOUNCE_MS.commit);

            expect(mocks.sent.map(({ body }) => body)).toEqual([
                {
                    ...snapshot,
                    [progressKey]: 4,
                    score: 6,
                    note: 'new note',
                    start_date: 1700000000,
                    end_date: null,
                },
            ]);
        });

        it('drops a pending progress write when the slug changes', async () => {
            await click(button(`Додати ${unit}`));

            const other = {
                ...entry,
                reference: 'other-reference',
                ...(contentType === ContentTypeEnum.ANIME
                    ? { anime: { slug: 'other-slug', episodes_total: 12 } }
                    : {
                          content: {
                              slug: 'other-slug',
                              chapters: 12,
                              data_type: 'manga',
                          },
                      }),
            } as Entry;
            await act(async () => render(contentType, other));
            await advance(DEBOUNCE_MS.commit);

            expect(mocks.sent).toHaveLength(0);
            expect(container.textContent).toContain('3/12');
        });
    },
);
