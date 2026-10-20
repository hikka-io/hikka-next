import { useRef } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    changeUiMutation,
    profileUiQueryKey,
    type UserCustomizationArgs,
    type UserCustomizationResponse,
} from '@hikka/api';
import { applySessionUIPatch, type SessionUIPatch } from '@hikka/core';

import { writeSessionUI } from '@/utils/api/invalidate-content-state';

export function useUpdateSessionUI() {
    const queryClient = useQueryClient();
    const queryKey = profileUiQueryKey();
    const mutation = useMutation({ ...changeUiMutation() });

    const inFlightRef = useRef(false);
    const queuedRef = useRef<UserCustomizationResponse | null>(null);
    const snapshotRef = useRef<UserCustomizationResponse | undefined>(
        undefined,
    );

    const send = (payload: UserCustomizationResponse) => {
        inFlightRef.current = true;
        mutation.mutate(
            { body: payload as unknown as UserCustomizationArgs },
            {
                onSuccess: () => {
                    const queued = queuedRef.current;
                    queuedRef.current = null;
                    if (queued) {
                        send(queued);
                    } else {
                        inFlightRef.current = false;
                        snapshotRef.current = undefined;
                    }
                },
                onError: () => {
                    inFlightRef.current = false;
                    queuedRef.current = null;
                    writeSessionUI(queryClient, snapshotRef.current);
                    snapshotRef.current = undefined;
                },
            },
        );
    };

    const update = (patch: SessionUIPatch) => {
        const previous =
            queryClient.getQueryData<UserCustomizationResponse>(queryKey);
        const { next, payload } = applySessionUIPatch(previous, patch);

        writeSessionUI(queryClient, (old) => ({
            ...old,
            ...next,
        }));

        if (inFlightRef.current) {
            queuedRef.current = payload;
        } else {
            snapshotRef.current = previous;
            send(payload);
        }
    };

    return { update, isPending: mutation.isPending };
}
