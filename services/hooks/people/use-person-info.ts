import { useQuery } from '@tanstack/react-query';

import getPersonInfo, { Params } from '@/services/api/people/getPersonInfo';

const usePersonInfo = ({ slug }: Params) => {
    return useQuery({
        queryKey: ['person', slug],
        queryFn: () => getPersonInfo({ params: { slug } }),
    });
};

export default usePersonInfo;
