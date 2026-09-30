import {
    act,
    type ComponentType,
    createElement,
    type ReactElement,
} from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';

import {
    hashKey,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import {
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';

import {
    type AnimeResponse,
    ContentTypeEnum,
    configureBrowserClient,
    type MangaResponse,
    type NovelResponse,
    type ReadContentTypeEnum,
    type ReadResponseBase,
    readGetQueryKey,
    type WatchResponseBase,
    watchGetQueryKey,
} from '@hikka/api';

import {
    READ_STATUS_ICONS,
    WATCH_STATUS_ICONS,
} from '@/components/icons/list-status-icons';
import { type ButtonProps, buttonVariants } from '@/components/ui/button';
import {
    applyReadMutation,
    applyWatchMutation,
} from '@/utils/api/invalidate-content-state';
import { QUERY_CLIENT_DEFAULTS } from '@/utils/api/query-defaults';
import { cn } from '@/utils/cn';

import ReadListButton from './read-list-button';
import WatchListButton from './watch-list-button';

const { dialogs } = vi.hoisted(() => ({
    dialogs: [] as Record<string, unknown>[],
}));

vi.mock('@/utils/api/invalidate-content-state', () => ({
    applyReadDeletion: vi.fn(),
    applyReadMutation: vi.fn(),
    applyWatchDeletion: vi.fn(),
    applyWatchMutation: vi.fn(),
}));
vi.mock('./list-entry-edit-dialog', () => ({
    default: (props: Record<string, unknown>) => {
        dialogs.push(props);
        return null;
    },
}));

const BASE_URL = 'https://api.test';
const ADD_LABEL = 'Додати у список';

const WATCH_FULL: WatchResponseBase = {
    reference: 'watch',
    note: 'note',
    updated: 1,
    created: 1,
    status: 'watching',
    rewatches: 1,
    duration: 24,
    episodes: 5,
    score: 7,
    start_date: 1700000000,
    end_date: 1700100000,
};
const WATCH_EMPTY: WatchResponseBase = {
    ...WATCH_FULL,
    status: 'planned',
    note: null,
    rewatches: 0,
    episodes: 0,
    score: 0,
    start_date: null,
    end_date: null,
};
const READ_FULL: ReadResponseBase = {
    reference: 'read',
    note: 'note',
    updated: 1,
    created: 1,
    status: 'reading',
    chapters: 5,
    volumes: 1,
    rereads: 1,
    score: 7,
    start_date: 1700000000,
    end_date: 1700100000,
};
const READ_EMPTY: ReadResponseBase = {
    ...READ_FULL,
    status: 'planned',
    note: null,
    chapters: 0,
    volumes: 0,
    rereads: 0,
    score: 0,
    start_date: null,
    end_date: null,
};

const CONTENT_DATA = {
    start_date: null,
    end_date: null,
    created: null,
    updated: null,
    media_type: null,
    title_ua: 'Назва',
    title_en: null,
    translated_ua: false,
    native_score: 0,
    native_scored_by: 0,
    score: 0,
    scored_by: 0,
    status: null,
    image: null,
    year: null,
    mal_id: 1,
    genres: [],
    synopsis_en: null,
    synopsis_ua: null,
};

type Entry = WatchResponseBase | ReadResponseBase;

type Props = {
    entry?: Entry | null;
    content?: object;
    size?: 'sm' | 'md' | 'icon-sm' | 'icon-md';
    disabled?: boolean;
    buttonProps?: ButtonProps;
};

type Kind = {
    name: string;
    slug: string;
    contentType: string;
    url: string;
    entryProp: 'watch' | 'read';
    statuses: string[];
    titles: string[];
    icons: Record<string, ComponentType>;
    iconBorder: string | undefined;
    full: Entry;
    empty: Entry;
    content: object;
    unknownLength: object;
    response: object;
    carried: { none: string; empty: string; full: string };
    completed: [string, Props, string][];
    path: object;
    entryQueryHash: () => string;
    apply: typeof applyWatchMutation | typeof applyReadMutation;
    other: typeof applyWatchMutation | typeof applyReadMutation;
    render: (props: Props) => ReactElement;
};

const WATCH_KIND: Kind = {
    name: 'anime',
    slug: 'anime-slug',
    contentType: ContentTypeEnum.ANIME,
    url: `${BASE_URL}/watch/anime-slug`,
    entryProp: 'watch',
    statuses: ['planned', 'watching', 'completed', 'on_hold', 'dropped'],
    titles: ['Заплановано', 'Дивлюсь', 'Завершено', 'Відкладено', 'Закинуто'],
    icons: WATCH_STATUS_ICONS,
    iconBorder: undefined,
    full: WATCH_FULL,
    empty: WATCH_EMPTY,
    content: { slug: 'anime-slug', episodes_total: 12 },
    unknownLength: { slug: 'anime-slug', episodes_total: null },
    response: {
        ...WATCH_FULL,
        anime: {
            ...CONTENT_DATA,
            data_type: 'anime',
            slug: 'anime-slug',
            title_ja: null,
            episodes_released: 12,
            episodes_total: 12,
            season: null,
            source: null,
            rating: null,
            studios: [],
        },
    },
    carried: {
        none: '',
        empty: '"start_date":null,"end_date":null',
        full: '"episodes":5,"score":7,"note":"note","rewatches":1,"start_date":1700000000,"end_date":1700100000',
    },
    completed: [
        [
            'without an entry',
            { entry: null, content: { episodes_total: 12 } },
            '{"status":"completed","episodes":12}',
        ],
        [
            'without an entry or content',
            { entry: null },
            '{"status":"completed"}',
        ],
        [
            'an empty entry',
            { entry: WATCH_EMPTY, content: { episodes_total: 12 } },
            '{"status":"completed","episodes":12,"start_date":null,"end_date":null}',
        ],
        [
            'a full entry',
            { entry: WATCH_FULL, content: { episodes_total: 12 } },
            '{"status":"completed","episodes":12,"score":7,"note":"note","rewatches":1,"start_date":1700000000,"end_date":1700100000}',
        ],
        [
            'a full entry of unknown length',
            { entry: WATCH_FULL, content: { episodes_total: null } },
            '{"status":"completed","episodes":5,"score":7,"note":"note","rewatches":1,"start_date":1700000000,"end_date":1700100000}',
        ],
        [
            'a full entry without content',
            { entry: WATCH_FULL },
            '{"status":"completed","episodes":5,"score":7,"note":"note","rewatches":1,"start_date":1700000000,"end_date":1700100000}',
        ],
    ],
    path: { slug: 'anime-slug' },
    entryQueryHash: () =>
        hashKey(watchGetQueryKey({ path: { slug: 'anime-slug' } })),
    apply: applyWatchMutation,
    other: applyReadMutation,
    render: ({ entry, content, ...props }) => (
        <WatchListButton
            {...props}
            slug="anime-slug"
            watch={entry as WatchResponseBase | null | undefined}
            anime={content as AnimeResponse | undefined}
        />
    ),
};

const readKind = (contentType: ReadContentTypeEnum): Kind => ({
    name: contentType,
    slug: `${contentType}-slug`,
    contentType,
    url: `${BASE_URL}/read/${contentType}/${contentType}-slug`,
    entryProp: 'read',
    statuses: ['planned', 'completed', 'on_hold', 'dropped', 'reading'],
    titles: ['Заплановано', 'Завершено', 'Відкладено', 'Закинуто', 'Читаю'],
    icons: READ_STATUS_ICONS,
    iconBorder: 'border',
    full: READ_FULL,
    empty: READ_EMPTY,
    content: { slug: `${contentType}-slug`, chapters: 40, volumes: 4 },
    unknownLength: { slug: `${contentType}-slug`, chapters: null, volumes: 0 },
    response: {
        ...READ_FULL,
        content: {
            ...CONTENT_DATA,
            data_type: contentType,
            slug: `${contentType}-slug`,
            title_original: null,
            chapters: 40,
            volumes: 4,
            magazines: [],
        },
    },
    carried: {
        none: '',
        empty: '"start_date":null,"end_date":null',
        full: '"chapters":5,"volumes":1,"score":7,"note":"note","rereads":1,"start_date":1700000000,"end_date":1700100000',
    },
    completed: [
        [
            'without an entry',
            { entry: null, content: { chapters: 40, volumes: 4 } },
            '{"status":"completed","volumes":4,"chapters":40}',
        ],
        [
            'without an entry or content',
            { entry: null },
            '{"status":"completed"}',
        ],
        [
            'an empty entry',
            { entry: READ_EMPTY, content: { chapters: 40, volumes: 4 } },
            '{"status":"completed","chapters":40,"volumes":4,"start_date":null,"end_date":null}',
        ],
        [
            'an empty entry without content',
            { entry: READ_EMPTY },
            '{"status":"completed","start_date":null,"end_date":null}',
        ],
        [
            'a full entry',
            { entry: READ_FULL, content: { chapters: 40, volumes: 4 } },
            '{"status":"completed","chapters":40,"volumes":4,"score":7,"note":"note","rereads":1,"start_date":1700000000,"end_date":1700100000}',
        ],
        [
            'a full entry of unknown length',
            { entry: READ_FULL, content: { chapters: null, volumes: 0 } },
            '{"status":"completed","chapters":5,"volumes":1,"score":7,"note":"note","rereads":1,"start_date":1700000000,"end_date":1700100000}',
        ],
        [
            'a full entry without content',
            { entry: READ_FULL },
            '{"status":"completed","chapters":5,"volumes":1,"score":7,"note":"note","rereads":1,"start_date":1700000000,"end_date":1700100000}',
        ],
    ],
    path: { content_type: contentType, slug: `${contentType}-slug` },
    entryQueryHash: () =>
        hashKey(
            readGetQueryKey({
                path: {
                    content_type: contentType,
                    slug: `${contentType}-slug`,
                },
            }),
        ),
    apply: applyReadMutation,
    other: applyWatchMutation,
    render: ({ entry, content, ...props }) => (
        <ReadListButton
            {...props}
            slug={`${contentType}-slug`}
            content_type={contentType}
            read={entry as ReadResponseBase | null | undefined}
            content={content as MangaResponse | NovelResponse | undefined}
        />
    ),
});

const MANGA_KIND = readKind(ContentTypeEnum.MANGA);
const NOVEL_KIND = readKind(ContentTypeEnum.NOVEL);
const KINDS = [WATCH_KIND, MANGA_KIND, NOVEL_KIND];

type Call = { method: string; url: string; body: string };
type Deferred = { promise: Promise<void>; resolve: () => void };

const deferred = (): Deferred => {
    let resolve!: () => void;
    const promise = new Promise<void>((done) => {
        resolve = done;
    });
    return { promise, resolve };
};

const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });

