import { useMutation } from '@tanstack/react-query';

import requestTokenReference from '@/services/api/auth/requestTokenReference';

const useRequestTokenReference = () => {
    return useMutation({
        mutationKey: ['token-reference'],
        mutationFn: requestTokenReference,
        onSuccess: () => {},
    });
};

export default useRequestTokenReference;
