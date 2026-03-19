'use client';

import { UserUI } from '@hikka/client';
import { useUpdateUserUI } from '@hikka/react';
import { queryKeys } from '@hikka/react/core';
import { useQueryClient } from '@tanstack/react-query';

import { DEFAULT_USER_UI } from '@/utils/ui';

type SessionUIPatch = Partial<Pick<UserUI, 'styles' | 'preferences'>>;

export function useUpdateSessionUI() {
    const queryClient = useQueryClient();
    const queryKey = queryKeys.user.ui('me');
    const mutation = useUpdateUserUI();

    const update = (patch: SessionUIPatch) => {
        const currentUI =
            queryClient.getQueryData<UserUI>(queryKey) ?? DEFAULT_USER_UI;
        const next: Omit<UserUI, 'username'> = {
            styles: patch.styles ?? currentUI.styles,
            preferences: patch.preferences
                ? { ...currentUI.preferences, ...patch.preferences }
                : currentUI.preferences,
        };

        // Optimistic update
        const previous = queryClient.getQueryData<UserUI>(queryKey);
        queryClient.setQueryData<UserUI>(queryKey, (old) => ({
            ...old,
            ...next,
        }));

        mutation.mutate(
            { userUI: next },
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
