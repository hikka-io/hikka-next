import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import type { MainContentTypeEnum } from '@hikka/api';
import { listEntryOptions } from '@hikka/core';

import { isDeadTokenError, signOut, useAuthToken } from '@/features/auth';

import { type ListEntry, resolveListEntry } from './tracking-body';

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
 * The viewer's entry in one of five states. Only a successful read says "untracked"; a failed
 * one is `error`, and a disagreement between the supplied and the cached entry is `loading`
 * until the entry is re-read (`resolveListEntry`), so no control writes from a stale snapshot.
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
    const { data: cached, refetch } = query;
    const disagree =
        supplied !== undefined &&
        cached !== undefined &&
        (supplied === null) !== (cached === null);
    // When the current disagreement was noticed: a read or write after it settles it.
    const [verifyFrom, setVerifyFrom] = useState<number | null>(null);
    const cachedVerified =
        verifyFrom !== null &&
        !query.isFetching &&
        query.dataUpdatedAt >= verifyFrom;

    const resolution = resolveListEntry({
        supplied,
        cached,
        cachedVerified,
        isError: query.isError,
    });

    useEffect(() => {
        if (!token) return;
        if (disagree && verifyFrom === null) {
            setVerifyFrom(Date.now());
            // Cancels any older in-flight read, so the result is from after the disagreement.
            void refetch();
        } else if (!disagree && verifyFrom !== null) {
            setVerifyFrom(null);
        }
    }, [token, disagree, verifyFrom, refetch]);

    useEffect(() => {
        if (token && isDeadTokenError(query.error)) void signOut();
    }, [token, query.error]);

    if (!token) return { state: 'signed-out' };

    switch (resolution.state) {
        case 'resolved':
            return resolution.entry
                ? { state: 'tracked', entry: resolution.entry }
                : { state: 'untracked' };
        case 'error':
            return { state: 'error', retry: () => void refetch() };
        default:
            return { state: 'loading' };
    }
}
