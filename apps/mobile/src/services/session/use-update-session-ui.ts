import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';

import {
    changeUiMutation,
    profileUiOptions,
    profileUiQueryKey,
    type UserCustomizationArgs,
    type UserCustomizationResponse,
} from '@hikka/api';
import {
    apiErrorMessage,
    applySessionUIPatch,
    type SessionUIPatch,
} from '@hikka/core';

import {
    invalidateSessionUI,
    writeSessionUI,
} from '@/utils/api/invalidate-content-state';

import { writer } from './session-ui-writer';

const SAVE_ERROR = 'Не вдалося зберегти налаштування. Спробуйте ще раз.';

/**
 * Optimistic, serialized writes of the viewer's UI customization (title language, NSFW, brand
 * color): the cache shows the change at once, requests go one at a time with the newest queued
 * payload replacing an older one, and a failure refetches the saved document (the server is the
 * truth after a burst of writes, not a snapshot taken before it).
 */
export function useUpdateSessionUI() {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({ ...changeUiMutation() });

    const drain = async (first: UserCustomizationResponse) => {
        const epoch = writer.epoch;
        writer.inFlight = true;
        let payload: UserCustomizationResponse | null = first;

        try {
            while (payload) {
                await mutateAsync({
                    body: payload as unknown as UserCustomizationArgs,
                });
                if (writer.epoch !== epoch) return;
                payload = writer.queued;
                writer.queued = null;
            }
        } catch (error) {
            if (writer.epoch !== epoch) return;
            writer.queued = null;
            void invalidateSessionUI(queryClient);
            toast.error(apiErrorMessage(error, SAVE_ERROR));
        } finally {
            if (writer.epoch === epoch) writer.inFlight = false;
        }
    };

    const update = async (patch: SessionUIPatch) => {
        const epoch = writer.epoch;

        if (!queryClient.getQueryData(profileUiQueryKey())) {
            await queryClient
                .fetchQuery(profileUiOptions())
                .catch(() => undefined);
        }

        // Read after the await: another update may have written meanwhile, and a session change drops this one.
        const current = queryClient.getQueryData<UserCustomizationResponse>(
            profileUiQueryKey(),
        );

        // Never write a patch over defaults the viewer's saved document was not read into.
        if (writer.epoch !== epoch) return;
        if (!current) {
            toast.error(SAVE_ERROR);
            return;
        }

        const { next, payload } = applySessionUIPatch(current, patch);

        writeSessionUI(queryClient, (old) => ({ ...old, ...next }));

        if (writer.inFlight) writer.queued = payload;
        else await drain(payload);
    };

    return { update, isPending };
}
