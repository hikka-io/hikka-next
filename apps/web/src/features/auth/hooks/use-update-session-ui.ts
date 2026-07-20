import { useRef } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    changeUiMutation,
    profileUiQueryKey,
    type UiFeedSettingsOutput,
    type UserCustomizationArgs,
    type UserCustomizationResponse,
} from '@hikka/api';

import { DEFAULT_USER_UI, diffStyles } from '@/utils/ui';

type SessionUIPatch = {
    styles?: UserCustomizationResponse['styles'];
    preferences?: Partial<
        Omit<UserCustomizationResponse['preferences'], 'feed'> & {
            feed?: Partial<UiFeedSettingsOutput>;
        }
    >;
};

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
                    queryClient.setQueryData(queryKey, snapshotRef.current);
                    snapshotRef.current = undefined;
                },
            },
        );
    };

    const update = (patch: SessionUIPatch) => {
        const previous =
            queryClient.getQueryData<UserCustomizationResponse>(queryKey);
        const currentUI = previous ?? DEFAULT_USER_UI;

        const mergedPreferences = patch.preferences
            ? {
                  ...currentUI.preferences,
                  ...patch.preferences,
                  feed: patch.preferences.feed
                      ? {
                            ...currentUI.preferences.feed,
                            ...patch.preferences.feed,
                        }
                      : currentUI.preferences.feed,
              }
            : currentUI.preferences;

        const resolvedNext: UserCustomizationResponse = {
            styles: patch.styles ?? currentUI.styles,
            preferences: mergedPreferences,
        };

        const apiPayload: UserCustomizationResponse = {
            styles: diffStyles(resolvedNext.styles) || {},
            preferences: resolvedNext.preferences,
        };

        queryClient.setQueryData<UserCustomizationResponse>(
            queryKey,
            (old) => ({
                ...old,
                ...resolvedNext,
            }),
        );

        if (inFlightRef.current) {
            queuedRef.current = apiPayload;
        } else {
            snapshotRef.current = previous;
            send(apiPayload);
        }
    };

    return { update, isPending: mutation.isPending };
}
