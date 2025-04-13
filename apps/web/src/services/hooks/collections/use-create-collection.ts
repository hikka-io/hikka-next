import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';

import createCollction, {
    Params,
} from '../../api/collections/createCollection';

const useCreateCollection = (params: Params) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: () => createCollction({ params }),
        mutationKey: ['createCollection'],
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({
                queryKey: ['collection', data.reference],
                exact: false,
            });
            enqueueSnackbar('Колекцію успішно створено', {
                variant: 'success',
            });
            router.push(`/collections/${data.reference}`);
        },
    });
};

export default useCreateCollection;
