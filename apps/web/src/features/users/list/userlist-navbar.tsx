import { type ComponentProps, createElement, type FC, useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { Filter, PanelRightClose, PanelRightOpen } from 'lucide-react';

import {
    ContentTypeEnum,
    type MainContentTypeEnum,
    type ReadContentTypeEnum,
    type AppReadSchemasReadStatsResponse as ReadStatsResponse,
    type ReadStatusEnum,
    randomReadNovelOptions,
    randomWatchEntryOptions,
    userReadStatsOptions,
    userWatchStatsOptions,
    type WatchStatsResponse,
    type WatchStatusEnum,
} from '@hikka/api';

import FeRandom from '@/components/icons/fe/FeRandom';
import MaterialSymbolsEventList from '@/components/icons/material-symbols/MaterialSymbolsEventList';
import { MaterialSymbolsGridViewRounded } from '@/components/icons/material-symbols/MaterialSymbolsGridViewRounded';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    AnimeFiltersModal,
    ReadFiltersModal,
    useActiveFilters,
} from '@/features/filters';
import { useCatalogView } from '@/features/filters/hooks/use-catalog-view';
import useChangeParam from '@/features/filters/hooks/use-change-param';
import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';
import { useFiltersSidebar } from '@/features/filters/hooks/use-filters-sidebar';
import Sort from '@/features/filters/sort';
import { cn } from '@/utils/cn';
import {
    CONTENT_TYPES,
    READ_STATUS,
    WATCH_STATUS,
} from '@/utils/constants/common';
import { useParams } from '@/utils/navigation';

const STATUSES = { ...WATCH_STATUS, ...READ_STATUS };

type Props = {
    content_type: MainContentTypeEnum;
};

