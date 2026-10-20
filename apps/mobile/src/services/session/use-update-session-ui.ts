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

import { writeSessionUI } from '@/utils/api/invalidate-content-state';

const SAVE_ERROR = 'Не вдалося зберегти налаштування. Спробуйте ще раз.';

// One writer for the whole app: the PUT replaces the document, so two in flight could land out of order.
const writer: {
    inFlight: boolean;
    queued: UserCustomizationResponse | null;
    snapshot: UserCustomizationResponse | undefined;
} = { inFlight: false, queued: null, snapshot: undefined };

/**
 * Optimistic, serialized writes of the viewer's UI customization (title language, NSFW, brand
 * color): the cache shows the change at once, requests go one at a time with the newest queued
 * payload replacing an older one, and a failure restores the snapshot taken before the burst.
 */
export function useUpdateSessionUI() {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({ ...changeUiMutation() });

    const drain = async (first: UserCustomizationResponse) => {
        writer.inFlight = true;
        let payload: UserCustomizationResponse | null = first;

        try {
            while (payload) {
                await mutateAsync({
                    body: payload as unknown as UserCustomizationArgs,
                });
                payload = writer.queued;
                writer.queued = null;
            }
            writer.snapshot = undefined;
        } catch (error) {
            writer.queued = null;
            writeSessionUI(queryClient, writer.snapshot);
            writer.snapshot = undefined;
            toast.error(apiErrorMessage(error, SAVE_ERROR));
        } finally {
            writer.inFlight = false;
        }
    };

    const update = async (patch: SessionUIPatch) => {
        const current =
            queryClient.getQueryData<UserCustomizationResponse>(
                profileUiQueryKey(),
            ) ??
            (await queryClient
                .fetchQuery(profileUiOptions())
                .catch(() => undefined));

        // Never write a patch over defaults the viewer's saved document was not read into.
        if (!current) {
            toast.error(SAVE_ERROR);
            return;
        }

        const { next, payload } = applySessionUIPatch(current, patch);

        if (!writer.inFlight) writer.snapshot = current;
        writeSessionUI(queryClient, (old) => ({ ...old, ...next }));

        if (writer.inFlight) writer.queued = payload;
        else await drain(payload);
    };

    return { update, isPending };
}