let calls: Call[] = [];
let tracked = false;
let entryStatus = 404;
let server = { gate: Promise.resolve(), fail: false };
let unmounts: (() => Promise<void>)[] = [];

const flush = () =>
    act(async () => {
        for (let i = 0; i < 5; i++) {
            await new Promise((done) => setTimeout(done, 0));
        }
    });

const mount = async (
    element: ReactElement,
    seed?: (queryClient: QueryClient) => void,
) => {
    const queryClient = new QueryClient();
    seed?.(queryClient);
    const container = document.body.appendChild(document.createElement('div'));
    const root = createRoot(container);
    const rerender = async (next: ReactElement) => {
        await act(async () =>
            root.render(
                <QueryClientProvider client={queryClient}>
                    {next}
                </QueryClientProvider>,
            ),
        );
        await flush();
    };
    let mounted = true;
    const unmount = async () => {
        if (!mounted) return;
        mounted = false;
        await act(async () => root.unmount());
        container.remove();
        document.body.innerHTML = '';
    };

    unmounts.push(unmount);
    await rerender(element);

    return { container, queryClient, rerender, unmount };
};

const withAppDefaults = (queryClient: QueryClient) =>
    queryClient.setDefaultOptions({ queries: QUERY_CLIENT_DEFAULTS });

