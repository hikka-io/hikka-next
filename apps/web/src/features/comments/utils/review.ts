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
