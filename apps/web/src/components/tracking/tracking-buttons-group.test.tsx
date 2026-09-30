import { act, type ReactElement } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
    type ReadResponseBase,
    type WatchResponseBase,
} from '@hikka/api';

import TrackingButtonsGroup from './tracking-buttons-group';

vi.mock('@/utils/api/invalidate-content-state', () => ({
    applyReadDeletion: vi.fn(),
    applyReadMutation: vi.fn(),
    applyWatchDeletion: vi.fn(),
    applyWatchMutation: vi.fn(),
}));
vi.mock('./list-entry-edit-dialog', () => ({ default: () => null }));

const BASE_URL = 'https://api.test';

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

const WATCH_CARRIED =
    '"score":7,"note":"note","rewatches":1,"start_date":1700000000,"end_date":1700100000';
const READ_CARRIED =
    '"score":7,"note":"note","rereads":1,"start_date":1700000000,"end_date":1700100000';

type Call = { method: string; url: string; body: string };

let calls: Call[] = [];
let unmounts: (() => Promise<void>)[] = [];

const flush = () =>
    act(async () => {
        for (let i = 0; i < 5; i++) {
            await new Promise((done) => setTimeout(done, 0));
        }
    });

const click = async (element: Element | null | undefined) => {
    await act(async () => (element as HTMLElement | null)?.click());
    await flush();
};

const mount = async (element: ReactElement) => {
    const container = document.body.appendChild(document.createElement('div'));
    const root = createRoot(container);

    await act(async () =>
        root.render(
            <QueryClientProvider
                client={
                    new QueryClient({
                        defaultOptions: { queries: { retry: false } },
                    })
                }
            >
                {element}
            </QueryClientProvider>,
        ),
    );
    await flush();

    unmounts.push(async () => {
        await act(async () => root.unmount());
        container.remove();
        document.body.innerHTML = '';
    });

    return container;
};

const choose = async (
    element: ReactElement,
    tracked: boolean,
    value: string,
) => {
    const container = await mount(element);

    await click(container.querySelectorAll('button')[tracked ? 0 : 1]);
    await click(document.querySelector(`[cmdk-item][data-value="${value}"]`));

    return calls.filter((call) => call.method !== 'GET');
};

const anime = (episodes_total: number | null) =>
    ({ slug: 'anime-slug', episodes_total }) as AnimeResponse;

const manga = (chapters: number | null, volumes: number | null) =>
    ({ slug: 'manga-slug', chapters, volumes }) as MangaResponse;

const watchWrite = (body: string) => [
    { method: 'PUT', url: `${BASE_URL}/watch/anime-slug`, body },
];
const readWrite = (body: string) => [
    { method: 'PUT', url: `${BASE_URL}/read/manga/manga-slug`, body },
];

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

        return new Response('{}', {
            headers: { 'Content-Type': 'application/json' },
        });
    });
});

afterEach(async () => {
    for (const unmount of unmounts) await unmount();
    unmounts = [];
    calls = [];
    vi.unstubAllGlobals();
});

describe('TrackingButtonsGroup watch completion', () => {
    it.each([
        [
            'a full entry',
            anime(12),
            WATCH_FULL,
            `{"status":"completed","episodes":12,${WATCH_CARRIED}}`,
        ],
        [
            'a full entry of unknown length',
            anime(null),
            WATCH_FULL,
            `{"status":"completed","episodes":5,${WATCH_CARRIED}}`,
        ],
        ['no entry', anime(12), null, '{"status":"completed","episodes":12}'],
        [
            'no entry of unknown length',
            anime(null),
            null,
            '{"status":"completed"}',
        ],
    ])('completes %s', async (_, item, watch, expected) => {
        expect(
            await choose(
                <TrackingButtonsGroup
                    type={ContentTypeEnum.ANIME}
                    item={item}
                    watch={watch}
                />,
                watch !== null,
                'completed',
            ),
        ).toEqual(watchWrite(expected));
    });

    it('carries the full entry over to another status', async () => {
        expect(
            await choose(
                <TrackingButtonsGroup
                    type={ContentTypeEnum.ANIME}
                    item={anime(null)}
                    watch={WATCH_FULL}
                />,
                true,
                'on_hold',
            ),
        ).toEqual(
            watchWrite(`{"status":"on_hold","episodes":5,${WATCH_CARRIED}}`),
        );
    });
});

describe('TrackingButtonsGroup read completion', () => {
    it.each([
        [
            'a full entry',
            manga(40, 4),
            READ_FULL,
            `{"status":"completed","chapters":40,"volumes":4,${READ_CARRIED}}`,
        ],
        [
            'a full entry of unknown length',
            manga(null, 0),
            READ_FULL,
            `{"status":"completed","chapters":5,"volumes":1,${READ_CARRIED}}`,
        ],
        [
            'a full entry of unknown chapters',
            manga(null, 4),
            READ_FULL,
            `{"status":"completed","chapters":5,"volumes":4,${READ_CARRIED}}`,
        ],
        [
            'no entry',
            manga(40, 4),
            null,
            '{"status":"completed","volumes":4,"chapters":40}',
        ],
        [
            'no entry of unknown length',
            manga(null, null),
            null,
            '{"status":"completed"}',
        ],
    ])('completes %s', async (_, item, read, expected) => {
        expect(
            await choose(
                <TrackingButtonsGroup
                    type={ContentTypeEnum.MANGA}
                    item={item}
                    read={read}
                />,
                read !== null,
                'completed',
            ),
        ).toEqual(readWrite(expected));
    });

    it('carries the full entry over to another status', async () => {
        expect(
            await choose(
                <TrackingButtonsGroup
                    type={ContentTypeEnum.MANGA}
                    item={manga(null, 0)}
                    read={READ_FULL}
                />,
                true,
                'on_hold',
            ),
        ).toEqual(
            readWrite(
                `{"status":"on_hold","chapters":5,"volumes":1,${READ_CARRIED}}`,
            ),
        );
    });
});