const click = async (element: Element | null | undefined) => {
    await act(async () => (element as HTMLElement | null)?.click());
    await flush();
};

const buttons = (container: HTMLElement) => [
    ...container.querySelectorAll('button'),
];

const showsAddTrigger = (container: HTMLElement) =>
    container.textContent?.includes(ADD_LABEL) ?? false;

const openSelect = (container: HTMLElement) =>
    click(buttons(container)[showsAddTrigger(container) ? 1 : 0]);

const items = () => [...document.querySelectorAll('[cmdk-item]')];

const choose = async (container: HTMLElement, value: string) => {
    await openSelect(container);
    await click(document.querySelector(`[cmdk-item][data-value="${value}"]`));
};

const writes = () => calls.filter((call) => call.method !== 'GET');
const reads = () => calls.filter((call) => call.method === 'GET');
const lastDialog = () => dialogs.at(-1);

const body = (status: string, rest: string) =>
    rest ? `{"status":"${status}",${rest}}` : `{"status":"${status}"}`;

const iconMarkup = (icon: ComponentType) =>
    renderToStaticMarkup(createElement(icon));

const iconClassName = (
    size: 'icon-sm' | 'icon-md',
    className?: string,
    variant: ButtonProps['variant'] = 'secondary',
) => cn(buttonVariants({ variant, size, className }));

beforeAll(() => {
    configureBrowserClient({ baseUrl: BASE_URL });
});

