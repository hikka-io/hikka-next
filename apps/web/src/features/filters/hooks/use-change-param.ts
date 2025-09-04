'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import createQueryString from '@/utils/create-query-string';

const useChangeParam = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;

    const handleChangeParam = (
        name: string,
        value: string | string[] | boolean,
    ) => {
        const query = createQueryString(
            name,
            value,
            createQueryString('page', '1', new URLSearchParams(searchParams)),
        );
        router.replace(`${pathname}?${query}`);
    };

    return handleChangeParam;
};

export default useChangeParam;
