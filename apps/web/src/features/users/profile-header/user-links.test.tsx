import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { type UserResponseFollowed, userProfileOptions } from '@hikka/api';

import UserLinks from './user-links';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const USERNAME = 'someone';
const PILL_WIDTH = 100;
const TRIGGER_WIDTH = 60;

const mocks = vi.hoisted(() => ({ available: 1000, username: 'someone' }));

vi.mock('@/utils/navigation', () => ({
    useParams: () => ({ username: mocks.username }),
}));

vi.mock('@/services/hooks/use-media-query', () => ({
    useIsDesktop: () => true,
}));

const GITHUB = { icon: 'github', url: 'https://github.com/hikka', text: null };
const TELEGRAM = { icon: 'telegram', url: 'https://t.me/hikka', text: 'Канал' };
const CUSTOM = {
    icon: 'custom',
    url: 'https://www.example.org/me',
    text: null,
};
const BLUESKY = { icon: 'bluesky', url: 'https://bsky.app/p/x', text: null };

const teardown: (() => void)[] = [];

beforeEach(() => {
    mocks.available = 1000;
    mocks.username = USERNAME;
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
        function (this: Element) {
            const inMeasure = this.parentElement?.hasAttribute('inert');
            const isTrigger = this === this.parentElement?.lastElementChild;

            return {
                width: inMeasure ? (isTrigger ? TRIGGER_WIDTH : PILL_WIDTH) : 0,
            } as DOMRect;
        },
    );
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(
        () => mocks.available,
    );
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        columnGap: '8px',
        paddingLeft: '0px',
        paddingRight: '0px',
    } as CSSStyleDeclaration);
});

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
    vi.restoreAllMocks();
});

async function mount(links: Record<string, unknown>[]) {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: Infinity, retry: false } },
    });
    queryClient.setQueryData(
        userProfileOptions({ path: { username: USERNAME } }).queryKey,
        { username: USERNAME, links } as UserResponseFollowed,
    );
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);

    await act(async () =>
        root.render(
            <QueryClientProvider client={queryClient}>
                <UserLinks />
            </QueryClientProvider>,
        ),
    );
    teardown.push(() => {
        root.unmount();
        container.remove();
    });

    return {
        container,
        anchors: (scope: ParentNode = container) => [
            ...scope.querySelectorAll<HTMLAnchorElement>('a[href]'),
        ],
    };
}

describe('UserLinks', () => {
    it('renders nothing without links', async () => {
        const { container } = await mount([]);

        expect(container.innerHTML).toBe('');
    });

    it('renders nothing when every stored link is invalid', async () => {
        const { container } = await mount([
            { icon: 'custom', url: 'javascript:alert(1)', text: null },
        ]);

        expect(container.innerHTML).toBe('');
    });

    it('renders an external anchor per link labelled by text, service or host', async () => {
        const { anchors } = await mount([GITHUB, TELEGRAM, CUSTOM]);
        const links = anchors();

        expect(links.map((a) => a.getAttribute('href'))).toEqual([
            GITHUB.url,
            TELEGRAM.url,
            CUSTOM.url,
        ]);
        expect(links.map((a) => a.textContent)).toEqual([
            'GitHub',
            'Канал',
            'example.org',
        ]);
        for (const a of links) {
            expect(a.target).toBe('_blank');
            expect(a.getAttribute('rel')).toBe(
                'noopener noreferrer nofollow ugc',
            );
        }
    });

    it('shows no overflow trigger when everything fits', async () => {
        const { container } = await mount([GITHUB, TELEGRAM, CUSTOM]);

        expect(container.querySelector('button')).toBeNull();
    });

    it('shows at most three links even when more fit', async () => {
        const { container, anchors } = await mount([
            GITHUB,
            TELEGRAM,
            CUSTOM,
            BLUESKY,
        ]);

        expect(anchors()).toHaveLength(3);
        expect(container.querySelector('button')?.textContent).toContain('+1');
    });

    it('moves links that do not fit behind a +N trigger that lists them', async () => {
        mocks.available = 350;
        const { container, anchors } = await mount([
            GITHUB,
            TELEGRAM,
            CUSTOM,
            BLUESKY,
        ]);

        expect(anchors().map((a) => a.textContent)).toEqual([
            'GitHub',
            'Канал',
        ]);

        const trigger = container.querySelector('button');
        expect(trigger?.textContent).toContain('+2');

        await act(async () => trigger?.click());

        const listed = anchors(document.body).slice(2);

        expect(listed.map((a) => a.textContent)).toEqual([
            'example.orgexample.org/me',
            'Blueskybsky.app/p/x',
        ]);
        expect(listed.map((a) => a.getAttribute('href'))).toEqual([
            CUSTOM.url,
            BLUESKY.url,
        ]);
    });

    it('measures again after switching from a profile without links', async () => {
        const queryClient = new QueryClient();
        const profile = (username: string, links: Record<string, unknown>[]) =>
            queryClient.setQueryData(
                userProfileOptions({ path: { username } }).queryKey,
                { username, links } as UserResponseFollowed,
            );
        profile(USERNAME, []);
        profile('other', [GITHUB, TELEGRAM, CUSTOM]);
        const container = document.createElement('div');
        document.body.append(container);
        const root = createRoot(container);
        const render = () =>
            act(async () =>
                root.render(
                    <QueryClientProvider client={queryClient}>
                        <UserLinks />
                    </QueryClientProvider>,
                ),
            );
        teardown.push(() => {
            root.unmount();
            container.remove();
        });

        await render();
        mocks.username = 'other';
        await render();

        expect(container.querySelectorAll('a[href]')).toHaveLength(3);
        expect(container.querySelector('button')).toBeNull();
    });

    it('always keeps at least one link visible', async () => {
        mocks.available = 10;
        const { container, anchors } = await mount([GITHUB, TELEGRAM, CUSTOM]);

        expect(anchors()).toHaveLength(1);
        expect(container.querySelector('button')?.textContent).toContain('+2');
    });
});
