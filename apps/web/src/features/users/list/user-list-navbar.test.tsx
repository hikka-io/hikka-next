import { renderToStaticMarkup } from 'react-dom/server';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import { userListStatsOptions } from '../queries';
import UserListNavbar from './user-list-navbar';

const mocks = vi.hoisted(() => ({
    queries: [] as { queryKey: unknown; enabled?: unknown }[],
}));

vi.mock('@tanstack/react-query', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@tanstack/react-query')>()),
    useQuery: (options: { queryKey: unknown }) => {
        mocks.queries.push(options);
        return { data: undefined };
    },
    useMutation: () => ({ mutate: vi.fn() }),
}));

vi.mock('@tanstack/react-router', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@tanstack/react-router')>()),
    useRouter: () => ({ navigate: vi.fn() }),
}));

vi.mock('@/features/catalog', () => ({ ViewToggle: () => null }));

vi.mock('@/features/filters', () => ({
    FiltersButton: () => null,
    FiltersSidebarToggle: () => null,
    Sort: () => null,
    useChangeParam: () => vi.fn(),
}));

vi.mock('@/utils/navigation', () => ({
    useParams: () => ({ username: 'someone' }),
    useRouteSearch: () => ({}),
}));

vi.mock('./user-list-filters-modal', () => ({ default: () => null }));

const render = (contentType: MainContentTypeEnum) =>
    renderToStaticMarkup(<UserListNavbar content_type={contentType} />);

describe('UserListNavbar random button', () => {
    it.each([
        [ContentTypeEnum.ANIME, 'Випадкове аніме'],
        [ContentTypeEnum.MANGA, 'Випадкова манґа'],
        [ContentTypeEnum.NOVEL, 'Випадкове ранобе'],
    ] as const)('labels the %s button "%s"', (contentType, label) => {
        expect(render(contentType)).toContain(`aria-label="${label}"`);
    });
});

describe('UserListNavbar stats', () => {
    beforeEach(() => {
        mocks.queries = [];
    });

    it.each([
        ContentTypeEnum.ANIME,
        ContentTypeEnum.MANGA,
        ContentTypeEnum.NOVEL,
    ] as const)('holds one stats query for %s', (contentType) => {
        render(contentType);

        expect(mocks.queries).toHaveLength(1);
        expect(mocks.queries[0].queryKey).toStrictEqual(
            userListStatsOptions('someone', contentType).queryKey,
        );
        expect(mocks.queries[0]).not.toHaveProperty('enabled');
    });
});
