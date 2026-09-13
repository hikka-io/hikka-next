import type { Parent, Root } from 'mdast';

const SPOILER_TAGS: Record<string, string> = {
    containerDirective: 'spoiler',
    leafDirective: 'spoiler-inline',
    textDirective: 'spoiler-inline',
};

const INLINE_MARK_TAGS: Record<string, string> = {
    strike: 's',
    underline: 'u',
};

// Directives with no hName carry no hast handler, and their text is dropped
const FALLBACK_TAGS: Record<string, string> = {
    containerDirective: 'div',
    leafDirective: 'span',
    textDirective: 'span',
};

const isParent = (node: unknown): node is Parent =>
    Array.isArray((node as Parent).children);

const tagDirectives = (node: Parent) => {
    for (const child of node.children as any[]) {
        const fallback = FALLBACK_TAGS[child.type];

        if (fallback) {
            child.data = {
                ...child.data,
                hName:
                    child.name === 'spoiler'
                        ? SPOILER_TAGS[child.type]
                        : child.type === 'textDirective'
                          ? (INLINE_MARK_TAGS[child.name] ?? fallback)
                          : fallback,
            };
        }

        if (isParent(child)) tagDirectives(child);
    }
};

export default function remarkSpoiler() {
    return (tree: Root) => {
        tagDirectives(tree);
    };
}
