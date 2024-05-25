import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import AntDesignFilterFilled from '~icons/ant-design/filter-filled';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import NavMenu from '@/components/navigation/nav-dropdown';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import Header from '@/components/ui/header';

import EditList from '@/features/edit/edit-list/edit-list.component';
import EditTopStats from '@/features/edit/edit-top-stats/edit-top-stats.component';
import Filters from '@/features/filters/edit-filters.component';
import EditFiltersModal from '@/features/modals/edit-filters-modal';

import getEditList from '@/services/api/edit/getEditList';
import getEditTop from '@/services/api/stats/edit/getEditTop';
import { EDIT_NAV_ROUTES } from '@/utils/constants';
import getQueryClient from '@/utils/getQueryClient';

const EditListPage = async ({
    searchParams: { page, content_type, order, sort, edit_status },
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) => {
    if (!page) {
        return redirect('/edit?page=1');
    }

    const queryClient = await getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: [
            'editList',
            {
                page,
                content_type: content_type || null,
                order: order || 'desc',
                sort: sort || 'edit_id',
                edit_status: edit_status || null,
            },
        ],
        queryFn: ({ meta }) => getEditList({ page: Number(page) }),
    });

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['editTopStats'],
        queryFn: ({ pageParam, meta }) =>
            getEditTop({ page: Number(pageParam) }),
        initialPageParam: 1,
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <Breadcrumbs>
                <NavMenu routes={EDIT_NAV_ROUTES} urlPrefix="/edit" />
            </Breadcrumbs>
            <div className="flex flex-col gap-12 lg:gap-12">
                <EditTopStats />
                <div className="grid grid-cols-1 justify-center gap-8 lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-16">
                    <div className="flex flex-col gap-12">
                        <Block>
                            <div className="flex items-center justify-between">
                                <Header title="Правки" />
                                <EditFiltersModal>
                                    <Button
                                        variant="outline"
                                        className="flex lg:hidden"
                                    >
                                        <AntDesignFilterFilled /> Фільтри
                                    </Button>
                                </EditFiltersModal>
                            </div>
                            <EditList page={page as string} />
                        </Block>
                    </div>
                    <Card className="sticky top-20 order-1 hidden w-full py-0 opacity-60 transition-opacity hover:opacity-100 lg:order-2 lg:block">
                        <Filters />
                    </Card>
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default EditListPage;
