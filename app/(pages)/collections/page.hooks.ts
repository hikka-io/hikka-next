import { useSnackbar } from 'notistack';

import { useRouter } from 'next/navigation';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useLoggedUser } from '@/app/page.hooks';
import createCollction, {
    Request as CollectionRequest,
} from '@/services/api/collections/createCollection';
import deleteCollection from '@/services/api/collections/deleteCollection';
import getCollection from '@/services/api/collections/getCollection';
import getCollections from '@/services/api/collections/getCollections';
import updateCollection from '@/services/api/collections/updateCollection';


export const useCollections = ({
    page,
    size,
    secret,
    enabled = true,
}: {
    page?: number;
    size?: number;
    secret?: string;
    enabled?: boolean;
}) => {
    return useQuery({
        queryKey: ['collections', { page, size, secret }],
        queryFn: () => getCollections({ page, size, secret }),
        enabled: enabled,
    });
};

export const useCollection = ({
    reference,
    secret,
    enabled = true,
}: {
    reference: string;
    secret?: string;
    enabled?: boolean;
}) => {
    return useQuery({
        queryKey: ['collection', { reference: reference, secret }],
        queryFn: () => getCollection({ reference: reference, secret }),
        enabled: enabled,
    });
};

export const useCreateCollection = ({
    secret,
    ...params
}: {
    secret?: string;
} & CollectionRequest) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: () => createCollction({ ...params, secret: secret }),
        mutationKey: ['createCollection'],
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({
                queryKey: ['collection', { reference: data.reference }],
            });
            enqueueSnackbar('Колекцію успішно створено', {
                variant: 'success',
            });
            router.push(`/collections/${data.reference}`);
        },
    });
};

export const useUpdateCollection = ({
    secret,
    reference,
    ...params
}: {
    reference: string;
    secret?: string;
} & CollectionRequest) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: () =>
            updateCollection({
                ...params,
                secret: secret,
                reference: reference,
            }),
        mutationKey: ['updateCollection'],
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({
                queryKey: ['collection', { reference: data.reference }],
            });
            enqueueSnackbar('Колекцію успішно оновлено', {
                variant: 'success',
            });
            router.push(`/collections/${data.reference}`);
        },
    });
};

export const useDeleteCollection = ({
    secret,
    reference,
}: {
    reference: string;
    secret: string;
}) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { data: loggedUser } = useLoggedUser();

    return useMutation({
        mutationFn: () =>
            deleteCollection({
                secret: secret,
                reference: reference,
            }),
        mutationKey: ['deleteCollection'],
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({
                queryKey: ['collection', { reference: data.reference }],
            });
            enqueueSnackbar('Колекцію успішно видалено', {
                variant: 'success',
            });
            router.push(`/u/${loggedUser?.username}`);
        },
    });
};
