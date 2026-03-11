'use client';

import { PaginationResponse } from '@hikka/client';
import { useRouter } from '@tanstack/react-router';

import Pagination from '@/components/ui/pagination';

interface Props {
    pagination: PaginationResponse;
}

const Component = ({ pagination }: Props) => {
    const router = useRouter();

    const updatePage = (newPage: number) => {
        router.navigate({
            to: '.',
            search: (prev: Record<string, unknown>) => ({
                ...prev,
                page: newPage,
            }),
            replace: true,
        } as any);
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