beforeEach(() => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    vi.stubGlobal(
        'ResizeObserver',
        class {
            observe() {}
            unobserve() {}
            disconnect() {}
        },
    );
    Element.prototype.scrollIntoView ??= () => {};
    vi.stubGlobal('fetch', async (request: Request) => {
        calls.push({
            method: request.method,
            url: request.url,
            body: await request.text(),
        });

        const response = KINDS.find(
            (kind) => kind.url === request.url,
        )?.response;

        if (request.method === 'GET') {
            return tracked
                ? json(response)
                : json({ message: 'Error', code: 'error' }, entryStatus);
        }

        await server.gate;
        return server.fail
            ? json({ message: 'Bad', code: 'bad_request' }, 400)
            : json(response);
    });
});

afterEach(async () => {
    for (const unmount of unmounts) await unmount();
    unmounts = [];
    calls = [];
    tracked = false;
    entryStatus = 404;
    server = { gate: Promise.resolve(), fail: false };
    dialogs.length = 0;
    vi.mocked(applyWatchMutation).mockClear();
    vi.mocked(applyReadMutation).mockClear();
    vi.unstubAllGlobals();
});

describe.each(KINDS)('$name list status button', (kind) => {
    it('lists the status options, plus settings for a tracked entry', async () => {
        const untracked = await mount(kind.render({ entry: null }));
        await openSelect(untracked.container);

        expect(items().map((item) => item.getAttribute('data-value'))).toEqual(
            kind.statuses,
        );
        expect(items().map((item) => item.textContent)).toEqual(kind.titles);
        await untracked.unmount();

        const tracked = await mount(kind.render({ entry: kind.full }));
        await openSelect(tracked.container);

        expect(items().map((item) => item.getAttribute('data-value'))).toEqual([
            ...kind.statuses,
            'settings',
        ]);
        expect(items().at(-1)?.textContent).toBe('Налаштування');
    });

    it('shows the add trigger without an entry and the status trigger with one', async () => {
        const untracked = await mount(kind.render({ entry: null }));

        expect(untracked.container.textContent).toBe(ADD_LABEL);
        expect(buttons(untracked.container)).toHaveLength(2);
        await untracked.unmount();

        const tracked = await mount(kind.render({ entry: kind.full }));
        const [main, gear] = buttons(tracked.container);
        const title = kind.titles[kind.statuses.indexOf(kind.full.status)];

        expect(tracked.container.textContent).toBe(`${title}-7`);
        expect(main.classList).toContain(`bg-${kind.full.status}`);
        expect(gear.classList).toContain(`bg-${kind.full.status}`);
    });

    it('adds to planned from the add trigger', async () => {
        const { container, queryClient } = await mount(
            kind.render({ entry: null, content: kind.content }),
        );

        await click(buttons(container)[0]);

        expect(writes()).toEqual([
            { method: 'PUT', url: kind.url, body: '{"status":"planned"}' },
        ]);
        expect(kind.apply).toHaveBeenCalledTimes(1);
        expect(kind.apply).toHaveBeenCalledWith(queryClient, kind.response);
        expect(kind.other).not.toHaveBeenCalled();
    });

    it.each(['none', 'empty', 'full'] as const)(
        'carries the %s entry over on every other status',
        async (which) => {
            const entry = which === 'none' ? null : kind[which];

            for (const status of kind.statuses) {
                if (status === 'completed' || status === entry?.status)
                    continue;

                calls = [];
                const view = await mount(
                    kind.render({ entry, content: kind.content }),
                );
                await choose(view.container, status);

                expect(writes()).toEqual([
                    {
                        method: 'PUT',
                        url: kind.url,
                        body: body(status, kind.carried[which]),
                    },
                ]);
                await view.unmount();
            }
        },
    );

    it.each(kind.completed)(
        'completes %s with the per-kind fill',
        async (_, props, expected) => {
            const { container } = await mount(
                kind.render({
                    ...props,
                    content: props.content && {
                        slug: kind.slug,
                        ...props.content,
                    },
                }),
            );

            await choose(container, 'completed');

            expect(writes()).toEqual([
                { method: 'PUT', url: kind.url, body: expected },
            ]);
        },
    );

    it('sends nothing when the current status is picked again', async () => {
        const { container } = await mount(
            kind.render({ entry: kind.full, content: kind.content }),
        );

        await choose(container, kind.full.status);

        expect(writes()).toEqual([]);
        expect(kind.apply).not.toHaveBeenCalled();
    });

    it('invalidates once after a successful write and not after a failed one', async () => {
        const saved = await mount(
            kind.render({ entry: kind.full, content: kind.content }),
        );
        await choose(saved.container, 'dropped');

        expect(kind.apply).toHaveBeenCalledTimes(1);
        expect(kind.apply).toHaveBeenCalledWith(
            saved.queryClient,
            kind.response,
        );
        expect(kind.other).not.toHaveBeenCalled();
        await saved.unmount();

        vi.mocked(kind.apply).mockClear();
        server.fail = true;
        const failed = await mount(
            kind.render({ entry: kind.full, content: kind.content }),
        );
        await choose(failed.container, 'dropped');

        expect(writes()).toHaveLength(2);
        expect(kind.apply).not.toHaveBeenCalled();
    });

    it('shows a spinner and disables the select while a write is pending', async () => {
        for (const entry of [kind.full, null]) {
            const gate = deferred();
            server.gate = gate.promise;
            const view = await mount(
                kind.render({ entry, content: kind.content }),
            );
            const trigger = () =>
                view.container.querySelector('[aria-disabled]');

            expect(trigger()?.getAttribute('aria-disabled')).toBe('false');
            await choose(view.container, 'dropped');

            expect(view.container.querySelector('[role="status"]')).not.toBe(
                null,
            );
            expect(trigger()?.getAttribute('aria-disabled')).toBe('true');
            expect(
                buttons(view.container).map((button) => button.disabled),
            ).toEqual([false, false]);

            gate.resolve();
            await flush();

            expect(view.container.querySelector('[role="status"]')).toBe(null);
            expect(trigger()?.getAttribute('aria-disabled')).toBe('false');
            await view.unmount();
        }
    });

    it('opens the edit dialog from the settings option and the gear', async () => {
        const withContent = await mount(
            kind.render({ entry: kind.full, content: kind.content }),
        );

        expect(lastDialog()?.open).toBe(false);
        await choose(withContent.container, 'settings');

        expect(lastDialog()?.open).toBe(true);
        expect(writes()).toEqual([]);

        const onOpenChange = lastDialog()?.onOpenChange as (
            open: boolean,
        ) => void;
        await act(async () => onOpenChange(false));
        expect(lastDialog()?.open).toBe(false);
        await withContent.unmount();

        const withoutContent = await mount(kind.render({ entry: kind.full }));
        await choose(withoutContent.container, 'settings');

        expect(lastDialog()?.open).toBe(false);

        await click(buttons(withoutContent.container)[1]);

        expect(lastDialog()?.open).toBe(true);
        expect(writes()).toEqual([]);
    });

    it('passes the slug, content and entry to the edit dialog', async () => {
        const dialogProps = (entry: Entry | undefined, content?: object) => ({
            open: false,
            onOpenChange: expect.any(Function),
            content,
            slug: kind.slug,
            contentType: kind.contentType,
            [kind.entryProp]: entry,
        });

        await mount(kind.render({ entry: kind.full, content: kind.content }));
        expect(lastDialog()).toStrictEqual(
            dialogProps(kind.full, kind.content),
        );

        await mount(kind.render({ entry: null }));
        expect(lastDialog()).toStrictEqual(dialogProps(undefined));

        await mount(kind.render({ entry: kind.empty, size: 'icon-sm' }));
        expect(lastDialog()).toStrictEqual(dialogProps(kind.empty));
    });

    it('fetches the entry only without an entry prop and while enabled', async () => {
        for (const props of [
            { entry: null },
            { entry: kind.full },
            { entry: undefined, disabled: true },
            { entry: undefined, disabled: true, size: 'icon-sm' as const },
        ]) {
            const view = await mount(kind.render(props));
            expect(reads()).toEqual([]);
            await view.unmount();
        }

        for (const size of [undefined, 'icon-md' as const]) {
            calls = [];
            const view = await mount(kind.render({ size }));
            expect(reads()).toEqual([
                { method: 'GET', url: kind.url, body: '' },
            ]);
            await view.unmount();
        }
    });

    it('uses and carries over the fetched entry', async () => {
        tracked = true;
        const { container } = await mount(
            kind.render({ content: kind.content }),
        );
        const title = kind.titles[kind.statuses.indexOf(kind.full.status)];

        expect(container.textContent).toBe(`${title}-7`);
        expect(lastDialog()?.[kind.entryProp]).toEqual(kind.response);

        await choose(container, 'dropped');

        expect(writes()).toEqual([
            {
                method: 'PUT',
                url: kind.url,
                body: body('dropped', kind.carried.full),
            },
        ]);
    });

    it('shows the add trigger when the entry fetch fails', async () => {
        const { container } = await mount(
            kind.render({ content: kind.content }),
        );

        expect(reads()).toHaveLength(1);
        expect(container.textContent).toBe(ADD_LABEL);
        expect(lastDialog()?.[kind.entryProp]).toBe(undefined);

        await choose(container, 'dropped');

        expect(writes()).toEqual([
            { method: 'PUT', url: kind.url, body: '{"status":"dropped"}' },
        ]);
    });

    it('stores an untracked entry as null and does not refetch it for new buttons', async () => {
        const view = await mount(
            kind.render({ content: kind.content }),
            withAppDefaults,
        );

        expect(reads()).toHaveLength(1);
        expect(
            view.queryClient.getQueryCache().get(kind.entryQueryHash())?.state,
        ).toMatchObject({ status: 'success', data: null });

        await view.rerender(
            <>
                {kind.render({ content: kind.content })}
                {kind.render({ content: kind.content, size: 'icon-sm' })}
            </>,
        );

        expect(reads()).toHaveLength(1);
        expect(view.container.textContent).toContain(ADD_LABEL);
    });

    it('treats a prefetched null entry as untracked without fetching', async () => {
        const { container } = await mount(
            kind.render({ content: kind.content }),
            (queryClient) => {
                withAppDefaults(queryClient);
                queryClient.setQueryData(
                    JSON.parse(kind.entryQueryHash()),
                    null,
                );
            },
        );

        expect(reads()).toEqual([]);
        expect(container.textContent).toBe(ADD_LABEL);
        expect(lastDialog()?.[kind.entryProp]).toBe(undefined);

        await choose(container, 'dropped');

        expect(writes()).toEqual([
            { method: 'PUT', url: kind.url, body: '{"status":"dropped"}' },
        ]);
    });

    it('sends the same completion body for a null entry as for no entry', async () => {
        const [, props, expectedBody] = kind.completed[0];
        const { container } = await mount(
            kind.render({ content: props.content }),
            (queryClient) => {
                withAppDefaults(queryClient);
                queryClient.setQueryData(
                    JSON.parse(kind.entryQueryHash()),
                    null,
                );
            },
        );

        await choose(container, 'completed');

        expect(writes()).toEqual([
            { method: 'PUT', url: kind.url, body: expectedBody },
        ]);
    });

    it('shows the add trigger when the entry fetch fails with a server error', async () => {
        entryStatus = 500;
        const { container, queryClient } = await mount(
            kind.render({ content: kind.content }),
        );

        expect(reads()).toHaveLength(1);
        expect(
            queryClient.getQueryCache().get(kind.entryQueryHash())?.state
                .status,
        ).toBe('error');
        expect(container.textContent).toBe(ADD_LABEL);

        await choose(container, 'dropped');

        expect(writes()).toEqual([
            { method: 'PUT', url: kind.url, body: '{"status":"dropped"}' },
        ]);
    });

    it('disables the select and the trigger buttons', async () => {
        for (const entry of [kind.full, null]) {
            const view = await mount(
                kind.render({ entry, content: kind.content, disabled: true }),
            );

            expect(
                buttons(view.container).map((button) => button.disabled),
            ).toEqual([true, true]);
            expect(
                view.container
                    .querySelector('[aria-disabled]')
                    ?.getAttribute('aria-disabled'),
            ).toBe('true');

            for (const button of buttons(view.container)) await click(button);

            expect(items()).toEqual([]);
            expect(writes()).toEqual([]);
            expect(lastDialog()?.open).toBe(false);
            await view.unmount();
        }
    });

    it.each([
        [undefined, 'h-12', 'w-12'],
        ['sm', 'h-8', 'w-8'],
        ['md', 'h-10', 'w-10'],
    ] as const)(
        'sizes the select triggers for size %s',
        async (size, height, width) => {
            for (const entry of [kind.full, null]) {
                const view = await mount(kind.render({ entry, size }));
                const [main, side] = buttons(view.container);

                expect(buttons(view.container)).toHaveLength(2);
                expect(main.classList).toContain(height);
                expect(side.classList).toContain(height);
                expect(side.classList).toContain(width);
                expect(main.classList).not.toContain(width);
                await view.unmount();
            }
        },
    );

    describe.each(['icon-sm', 'icon-md'] as const)(
        'with the %s icon button',
        (size) => {
            it('adds to planned from the icon button', async () => {
                const { container, queryClient } = await mount(
                    kind.render({ entry: null, content: kind.content, size }),
                );
                const [button] = buttons(container);

                expect(buttons(container)).toHaveLength(1);
                expect(container.querySelector('[aria-disabled]')).toBe(null);
                expect(button.className).toBe(iconClassName(size));
                expect(button.innerHTML).toBe(iconMarkup(kind.icons.planned));

                await click(button);

                expect(writes()).toEqual([
                    {
                        method: 'PUT',
                        url: kind.url,
                        body: '{"status":"planned"}',
                    },
                ]);
                expect(kind.apply).toHaveBeenCalledTimes(1);
                expect(kind.apply).toHaveBeenCalledWith(
                    queryClient,
                    kind.response,
                );
                expect(lastDialog()?.open).toBe(false);
            });

            it('shows the status icon and colours of a tracked entry', async () => {
                for (const status of kind.statuses) {
                    const view = await mount(
                        kind.render({
                            entry: { ...kind.full, status },
                            content: kind.content,
                            size,
                        }),
                    );
                    const [button] = buttons(view.container);

                    expect(buttons(view.container)).toHaveLength(1);
                    expect(button.className).toBe(
                        iconClassName(
                            size,
                            cn(
                                kind.iconBorder,
                                `bg-${status} text-${status}-foreground border-${status}-border`,
                            ),
                        ),
                    );
                    expect(button.innerHTML).toBe(
                        iconMarkup(kind.icons[status]),
                    );
                    expect(button.getAttribute('type')).toBe('button');
                    expect(button.getAttribute('aria-label')).toBe(null);
                    expect(button.getAttribute('title')).toBe(null);
                    await view.unmount();
                }
            });

            it('opens the edit dialog from a tracked icon only with content', async () => {
                const withContent = await mount(
                    kind.render({
                        entry: kind.full,
                        content: kind.content,
                        size,
                    }),
                );
                await click(buttons(withContent.container)[0]);

                expect(lastDialog()?.open).toBe(true);
                await withContent.unmount();

                const withoutContent = await mount(
                    kind.render({ entry: kind.full, size }),
                );
                await click(buttons(withoutContent.container)[0]);

                expect(lastDialog()?.open).toBe(false);
                expect(writes()).toEqual([]);
            });

            it('falls back to the add icon for an unknown status', async () => {
                const { container } = await mount(
                    kind.render({
                        entry: { ...kind.full, status: 'unknown' },
                        content: kind.content,
                        size,
                    }),
                );
                const [button] = buttons(container);

                expect(button.className).toBe(iconClassName(size));
                expect(button.innerHTML).toBe(iconMarkup(kind.icons.planned));

                await click(button);

                expect(writes()).toEqual([
                    {
                        method: 'PUT',
                        url: kind.url,
                        body: '{"status":"planned"}',
                    },
                ]);
            });

            it('forwards button props that do not collide with its own', async () => {
                for (const entry of [null, kind.full]) {
                    const view = await mount(
                        kind.render({
                            entry,
                            content: kind.content,
                            size,
                            buttonProps: {
                                id: 'list-status',
                                'aria-label': 'Список',
                            },
                        }),
                    );
                    const [button] = buttons(view.container);

                    expect(button.id).toBe('list-status');
                    expect(button.getAttribute('aria-label')).toBe('Список');
                    await view.unmount();
                }
            });

            it('disables the icon button', async () => {
                for (const entry of [null, kind.full]) {
                    const view = await mount(
                        kind.render({
                            entry,
                            content: kind.content,
                            size,
                            disabled: true,
                        }),
                    );
                    const [button] = buttons(view.container);

                    expect(button.disabled).toBe(true);
                    await click(button);

                    expect(writes()).toEqual([]);
                    expect(lastDialog()?.open).toBe(false);
                    await view.unmount();
                }
            });
        },
    );
});

