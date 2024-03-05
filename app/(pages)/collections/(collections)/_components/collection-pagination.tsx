'use client';

import * as React from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import Pagination from '@/components/ui/pagination';
import createQueryString from '@/utils/createQueryString';

interface Props {
    collections?: API.WithPagination<API.Collection>;
}

const Component = ({ collections }: Props) => {
    if (!collections || collections.pagination.pages < 2) {
        return null;
    }

    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const updatePage = (newPage: number) => {
        const query = createQueryString(
            'page',
            String(newPage),
            new URLSearchParams(searchParams),
        );
        router.push(`${pathname}?${query}`, { scroll: true });
    };

    return (
        <Pagination
            page={collections.pagination.page}
            pages={collections.pagination.pages}
            setPage={updatePage}
        />
    );
};

export default Component;
