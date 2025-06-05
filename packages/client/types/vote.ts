/**
 * Vote related types
 */
import { ContentTypeEnum } from './common';

/**
 * Content type for votable content
 */
export type VoteContentType =
    | ContentTypeEnum.COLLECTION
    | ContentTypeEnum.COMMENT
    | ContentTypeEnum.ARTICLE;

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
