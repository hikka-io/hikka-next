import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import useAnimeCatalog, {
    Props,
} from '@/services/hooks/anime/use-anime-catalog';
import createQueryString from '@/utils/create-query-string';

export const useUpdatePage = ({ page, iPage }: Props) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    return (newPage: number) => {
        if (newPage !== Number(page) || newPage !== Number(iPage)) {
            queryClient.removeQueries({
                queryKey: ['anime-list', page, {}],
                exact: false,
            });
            const query = createQueryString(
                'iPage',
                String(newPage),
                createQueryString(
                    'page',
                    String(newPage),
                    new URLSearchParams(searchParams),
                ),
            );
            router.push(`${pathname}?${query.toString()}`, { scroll: true });
        }
    };
};

interface UseLoadInfinitePageProps {
    pagination?: ReturnType<typeof useAnimeCatalog>['pagination'];
    fetchNextPage: ReturnType<typeof useAnimeCatalog>['fetchNextPage'];
}

export const useNextPage = ({
    fetchNextPage,
    pagination,
}: UseLoadInfinitePageProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    return () => {
        if (pagination) {
            const query = createQueryString(
                'iPage',
                String(pagination.page + 1),
                new URLSearchParams(searchParams),
            );

            router.replace(`${pathname}?${query.toString()}`, {
                scroll: false,
            });

            fetchNextPage();
        }
    };
};
