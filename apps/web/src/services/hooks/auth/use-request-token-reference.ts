import { TokenRequestArgs } from '@hikka/client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useAPIClient } from '@/services/providers/api-client-provider';

const useRequestTokenReference = () => {
    const apiClient = useAPIClient();
    const router = useRouter();

    return useMutation({
        mutationKey: ['token-reference'],
        mutationFn: ({
            clientReference,
            args,
        }: {
            clientReference: string;
            args: TokenRequestArgs;
        }) => apiClient.auth.requestThirdPartyToken(clientReference, args),
        onSuccess: (data) => {
            router.push(data.redirect_url);
        },
    });
};

export default useRequestTokenReference;
