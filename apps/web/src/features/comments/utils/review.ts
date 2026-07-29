import type { ReviewResponse, ReviewStatsResponse } from '@hikka/api';

export type Verdict = ReviewResponse['recommended'];

export const REVIEW_CONTENT_TYPES = ['anime', 'manga', 'novel'] as const;

export function supportsReviews(contentType: string): boolean {
    return (REVIEW_CONTENT_TYPES as readonly string[]).includes(contentType);
}

/** `null`, not `undefined`: an explicit null is what drops an existing review. */
export function toReviewArgs(
    isReview: boolean,
    verdict: Verdict | null,
): { recommended: Verdict } | null {
    if (!isReview || !verdict) return null;
    return { recommended: verdict };
}

// Both conversions go through the comment-edit endpoint, so they inherit its
// `is_editable` gate.
export function canConvertReview(params: {
    isAuthor: boolean;
    isEditable: boolean;
    hidden: boolean;
    text: string | null;
    parent: string | null;
    contentType: string;
}): boolean {
    return (
        params.isAuthor &&
        params.isEditable &&
        !params.hidden &&
        !!params.text &&
        !params.parent &&
        supportsReviews(params.contentType)
    );
}

export function canDemoteReview(params: {
    isAuthor: boolean;
    isEditable: boolean;
    hidden: boolean;
    text: string | null;
    isReview: boolean;
}): boolean {
    return (
        params.isAuthor &&
        params.isEditable &&
        !params.hidden &&
        !!params.text &&
        params.isReview
    );
}

/**
 * `parent` is the edited comment's parent; the root composer passes null.
 * An existing review always keeps the toggle, so demoting stays an explicit
 * choice even if the comment somehow sits outside the promotable set.
 */
export function canToggleReview(params: {
    contentType: string;
    isReply: boolean;
    parent: string | null;
    isExistingReview: boolean;
}): boolean {
    return (
        params.isExistingReview ||
        (supportsReviews(params.contentType) &&
            !params.isReply &&
            !params.parent)
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
