import type { ArticlePreviewResponse } from '@hikka/api';

type SlateNode = {
    text?: string;
    children?: SlateNode[];
};

const readNode = (node: SlateNode): string =>
    typeof node.text === 'string'
        ? node.text
        : (node.children?.map(readNode).join('') ?? '');

export const getArticleExcerpt = (
    preview: ArticlePreviewResponse['preview'],
) => {
    for (const node of preview) {
        const text = readNode(node as SlateNode).trim();
        if (text) return text;
    }

    return '';
};
