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

        mutation.mutate(
            { body: apiPayload as unknown as UserCustomizationArgs },
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