describe('a prop entry after a failed entry fetch', () => {
    it('keeps the watch button tracked', async () => {
        const view = await mount(WATCH_KIND.render({}));
        await view.rerender(
            WATCH_KIND.render({
                entry: WATCH_FULL,
                content: WATCH_KIND.unknownLength,
            }),
        );

        expect(reads()).toHaveLength(1);
        expect(view.container.textContent).toBe('Дивлюсь-7');

        await openSelect(view.container);
        expect(items().at(-1)?.getAttribute('data-value')).toBe('settings');
        await click(
            document.querySelector('[cmdk-item][data-value="completed"]'),
        );

        expect(writes()).toEqual([
            {
                method: 'PUT',
                url: WATCH_KIND.url,
                body: '{"status":"completed","episodes":5,"score":7,"note":"note","rewatches":1,"start_date":1700000000,"end_date":1700100000}',
            },
        ]);
        expect(lastDialog()?.watch).toEqual(WATCH_FULL);
    });

    it.each([MANGA_KIND, NOVEL_KIND])(
        'treats the $name read button as untracked but fills completion from it',
        async (kind) => {
            const view = await mount(kind.render({}));
            await view.rerender(
                kind.render({ entry: READ_FULL, content: kind.unknownLength }),
            );

            expect(reads()).toHaveLength(1);
            expect(view.container.textContent).toBe(ADD_LABEL);

            await openSelect(view.container);
            expect(
                items().map((item) => item.getAttribute('data-value')),
            ).toEqual(kind.statuses);
            await click(
                document.querySelector('[cmdk-item][data-value="completed"]'),
            );

            expect(writes()).toEqual([
                {
                    method: 'PUT',
                    url: kind.url,
                    body: '{"status":"completed","volumes":1,"chapters":5}',
                },
            ]);
            expect(lastDialog()?.read).toEqual(READ_FULL);
        },
    );

    it.each(KINDS)('shows the $name icon button as tracked', async (kind) => {
        const view = await mount(kind.render({ size: 'icon-sm' }));
        await view.rerender(
            kind.render({
                entry: kind.full,
                content: kind.content,
                size: 'icon-sm',
            }),
        );

        expect(buttons(view.container)[0].innerHTML).toBe(
            iconMarkup(kind.icons[kind.full.status]),
        );
    });
});

