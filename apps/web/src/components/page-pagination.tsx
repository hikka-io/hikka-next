import { useRouter } from '@tanstack/react-router';

import type { PaginationResponse } from '@hikka/api';

import { StickyPagination } from '@/components/ui/pagination';

type Props = {
    pagination: PaginationResponse;
};

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

    return (
        <StickyPagination
            page={pagination.page}
            pages={pagination.pages}
            setPage={updatePage}
        />
    );
};

export default Component;