const UserlistNavbar: FC<Props> = ({ content_type }) => {
    const isAnime = content_type === ContentTypeEnum.ANIME;
    const router = useRouter();
    const queryClient = useQueryClient();
    const params = useParams();
    const search = useFilterSearch<{ status?: string }>();
    const handleChangeParam = useChangeParam();
    const { visible: sidebarVisible, toggle: toggleSidebar } =
        useFiltersSidebar('userlist_filters_sidebar');
    const { count: activeCount } = useActiveFilters();
    const { view, setView } = useCatalogView('userlist');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const status = (search.status || 'completed') as
        | ReadStatusEnum
        | WatchStatusEnum
        | 'all';

    const { data: watchData } = useQuery({
        ...userWatchStatsOptions({
            path: { username: String(params.username) },
        }),
        enabled: isAnime,
    });
    const { data: readData } = useQuery({
        ...userReadStatsOptions({
            path: {
                username: String(params.username),
                content_type: content_type as ReadContentTypeEnum,
            },
        }),
        enabled: !isAnime,
    });
    const listData = isAnime ? watchData : readData;
    const statuses = isAnime ? WATCH_STATUS : READ_STATUS;

    const allAmount = listData
        ? listData.completed +
          listData.dropped +
          listData.on_hold +
          listData.planned +
          (isAnime
              ? (listData as WatchStatsResponse).watching
              : (listData as ReadStatsResponse).reading)
        : undefined;

    const handleRandom = async () => {
        const data = isAnime
            ? await queryClient.fetchQuery({
                  ...randomWatchEntryOptions({
                      path: {
                          username: String(params.username),
                          status: status as WatchStatusEnum,
                      },
                  }),
                  staleTime: 0,
              })
            : await queryClient.fetchQuery({
                  ...randomReadNovelOptions({
                      path: {
                          username: String(params.username),
                          content_type: content_type as ReadContentTypeEnum,
                          status: status as ReadStatusEnum,
                      },
                  }),
                  staleTime: 0,
              });

        router.navigate({
            to: `/${content_type}/${data.slug}` as '/',
        });
    };

    const handleChangeView = (value: string) => {
        if (!value) return;
        setView(value as Hikka.View);
    };

    return (
        <>
            <div className="flex flex-col gap-4 rounded-md border surface p-4 md:flex-row md:items-center">
                <div className="flex flex-1 items-center gap-4">
                    <Select
                        value={[status]}
                        onValueChange={(value) =>
                            handleChangeParam('status', value[0])
                        }
                    >
                        <SelectTrigger size="md" className="flex-1">
                            <SelectValue placeholder="Статус" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectList>
                                <SelectGroup>
                                    <SelectItem value="all">
                                        <span className="flex items-center gap-2">
                                            Усе
                                            {allAmount !== undefined && (
                                                <span className="text-muted-foreground">
                                                    ({allAmount})
                                                </span>
                                            )}
                                        </span>
                                    </SelectItem>
                                    {(
                                        Object.keys(statuses) as (
                                            | ReadStatusEnum
                                            | WatchStatusEnum
                                        )[]
                                    ).map((key) => {
                                        const info = STATUSES[key];
                                        const count = listData
                                            ? (
                                                  listData as Record<
                                                      string,
                                                      number | undefined
                                                  >
                                              )[key]
                                            : undefined;
                                        return (
                                            <SelectItem key={key} value={key}>
                                                <span className="flex items-center gap-2">
                                                    <span
                                                        className={cn(
                                                            'rounded-sm border p-0.5',
                                                            `bg-${key} text-${key}-foreground border-${key}-border`,
                                                        )}
                                                    >
                                                        {createElement(
                                                            info.icon!,
                                                            {
                                                                className:
                                                                    'size-3',
                                                            },
                                                        )}
                                                    </span>
                                                    {info.title_ua}
                                                    {count !== undefined && (
                                                        <span className="text-muted-foreground">
                                                            ({count})
                                                        </span>
                                                    )}
                                                </span>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectList>
                        </SelectContent>
                    </Select>
                    <Separator
                        orientation="vertical"
                        className="hidden h-6 md:block"
                    />
                    <ToggleGroup
                        variant="outline"
                        value={view}
                        type="single"
                        onValueChange={handleChangeView}
                    >
                        <ToggleGroupItem value="table" aria-label="Таблиця">
                            <MaterialSymbolsEventList />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="grid" aria-label="Сітка">
                            <MaterialSymbolsGridViewRounded />
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-1 items-center gap-4">
                        <Sort
                            sort_type={isAnime ? 'watch' : 'read'}
                            compact
                            className="min-w-0 flex-1 overflow-hidden md:w-50 md:flex-none"
                            placeholder="Сортування"
                        />

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon-md"
                                    onClick={handleRandom}
                                    aria-label={`Випадкове ${CONTENT_TYPES[content_type].title_ua.toLowerCase()}`}
                                >
                                    <FeRandom className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Випадкове{' '}
                                    {CONTENT_TYPES[
                                        content_type
                                    ].title_ua.toLowerCase()}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <Separator orientation="vertical" className="h-6" />

                    {/* Mobile: open filters in a sheet */}
                    <Button
                        variant="outline"
                        size="icon-md"
                        onClick={() => setMobileFiltersOpen(true)}
                        className="relative shrink-0 overflow-visible lg:hidden"
                        aria-label="Фільтри"
                    >
                        <Filter className="size-4" />
                        {activeCount > 0 && (
                            <Badge
                                variant="default"
                                className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 text-[10px]"
                            >
                                {activeCount}
                            </Badge>
                        )}
                    </Button>

                    {/* Desktop: toggle sticky sidebar panel */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={sidebarVisible ? 'default' : 'outline'}
                                size="icon-md"
                                onClick={toggleSidebar}
                                className="hidden shrink-0 lg:inline-flex"
                                aria-label={
                                    sidebarVisible
                                        ? 'Приховати фільтри'
                                        : 'Показати фільтри'
                                }
                            >
                                {sidebarVisible ? (
                                    <PanelRightClose className="size-4" />
                                ) : (
                                    <PanelRightOpen className="size-4" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                {sidebarVisible
                                    ? 'Приховати панель фільтрів'
                                    : 'Показати панель фільтрів'}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>

            {isAnime ? (
                <AnimeFiltersModal
                    open={mobileFiltersOpen}
                    onOpenChange={setMobileFiltersOpen}
                    sort_type="watch"
                />
            ) : (
                <ReadFiltersModal
                    open={mobileFiltersOpen}
                    onOpenChange={setMobileFiltersOpen}
                    content_type={
                        content_type as ComponentProps<
                            typeof ReadFiltersModal
                        >['content_type']
                    }
                    sort_type="read"
                />
            )}
        </>
    );
};

export default UserlistNavbar;
