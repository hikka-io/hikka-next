import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import requestTokenReference from '../../api/auth/requestTokenReference';

const useRequestTokenReference = () => {
    const router = useRouter();

    return useMutation({
        mutationKey: ['token-reference'],
        mutationFn: requestTokenReference,
        onSuccess: (data) => {
            router.push(data.redirect_url);
        },
    });
};

export default useRequestTokenReference;
