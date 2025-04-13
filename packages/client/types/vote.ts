/**
 * Vote related types
 */

/**
 * Content type enum for votable content
 */
export enum VoteContentTypeEnum {
    COLLECTION = 'collection',
    COMMENT = 'comment',
    ARTICLE = 'article',
}

/**
 * Vote arguments
 */
export interface VoteArgs {
    score: number; // -1, 0, or 1
}

/**
 * Vote response
 */
export interface VoteResponse {
    score: number;
}