describe('icon button props', () => {
    it('let the caller override the watch defaults', async () => {
        for (const entry of [null, WATCH_FULL]) {
            const view = await mount(
                WATCH_KIND.render({
                    entry,
                    content: WATCH_KIND.content,
                    size: 'icon-sm',
                    buttonProps: { className: 'custom', variant: 'outline' },
                }),
            );

            expect(buttons(view.container)[0].className).toBe(
                iconClassName('icon-sm', 'custom', 'outline'),
            );
            await view.unmount();
        }
    });
});

describe('icon button caller props', () => {
    it.each([MANGA_KIND, NOVEL_KIND])(
        'override the $name read defaults like the watch ones',
        async (kind) => {
            for (const entry of [null, READ_FULL]) {
                const view = await mount(
                    kind.render({
                        entry,
                        content: kind.content,
                        size: 'icon-sm',
                        buttonProps: {
                            className: 'custom',
                            variant: 'outline',
                        },
                    }),
                );

                expect(buttons(view.container)[0].className).toBe(
                    iconClassName('icon-sm', 'custom', 'outline'),
                );
                await view.unmount();
            }
        },
    );

    it.each(KINDS)('replace the $name icon click handler', async (kind) => {
        const onClick = vi.fn();

        for (const entry of [null, kind.full]) {
            const view = await mount(
                kind.render({
                    entry,
                    content: kind.content,
                    size: 'icon-md',
                    buttonProps: { onClick },
                }),
            );
            await click(buttons(view.container)[0]);
            await view.unmount();
        }

        expect(onClick).toHaveBeenCalledTimes(2);
        expect(writes()).toEqual([]);
        expect(lastDialog()?.open).toBe(false);
    });
});

