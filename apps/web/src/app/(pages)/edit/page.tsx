import { EditContentType, EditStatusEnum } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
    prefetchEditList,
    prefetchEditsTop,
} from '@hikka/react';
import { permanentRedirect } from 'next/navigation';

import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import NavMenu from '@/components/navigation/nav-dropdown';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import EditList from '@/features/edit/edit-list/edit-list.component';
import EditTopStats from '@/features/edit/edit-top-stats/edit-top-stats.component';
import Filters from '@/features/filters/edit-filters.component';
import EditFiltersModal from '@/features/modals/edit-filters-modal.component';

import { EDIT_NAV_ROUTES } from '@/utils/constants/navigation';
import getHikkaClientConfig from '@/utils/get-hikka-client-config';

const EditListPage = async (props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const searchParams = await props.searchParams;

    const { page, content_type, order, sort, edit_status } = searchParams;

    if (!page) {
        return permanentRedirect('/edit?page=1');
    }

    const queryClient = await getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    await prefetchEditList({
        args: {
            content_type: (content_type as EditContentType) || undefined,
            sort: [`${sort || 'edit_id'}:${order || 'desc'}`],
            status: edit_status ? (edit_status as EditStatusEnum) : undefined,
        },
        paginationArgs: {
            page: Number(page),
        },
        clientConfig,
    });

    await prefetchEditsTop({ clientConfig });

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
                                <Header>
                                    <HeaderContainer>
                                        <HeaderTitle variant="h2">
                                            Правки
                                        </HeaderTitle>
                                    </HeaderContainer>
                                </Header>
                                <EditFiltersModal>
                                    <Button
                                        size="md"
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
                    <div className="sticky top-20 order-1 hidden opacity-60 transition-opacity hover:opacity-100 lg:order-2 lg:block">
                        <Filters />
                    </div>
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default EditListPage;
