import type { ReviewResponse, ReviewStatsResponse } from '@hikka/api';

export type Verdict = ReviewResponse['recommended'];

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

export function canConvertReview(params: {
    isAuthor: boolean;
    hidden: boolean;
    text: string | null;
    parent: string | null;
    contentType: string;
}): boolean {
    return (
        params.isAuthor &&
        !params.hidden &&
        !!params.text &&
        !params.parent &&
        supportsReviews(params.contentType)
    );
}

export function getReviewTotal(stats: ReviewStatsResponse | undefined): number {
    if (!stats) return 0;
    return (stats.yes ?? 0) + (stats.maybe ?? 0) + (stats.no ?? 0);
}

export const REVIEW_MAJORITY_SHARE = 0.6;

/** Headline sentiment for a title's reviews. */
export function getReviewVerdict(
    stats: ReviewStatsResponse | undefined,
): string | null {
    const total = getReviewTotal(stats);
    if (!stats || total === 0) return null;

    const yes = stats.yes ?? 0;
    const maybe = stats.maybe ?? 0;
    const no = stats.no ?? 0;

    if (yes / total >= REVIEW_MAJORITY_SHARE) return 'Здебільшого радять';
    if (no / total >= REVIEW_MAJORITY_SHARE) return 'Здебільшого не радять';

    if (maybe >= yes && maybe >= no) return 'Неоднозначні враження';
    return 'Думки розділились';
}

export const REVIEW_AUTO_THRESHOLD = 500;

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
