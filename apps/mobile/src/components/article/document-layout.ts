import type { ArticleHeadingLevel, ArticleTextNode } from '@hikka/core';

export const ARTICLE_TEXT_CLASS = 'text-base leading-6 text-foreground';

// The web's `.prose` h3/h4/h5: text-lg, text-base and text-sm, all semibold.
export const HEADING_CLASSES: Record<ArticleHeadingLevel, string> = {
    3: 'text-lg leading-7 font-semibold text-foreground',
    4: 'text-base leading-6 font-semibold text-foreground',
    5: 'text-sm leading-5 font-semibold text-foreground',
};

export function markClassName({
    bold,
    italic,
}: Pick<ArticleTextNode, 'bold' | 'italic'>): string | undefined {
    const classes = [bold && 'font-bold', italic && 'italic'].filter(Boolean);
    return classes.length > 0 ? classes.join(' ') : undefined;
}

export const listMarker = (ordered: boolean, index: number) =>
    ordered ? `${index + 1}.` : '•';

export type ImageColumn = { flex: number; urls: string[] };

/** A single image keeps its own ratio (`aspectRatio` null); groups use the web's fixed grids. */
export type ImageGridLayout = {
    aspectRatio: number | null;
    columns: ImageColumn[];
};

// The web's `.image-group-size-*` grids: 40% and 75% padding ratios, a 1.75fr lead column for three.
export function imageGridLayout(urls: string[]): ImageGridLayout {
    const [a, b, c, d] = urls;

    switch (urls.length) {
        case 1:
            return { aspectRatio: null, columns: [{ flex: 1, urls: [a] }] };
        case 2:
            return {
                aspectRatio: 1 / 0.4,
                columns: [
                    { flex: 1, urls: [a] },
                    { flex: 1, urls: [b] },
                ],
            };
        case 3:
            return {
                aspectRatio: 1 / 0.75,
                columns: [
                    { flex: 1.75, urls: [a] },
                    { flex: 1, urls: [b, c] },
                ],
            };
        default:
            return {
                aspectRatio: 1 / 0.75,
                columns: [
                    { flex: 1, urls: [a, c] },
                    { flex: 1, urls: [b, d] },
                ],
            };
    }
}
