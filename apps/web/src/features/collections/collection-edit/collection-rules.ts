import { API_LIMITS } from '@hikka/api';
import { isValidTitleLength } from '@hikka/core';

import type { CollectionState, Group } from './collection-store';

// Backend `content-limit` check (app/collections/dependencies.py), which the spec does not carry.
export const COLLECTION_ITEMS_MAX = 500;

export type GroupTitleIssue = 'empty' | 'duplicate';

/** The saved groups (named, with titles) whose name the backend would reject, by group id. */
export function groupTitleIssues(
    groups: Group[],
): Map<string, GroupTitleIssue> {
    const named = groups.filter(
        (group) => group.title !== null && group.items.length > 0,
    );
    const counts = new Map<string, number>();

    for (const group of named) {
        const title = group.title?.trim();
        if (title) counts.set(title, (counts.get(title) ?? 0) + 1);
    }

    const issues = new Map<string, GroupTitleIssue>();

    for (const group of named) {
        const title = group.title?.trim();

        if (!title) {
            issues.set(group.id, 'empty');
        } else if ((counts.get(title) ?? 0) > 1) {
            issues.set(group.id, 'duplicate');
        }
    }

    return issues;
}

export const isCommentTooShort = (comment?: string) => {
    const length = comment?.trim().length ?? 0;
    return length > 0 && length < API_LIMITS.collectionComment.min;
};

export function canSaveCollection({
    title,
    description,
    groups,
}: Pick<CollectionState, 'title' | 'description' | 'groups'>): boolean {
    const items = groups.flatMap((group) => group.items);

    return (
        isValidTitleLength(title, API_LIMITS.collectionTitle) &&
        isValidTitleLength(description, API_LIMITS.collectionDescription) &&
        items.length > 0 &&
        items.length <= COLLECTION_ITEMS_MAX &&
        !items.some((item) => isCommentTooShort(item.comment)) &&
        groupTitleIssues(groups).size === 0
    );
}
