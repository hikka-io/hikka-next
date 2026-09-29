import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';

import { ContentTypeEnum } from '@hikka/api';

import ReadingTracker from './reading-tracker';

vi.mock('@/services/session', () => ({
    useSession: () => ({ user: { username: 'someone' } }),
    useSessionUI: () => ({ preferences: {} }),
}));

vi.mock('@/utils/api/use-infinite-list', () => ({
    useInfiniteList: () => ({
        list: [],
        ref: vi.fn(),
        isFetchingNextPage: false,
        hasNextPage: false,
    }),
}));

vi.mock('@/utils/navigation', () => ({
    Link: ({ to, children }: { to: string; children?: ReactNode }) => (
        <a href={to}>{children}</a>
    ),
    useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/components/tracking', () => ({
    ListEntryEditDialog: () => null,
}));

const render = (
    contentType: typeof ContentTypeEnum.MANGA | typeof ContentTypeEnum.NOVEL,
) =>
    renderToStaticMarkup(
        <QueryClientProvider client={new QueryClient()}>
            <ReadingTracker contentType={contentType} />
        </QueryClientProvider>,
    );

describe('ReadingTracker empty state', () => {
    it('spells the manga call to action with the letter ґ', () => {
        const html = render(ContentTypeEnum.MANGA);

        expect(html).toContain('Знайти манґу');
        expect(html).not.toContain('мангу');
    });

    it('keeps the novel call to action', () => {
        expect(render(ContentTypeEnum.NOVEL)).toContain('Знайти ранобе');
    });
});
