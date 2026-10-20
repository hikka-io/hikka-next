import { resolveHttpsUrl, resolveWebUrl } from './url';
import { readYouTubeVideo } from './youtube';

/** Node types of the article document (Plate JSON), as the backend `app/common/schemas/document.py` accepts them. */
export const ARTICLE_NODE = {
    paragraph: 'p',
    blockquote: 'blockquote',
    spoiler: 'spoiler',
    spoilerInline: 'spoiler_inline',
    link: 'a',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    bulletedList: 'ul',
    numberedList: 'ol',
    listItem: 'li',
    listItemContent: 'lic',
    imageGroup: 'image_group',
    image: 'image',
    video: 'video',
    preview: 'preview',
} as const;

export type ArticleTextNode = {
    type: 'text';
    text: string;
    bold: boolean;
    italic: boolean;
};

export type ArticleInlineNode =
    | ArticleTextNode
    | { type: 'link'; url: string; children: ArticleInlineNode[] }
    | { type: 'spoiler_inline'; children: ArticleInlineNode[] };

export type ArticleHeadingLevel = 3 | 4 | 5;

export type ArticleBlockNode =
    | { type: 'paragraph'; children: ArticleInlineNode[] }
    | {
          type: 'heading';
          level: ArticleHeadingLevel;
          children: ArticleInlineNode[];
      }
    | { type: 'blockquote'; children: ArticleBlockNode[] }
    | { type: 'spoiler'; children: ArticleBlockNode[] }
    | { type: 'list'; ordered: boolean; items: ArticleBlockNode[][] }
    | { type: 'images'; urls: string[] }
    | {
          type: 'video';
          url: string;
          video: { id: string; start?: number } | null;
      };

type RawNode = {
    type?: unknown;
    text?: unknown;
    url?: unknown;
    bold?: unknown;
    italic?: unknown;
    children?: unknown;
};

// The backend caps nesting at 10; deeper input is dropped instead of recursing.
const MAX_DEPTH = 16;
const MAX_GROUP_IMAGES = 4;
const SITE_ORIGIN = 'https://hikka.io';

const HEADING_LEVELS: Record<string, ArticleHeadingLevel> = {
    h1: 3,
    h2: 3,
    h3: 3,
    h4: 4,
    h5: 5,
};

const INLINE_TYPES: ReadonlySet<unknown> = new Set([
    ARTICLE_NODE.link,
    ARTICLE_NODE.spoilerInline,
]);

const isNode = (value: unknown): value is RawNode =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const childrenOf = (node: RawNode): RawNode[] =>
    Array.isArray(node.children) ? node.children.filter(isNode) : [];

const isInline = (node: RawNode) =>
    typeof node.text === 'string' || INLINE_TYPES.has(node.type);

const linkUrl = (value: unknown): string | null =>
    typeof value === 'string' && resolveWebUrl(value, SITE_ORIGIN)
        ? value.trim()
        : null;

const imageUrl = (value: unknown): string | null =>
    typeof value === 'string'
        ? (resolveHttpsUrl(value, SITE_ORIGIN)?.toString() ?? null)
        : null;

function inlines(nodes: RawNode[], depth: number): ArticleInlineNode[] {
    if (depth > MAX_DEPTH) return [];

    return nodes.flatMap((node): ArticleInlineNode[] => {
        if (typeof node.text === 'string') {
            return [
                {
                    type: 'text',
                    text: node.text,
                    bold: node.bold === true,
                    italic: node.italic === true,
                },
            ];
        }

        const children = inlines(childrenOf(node), depth + 1);

        if (node.type === ARTICLE_NODE.link) {
            const url = linkUrl(node.url);
            return url ? [{ type: 'link', url, children }] : children;
        }

        if (node.type === ARTICLE_NODE.spoilerInline) {
            return [{ type: 'spoiler_inline', children }];
        }

        return children;
    });
}

function listItems(node: RawNode, depth: number): ArticleBlockNode[][] {
    return childrenOf(node).map((item) =>
        item.type === ARTICLE_NODE.listItem
            ? blocks(childrenOf(item), depth + 1)
            : blocks([item], depth + 1),
    );
}

