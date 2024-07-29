import { useMutation, useQueryClient } from '@tanstack/react-query';

import acceptEdit from '@/services/api/edit/acceptEdit';
import closeEdit from '@/services/api/edit/closeEdit';
import denyEdit from '@/services/api/edit/denyEdit';

interface Props {
    action: 'accept' | 'deny' | 'close';
}

const useActionEdit = ({ action }: Props) => {
    const queryClient = useQueryClient();

    const getAction = () => {
        switch (action) {
            case 'accept':
                return acceptEdit;
            case 'deny':
                return denyEdit;
            case 'close':
                return closeEdit;
            default:
                return acceptEdit;
        }
    };

    return useMutation({
        mutationFn: getAction(),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['edit'],
                exact: false,
            });

            await queryClient.invalidateQueries({
                queryKey: ['edit-list'],
                exact: false,
            });

            await queryClient.invalidateQueries({
                queryKey: ['anime'],
                exact: false,
            });

            await queryClient.invalidateQueries({
                queryKey: ['manga'],
                exact: false,
            });

            await queryClient.invalidateQueries({
                queryKey: ['novel'],
                exact: false,
            });
        },
    });
};

export default useActionEdit;
