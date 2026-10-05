import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
    acceptCollectionInviteMutation,
    acceptCollectionOwnershipMutation,
    cancelCollectionOwnershipOfferMutation,
    deleteCollectionMemberMutation,
    inviteCollectionMemberMutation,
    offerCollectionOwnershipMutation,
} from '@hikka/api';

import {
    invalidateCollectionMembers,
    invalidateNotifications,
} from '@/utils/api/invalidate-content-state';
import { useRouter } from '@/utils/navigation';

import { useCollectionAccess } from './use-collection-access';

/**
 * Every membership mutation of a collection, sharing one cache reconciliation.
 * Membership changes flip `my_role`, so the collection is refetched as well.
 */
export const useCollectionMemberActions = (reference: string) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { isPrivate } = useCollectionAccess(reference);

    const onSuccess = () => invalidateCollectionMembers(queryClient);

    const onAnswered = () => {
        onSuccess();
        invalidateNotifications(queryClient);
    };

    const invite = useMutation({
        ...inviteCollectionMemberMutation(),
        onSuccess: (member) => {
            onSuccess();
            toast.success(`Запрошення надіслано ${member.user.username}`);
        },
    });
    const acceptInvite = useMutation({
        ...acceptCollectionInviteMutation(),
        onSuccess: onAnswered,
    });
    const leave = useMutation({
        ...deleteCollectionMemberMutation(),
    });
    const remove = useMutation({
        ...deleteCollectionMemberMutation(),
        onSuccess,
    });
    const offerOwnership = useMutation({
        ...offerCollectionOwnershipMutation(),
        onSuccess,
    });
    const acceptOwnership = useMutation({
        ...acceptCollectionOwnershipMutation(),
        onSuccess: onAnswered,
    });
    const cancelOffer = useMutation({
        ...cancelCollectionOwnershipOfferMutation(),
        onSuccess: onAnswered,
    });

    const path = (username?: string | null) => ({
        path: { reference, username: username ?? '' },
    });

    return {
        isPending: [
            invite,
            acceptInvite,
            leave,
            remove,
            offerOwnership,
            acceptOwnership,
            cancelOffer,
        ].some((mutation) => mutation.isPending),

        invite: (username?: string | null) => invite.mutate(path(username)),
        acceptInvite: () => acceptInvite.mutate({ path: { reference } }),

        /**
         * The caller drops its own membership: leaving as an editor or
         * declining an invite. A private collection is gone for them right
         * after, so step off the page before the refetch turns it into a 404
         */
        leave: (username: string | null | undefined, redirectTo: string) =>
            leave.mutate(path(username), {
                onSuccess: () => {
                    if (isPrivate) router.push(redirectTo);

                    onAnswered();
                },
            }),

        remove: (username?: string | null) => remove.mutate(path(username)),
        offerOwnership: (username?: string | null) =>
            offerOwnership.mutate(path(username)),
        acceptOwnership: () => acceptOwnership.mutate({ path: { reference } }),
        cancelOffer: () => cancelOffer.mutate({ path: { reference } }),
    };
};