function block(node: RawNode, depth: number): ArticleBlockNode[] {
    const children = childrenOf(node);

    switch (node.type) {
        case ARTICLE_NODE.paragraph:
        case ARTICLE_NODE.listItemContent:
            return [{ type: 'paragraph', children: inlines(children, depth) }];
        case 'h1':
        case 'h2':
        case ARTICLE_NODE.h3:
        case ARTICLE_NODE.h4:
        case ARTICLE_NODE.h5:
            return [
                {
                    type: 'heading',
                    level: HEADING_LEVELS[node.type as string],
                    children: inlines(children, depth),
                },
            ];
        case ARTICLE_NODE.blockquote:
        case ARTICLE_NODE.spoiler:
            return [
                {
                    type:
                        node.type === ARTICLE_NODE.spoiler
                            ? 'spoiler'
                            : 'blockquote',
                    children: blocks(children, depth + 1),
                },
            ];
        case ARTICLE_NODE.bulletedList:
        case ARTICLE_NODE.numberedList:
            return [
                {
                    type: 'list',
                    ordered: node.type === ARTICLE_NODE.numberedList,
                    items: listItems(node, depth),
                },
            ];
        case ARTICLE_NODE.imageGroup:
        case ARTICLE_NODE.image: {
            const urls = (node.type === ARTICLE_NODE.image ? [node] : children)
                .filter((child) => child.type === ARTICLE_NODE.image)
                .map((child) => imageUrl(child.url))
                .filter((url): url is string => url !== null)
                .slice(0, MAX_GROUP_IMAGES);

            return urls.length > 0 ? [{ type: 'images', urls }] : [];
        }
        case ARTICLE_NODE.video: {
            const url = typeof node.url === 'string' ? node.url : '';
            return [{ type: 'video', url, video: readYouTubeVideo(url) }];
        }
        default:
            // Unknown containers (tables, the legacy preview wrapper) show their content, like Plate's default element.
            return blocks(children, depth + 1);
    }
}

/** Blocks from mixed children: runs of inline nodes (text directly in a quote or spoiler) become one paragraph. */
function blocks(nodes: RawNode[], depth: number): ArticleBlockNode[] {
    if (depth > MAX_DEPTH) return [];

    const result: ArticleBlockNode[] = [];
    let run: RawNode[] = [];

    const flush = () => {
        if (run.length > 0) {
            result.push({ type: 'paragraph', children: inlines(run, depth) });
            run = [];
        }
    };

    for (const node of nodes) {
        if (isInline(node)) {
            run.push(node);
            continue;
        }

        flush();
        result.push(...block(node, depth));
    }

    flush();
    return result;
}

/**
 * The article document as typed blocks, keeping only what the backend whitelist allows:
 * bold/italic marks, h3-h5 (legacy h1/h2 read as h3), lists, quotes, spoilers, https images
 * in groups of up to four, YouTube videos and http(s) links. Unknown elements keep their content.
 */
export function normalizeArticleDocument(
    document: unknown,
): ArticleBlockNode[] {
    return Array.isArray(document) ? blocks(document.filter(isNode), 1) : [];
}

/** Older documents wrap their opening in a `preview` node; readers show its children in place. */
export function unwrapArticlePreview<T extends object>(document: T[]): T[] {
    const [first, ...rest] = document;
    const node = first as RawNode | undefined;

    return node?.type === ARTICLE_NODE.preview && Array.isArray(node.children)
        ? [...(node.children as T[]), ...rest]
        : document;
}

export function articleInlineText(nodes: ArticleInlineNode[]): string {
    return nodes
        .map((node) =>
            node.type === 'text' ? node.text : articleInlineText(node.children),
        )
        .join('');
}

/** A paragraph with no text renders as one blank line, like Plate's empty block. */
export function isBlankArticleParagraph(nodes: ArticleInlineNode[]): boolean {
    return articleInlineText(nodes) === '';
}
