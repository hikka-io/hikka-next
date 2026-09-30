import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { usePageHeader, usePageTitleAnchor } from '@/features/app-shell';
import { FiltersModal } from '@/features/filters';
import {
    ScheduleFilters,
    ScheduleFiltersBody,
    ScheduleList,
} from '@/features/schedule';
import { scheduleOptions } from '@/features/schedule/queries';
import { generateHeadMeta } from '@/utils/metadata';
import { scheduleSearchSchema } from '@/utils/search-schemas';
import { SITE_ORIGIN } from '@/utils/url';

export const Route = createFileRoute('/_pages/schedule')({
    validateSearch: zodValidator(scheduleSearchSchema),
    loaderDeps: ({ search }) => search,
    loader: async ({ context: { queryClient, apiClient }, deps }) => {
        await queryClient.prefetchInfiniteQuery(
            scheduleOptions(deps, apiClient),
        );
    },
    head: () =>
        generateHeadMeta({
            title: 'Календар',
            description: 'Календар виходу нових серій аніме на Hikka',
            url: `${SITE_ORIGIN}/schedule`,
        }),
    component: ScheduleListPage,
});

function ScheduleListPage() {
    const titleAnchor = usePageTitleAnchor();

    usePageHeader({ title: 'Календар', parent: '/', anchored: true });

    return (
        <div className="flex flex-col gap-12">
            <Block>
                <div className="flex items-center justify-between">
                    <Header>
                        <HeaderContainer>
                            <HeaderTitle ref={titleAnchor} variant="h2">
                                Календар
                            </HeaderTitle>
                        </HeaderContainer>
                    </Header>
                    <FiltersModal
                        body={
                            <ScheduleFiltersBody className="-m-4 flex-1 overflow-y-auto p-4" />
                        }
                    >
                        <Button
                            size="md"
                            variant="outline"
                            className="flex lg:hidden"
                        >
                            <AntDesignFilterFilled /> Фільтри
                        </Button>
                    </FiltersModal>
                </div>
                <Card className="hidden w-full lg:block">
                    <ScheduleFilters />
                </Card>
            </Block>
            <ScheduleList />
        </div>
    );
}
