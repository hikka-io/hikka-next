import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it, vi } from 'vitest';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import UserListNavbar from './user-list-navbar';

vi.mock('@tanstack/react-query', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@tanstack/react-query')>()),
    useQuery: () => ({ data: undefined }),
    useQueryClient: () => ({}),
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