describe.each(
    KINDS.flatMap((kind) => [
        { ...kind, trigger: 'select', size: 'md' as const },
        { ...kind, trigger: 'icon', size: 'icon-sm' as const },
    ]),
)('$name kind config through the $trigger trigger', (combo) => {
    it('queries the entry under the generated key', async () => {
        const { queryClient } = await mount(combo.render({ size: combo.size }));

        expect(
            queryClient
                .getQueryCache()
                .getAll()
                .map((query) => query.queryHash),
        ).toEqual([combo.entryQueryHash()]);
    });

    it('adds to planned through the mutation of its kind', async () => {
        const { container, queryClient } = await mount(
            combo.render({ entry: null, size: combo.size }),
        );

        await click(buttons(container)[0]);

        expect(
            queryClient
                .getMutationCache()
                .getAll()
                .map((mutation) => mutation.state.variables),
        ).toEqual([{ path: combo.path, body: { status: 'planned' } }]);
        expect(combo.apply).toHaveBeenCalledTimes(1);
        expect(combo.other).not.toHaveBeenCalled();
    });

    it('offers the options and icons of its kind', async () => {
        const { container } = await mount(
            combo.render({ entry: combo.full, size: combo.size }),
        );

        if (combo.trigger === 'icon') {
            expect(buttons(container)[0].innerHTML).toBe(
                iconMarkup(combo.icons[combo.full.status]),
            );
            return;
        }

        await choose(container, 'on_hold');

        expect(items().map((item) => item.getAttribute('data-value'))).toEqual(
            [],
        );
        expect(writes()).toEqual([
            {
                method: 'PUT',
                url: combo.url,
                body: body('on_hold', combo.carried.full),
            },
        ]);
        await openSelect(container);
        expect(items().map((item) => item.getAttribute('data-value'))).toEqual([
            ...combo.statuses,
            'settings',
        ]);
    });
});
