import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    type DeleteReadData,
    type DeleteReadResponse,
    type DeleteWatchData,
    type DeleteWatchResponse,
    deleteReadMutation,
    deleteWatchMutation,
    type Options,
    type ReadAddData,
    type ReadAddResponse,
    readAddMutation,
    type WatchAddData,
    type WatchAddResponse,
    watchAddMutation,
} from '@hikka/api';

import {
    applyReadDeletion,
    applyReadMutation,
    applyWatchDeletion,
    applyWatchMutation,
} from '@/utils/api/invalidate-content-state';

type TrackingMutationOptions<TData, TVariables> = {
    onSuccess?: (data: TData, variables: TVariables) => void;
};

type AddMutationOptions<TData, TVariables> = TrackingMutationOptions<
    TData,
    TVariables
> & {
    awaitInvalidation?: boolean;
};

export const useAddWatch = ({
    onSuccess,
    awaitInvalidation,
}: AddMutationOptions<WatchAddResponse, Options<WatchAddData>> = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        ...watchAddMutation(),
        onSuccess: (data, variables) => {
            const invalidation = applyWatchMutation(queryClient, data);
            onSuccess?.(data, variables);
            return awaitInvalidation ? invalidation : undefined;
        },
    });
};

export const useAddRead = ({
    onSuccess,
    awaitInvalidation,
}: AddMutationOptions<ReadAddResponse, Options<ReadAddData>> = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        ...readAddMutation(),
        onSuccess: (data, variables) => {
            const invalidation = applyReadMutation(queryClient, data);
            onSuccess?.(data, variables);
            return awaitInvalidation ? invalidation : undefined;
        },
    });
};

export const useDeleteWatch = ({
    onSuccess,
}: TrackingMutationOptions<
    DeleteWatchResponse,
    Options<DeleteWatchData>
> = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        ...deleteWatchMutation(),
        onSuccess: (data, variables) => {
            applyWatchDeletion(queryClient, variables.path.slug);
            onSuccess?.(data, variables);
        },
    });
};

export const useDeleteRead = ({
    onSuccess,
}: TrackingMutationOptions<
    DeleteReadResponse,
    Options<DeleteReadData>
> = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        ...deleteReadMutation(),
        onSuccess: (data, variables) => {
            applyReadDeletion(
                queryClient,
                variables.path.content_type,
                variables.path.slug,
            );
            onSuccess?.(data, variables);
        },
    });
};
