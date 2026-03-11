import { EditContentType, EditStatusEnum } from '@hikka/client';
import { prefetchInfiniteQuery } from '@hikka/react/core';
import { editListOptions, topEditorsListOptions } from '@hikka/react/options';
import { zodValidator } from '@tanstack/zod-adapter';
import { createFileRoute, redirect } from '@tanstack/react-router';

import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import {
    EditFiltersModal,
    EditList,
    EditTopStats,
    EditFilters as Filters,
} from '@/features/edit';
import { generateHeadMeta } from '@/utils/metadata';
import { editSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/edit/')({
    validateSearch: zodValidator(editSearchSchema),
    loaderDeps: ({ search }) => search,
    loader: async ({ context: { queryClient, hikkaClient }, deps }) => {
        const {
            page,
            content_type,
            order = 'desc',
            sort = 'edit_id',
            edit_status,
        } = deps;

        if (!page) {
            throw redirect({
                to: '/edit',
                search: { ...deps, page: 1 },
            });
        }

        await Promise.allSettled([
            prefetchInfiniteQuery(
                queryClient,
                editListOptions(hikkaClient, {
                    args: {
                        content_type:
                            (content_type as EditContentType) || undefined,
                        sort: [`${sort}:${order}`],
                        status: edit_status
                            ? (edit_status as EditStatusEnum)
                            : undefined,
                    },
                    paginationArgs: { page: Number(page) },
                }),
            ),
            prefetchInfiniteQuery(
                queryClient,
                topEditorsListOptions(hikkaClient),
            ),
        ]);
    },
    head: () =>
        generateHeadMeta({
            title: 'Правки',
            description: 'Система правок спільноти Hikka',
            url: 'https://hikka.io/edit',
        }),
    component: EditListPage,
});

function EditListPage() {
    return (
        <div className="flex flex-col gap-12 lg:gap-12">
            <EditTopStats />
            <div className="grid grid-cols-1 justify-center gap-8 lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-12">
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
                        <EditList />
                    </Block>
                </div>
                <div className="sticky top-20 order-1 hidden w-full max-h-[calc(100vh-9rem)] rounded-lg border border-border bg-secondary/20 backdrop-blur-xl overflow-hidden lg:order-2 lg:flex">
                    <Filters />
                </div>
            </div>
        </div>
    );
}
