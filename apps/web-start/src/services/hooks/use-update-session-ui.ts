'use client';

import { UIFeedSettings, UserUI } from '@hikka/client';
import { useUpdateUserUI } from '@hikka/react';
import { queryKeys } from '@hikka/react/core';
import { useQueryClient } from '@tanstack/react-query';

import { DEFAULT_USER_UI, diffStyles } from '@/utils/ui';

type SessionUIPatch = {
    styles?: UserUI['styles'];
    preferences?: Partial<
        Omit<UserUI['preferences'], 'feed'> & {
            feed?: Partial<UIFeedSettings>;
        }
    >;
};

export function useUpdateSessionUI() {
    const queryClient = useQueryClient();
    const queryKey = queryKeys.user.ui('me');
    const mutation = useUpdateUserUI();

    const update = (patch: SessionUIPatch) => {
        const previous = queryClient.getQueryData<UserUI>(queryKey);
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

        const resolvedNext: UserUI = {
            styles: patch.styles ?? currentUI.styles,
            preferences: mergedPreferences,
        };

        const apiPayload: UserUI = {
            styles: diffStyles(resolvedNext.styles) || {},
            preferences: resolvedNext.preferences,
        };

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
