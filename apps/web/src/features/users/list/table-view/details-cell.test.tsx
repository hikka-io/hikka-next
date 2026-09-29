import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it, vi } from 'vitest';

import {
    type AnimeResponse,
    ContentTypeEnum,
    type MainContentTypeEnum,
} from '@hikka/api';

import DetailsCell from './details-cell';

vi.mock('@/services/session', () => ({ useTitle: () => 'Title' }));

vi.mock('@/utils/navigation', () => ({
    Link: ({ to, children }: { to: string; children?: ReactNode }) => (
        <a href={to}>{children}</a>
    ),
}));

vi.mock('@/components/content-card/poster-card', () => ({
    default: () => null,
}));

vi.mock('@/components/markdown', () => ({
    MDViewer: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));

const content = {
    slug: 'some-slug',
    image: 'image.png',
} as unknown as AnimeResponse;

const render = (contentType: MainContentTypeEnum, repeats: number) =>
    renderToStaticMarkup(
        <table>
            <tbody>
                <tr>
                    <DetailsCell
                        content={content}
                        content_type={contentType}
                        repeats={repeats}
                    />
                </tr>
            </tbody>
        </table>,
    );

describe('DetailsCell repeat badge', () => {
    it.each([
        [ContentTypeEnum.ANIME, 1, '2 перегляди'],
        [ContentTypeEnum.ANIME, 4, '5 переглядів'],
        [ContentTypeEnum.ANIME, 20, '21 перегляд'],
        [ContentTypeEnum.MANGA, 1, '2 перечитування'],
        [ContentTypeEnum.MANGA, 4, '5 перечитувань'],
        [ContentTypeEnum.NOVEL, 10, '11 перечитувань'],
        [ContentTypeEnum.NOVEL, 20, '21 перечитування'],
    ] as const)('labels %s with %i repeats as "%s"', (type, repeats, label) => {
        expect(render(type, repeats)).toContain(label);
    });

    it.each([
        ContentTypeEnum.ANIME,
        ContentTypeEnum.MANGA,
        ContentTypeEnum.NOVEL,
    ] as const)('renders no repeat badge for %s without repeats', (type) => {
        const html = render(type, 0);

        expect(html).not.toContain('перегляд');
        expect(html).not.toContain('перечитуван');
    });
});
