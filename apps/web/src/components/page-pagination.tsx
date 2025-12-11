'use client';

import { PaginationResponse } from '@hikka/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import Pagination from '@/components/ui/pagination';

import { createQueryString } from '@/utils/url';

interface Props {
    pagination: PaginationResponse;
}

const Component = ({ pagination }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const updatePage = (newPage: number) => {
        const query = createQueryString(
            'page',
            String(newPage),
            new URLSearchParams(searchParams),
        );
        router.push(`${pathname}?${query}`);
    };

    if (pagination.pages < 2) {
        return null;
    }

    return (
        <Pagination
            page={pagination.page}
            pages={pagination.pages}
            setPage={updatePage}
        />
    );
};

export default Component;
