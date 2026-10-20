import { useQuery } from '@tanstack/react-query';

import type { MainContentTypeEnum } from '@hikka/api';

import { useAuthToken } from '@/features/auth';

import { listEntryOptions } from './list-entry-options';
import type { ListEntry } from './tracking-body';

export type ListEntryState =
    | { state: 'signed-out' }
    | { state: 'loading' }
    | { state: 'error'; retry: () => void }
    | { state: 'untracked' }
    | { state: 'tracked'; entry: ListEntry };

type Args = {
    contentType: MainContentTypeEnum;
    slug: string;
    /** `undefined`: not supplied, fetched here. `null`: known untracked (an embedded list said so). */
    entry?: ListEntry | null;
};

/**
 * The viewer's entry in one of four states. Only a successful read says "untracked";
 * a failed one is `error`, so nothing can write a snapshot built from an empty entry.
 * The per-title cache (written by every save and delete) wins over a supplied entry.
 */
export function useListEntry({
    contentType,
    slug,
    entry: supplied,
}: Args): ListEntryState {
    const token = useAuthToken();
    const query = useQuery({
        ...listEntryOptions(contentType, slug),
        enabled: Boolean(token) && supplied === undefined,
    });

    if (!token) return { state: 'signed-out' };

    const entry = query.data !== undefined ? query.data : supplied;

    if (entry === undefined) {
        return query.isError
            ? { state: 'error', retry: () => void query.refetch() }
            : { state: 'loading' };
    }

    return entry ? { state: 'tracked', entry } : { state: 'untracked' };
}
