export type Verdict = 'yes' | 'no' | 'maybe';

export const REVIEW_CONTENT_TYPES = ['anime', 'manga', 'novel'] as const;

export function supportsReviews(contentType: string): boolean {
    return (REVIEW_CONTENT_TYPES as readonly string[]).includes(contentType);
}

export function toReviewArgs(
    isReview: boolean,
    verdict: Verdict | null,
): { recommended: Verdict } | undefined {
    if (!isReview || !verdict) return undefined;
    return { recommended: verdict };
}

export const REVIEW_AUTO_THRESHOLD = 500;

// Structural node type so this util needs no platejs import — matches both
// TText ({ text }) and TElement ({ children }) shapes.
type TextishNode = {
    text?: unknown;
    children?: readonly TextishNode[];
    [key: string]: unknown;
};

export function getPlainTextLength(nodes: readonly TextishNode[]): number {
    let length = 0;
    for (const node of nodes) {
        if (typeof node.text === 'string') {
            length += node.text.length;
        } else if (node.children) {
            length += getPlainTextLength(node.children);
        }
    }
    return length;
}
