import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    ContentTypeEnum,
    configureBrowserClient,
    type ExternalResponse,
    ExternalTypeEnum,
} from '@hikka/api';

import { contentInfoOptions } from '@/utils/api/content-queries';

import ContentLinks from './links';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

configureBrowserClient({ baseUrl: 'https://api.example.test' });

const SLUG = 'some-slug';

const session = vi.hoisted(() => ({ user: null as object | null }));

vi.mock('@/utils/navigation', () => ({
    useParams: () => ({ slug: SLUG }),
}));

vi.mock('@/services/session', () => ({
    useSession: () => ({ user: session.user }),
}));

const link = (
    url: string,
    type: ExternalTypeEnum = ExternalTypeEnum.GENERAL,
): ExternalResponse => ({ url, text: url, type });

const teardown: (() => void)[] = [];

afterEach(() => {
    for (const dispose of teardown.splice(0)) act(() => dispose());
    session.user = null;
});

async function render(external: ExternalResponse[]) {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: Infinity } },
    });
    queryClient.setQueryData(
        contentInfoOptions(ContentTypeEnum.ANIME, SLUG).queryKey,
        { external } as never,
    );

    const container = document.createElement('div');
    const root = createRoot(container);

    await act(async () =>
        root.render(
            <QueryClientProvider client={queryClient}>
                <ContentLinks content_type={ContentTypeEnum.ANIME} />
            </QueryClientProvider>,
        ),
    );
    teardown.push(() => root.unmount());

    return container;
}

const hrefs = (container: HTMLElement) =>
    [...container.querySelectorAll('a[target="_blank"]')].map((node) =>
        node.getAttribute('href'),
    );

describe('ContentLinks', () => {
    it('renders nothing when every link is filtered out', async () => {
        const container = await render([
            link('https://www.netflix.com/'),
            link('javascript:alert(1)'),
        ]);

        expect(container.innerHTML).toBe('');
    });

    it('never renders watch links for anonymous visitors', async () => {
        const container = await render([
            link('https://general.example.test/title'),
            link('https://watch.example.test/title', ExternalTypeEnum.WATCH),
        ]);

        expect(hrefs(container)).toEqual([
            'https://general.example.test/title',
        ]);
        expect(container.querySelector('[role="tablist"]')).toBeNull();
    });

    it('shows watch-only links without tabs for a signed-in viewer', async () => {
        session.user = {};
        const container = await render([
            link('https://www.netflix.com/'),
            link('https://watch.example.test/title', ExternalTypeEnum.WATCH),
        ]);

        expect(hrefs(container)).toEqual(['https://watch.example.test/title']);
        expect(container.querySelector('[role="tablist"]')).toBeNull();
    });

    it('offers the watch tab when both lists have links', async () => {
        session.user = {};
        const container = await render([
            link('https://general.example.test/title'),
            link('https://watch.example.test/title', ExternalTypeEnum.WATCH),
        ]);

        expect(hrefs(container)).toEqual([
            'https://general.example.test/title',
        ]);
        expect(
            container.querySelector('[role="tablist"]')?.textContent,
        ).toContain('Перегляд');
    });
});
