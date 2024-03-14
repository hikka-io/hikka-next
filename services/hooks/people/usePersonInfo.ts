import { useQuery } from '@tanstack/react-query';

import getPersonInfo from '@/services/api/people/getPersonInfo';

const usePersonInfo = ({ slug }: { slug: string }) => {
    return useQuery({
        queryKey: ['person', slug],
        queryFn: () => getPersonInfo({ slug }),
    });
};

export default usePersonInfo;
