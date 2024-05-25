import { useQuery } from '@tanstack/react-query';

import getCompanies, { Params } from '@/services/api/companies/getCompanies';

const useCompanies = (params: Params) => {
    return useQuery({
        queryKey: ['companies', { ...params }],
        queryFn: () =>
            getCompanies({
                params,
            }),
    });
};

export default useCompanies;
