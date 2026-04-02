'use client';

import { UserUI } from '@hikka/client';
import { useUpdateUserUI } from '@hikka/react';
import { queryKeys } from '@hikka/react/core';
import { useQueryClient } from '@tanstack/react-query';

import { DEFAULT_USER_UI, diffStyles } from '@/utils/ui';

type SessionUIPatch = {
    styles?: UserUI['styles'];
    preferences?: Partial<UserUI['preferences']>;
};

export function useUpdateSessionUI() {
    const queryClient = useQueryClient();
    const queryKey = queryKeys.user.ui('me');
    const mutation = useUpdateUserUI();

    const update = (patch: SessionUIPatch) => {
        const currentUI =
            queryClient.getQueryData<UserUI>(queryKey) ?? DEFAULT_USER_UI;

        // Full resolved styles for optimistic cache update (used by rendering)
        const resolvedNext: UserUI = {
            styles: patch.styles ?? currentUI.styles,
            preferences: patch.preferences
                ? { ...currentUI.preferences, ...patch.preferences }
                : currentUI.preferences,
        };

        // Sparse styles for API: diff against defaults so only overrides are persisted
        const apiPayload: UserUI = {
            styles: diffStyles(resolvedNext.styles) || {},
            preferences: resolvedNext.preferences,
        };

        // Optimistic update with full resolved styles for immediate rendering
        const previous = queryClient.getQueryData<UserUI>(queryKey);
        queryClient.setQueryData<UserUI>(queryKey, (old) => ({
            ...old,
            ...resolvedNext,
        }));

        mutation.mutate(
            { userUI: apiPayload },
            {
                onError: () => {
                    // Rollback on error
                    queryClient.setQueryData(queryKey, previous);
                },
            },
        );
    };

    return { update, isPending: mutation.isPending };
}
