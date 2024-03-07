import { useSnackbar } from 'notistack';

import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import deleteCollection from '@/services/api/collections/deleteCollection';
import useLoggedUser from '@/services/hooks/user/useLoggedUser';
import { useAuthContext } from '@/services/providers/auth-provider';


const useDeleteCollection = ({ reference }: { reference: string }) => {
    const { secret } = useAuthContext();
    const queryClient = useQueryClient();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { data: loggedUser } = useLoggedUser();

    return useMutation({
        mutationFn: () =>
            deleteCollection({
                secret: secret!,
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

export default useDeleteCollection;
