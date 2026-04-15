'use client';

import {
    ContentTypeEnum,
    ReadStatsResponse,
    ReadStatusEnum,
    WatchStatsResponse,
    WatchStatusEnum,
} from '@hikka/client';
import {
    useRandomReadByStatus,
    useRandomWatchByStatus,
    useReadStats,
    useUserWatchStats,
} from '@hikka/react';
import { useRouter } from '@tanstack/react-router';
import { Filter, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { FC, createElement, useState } from 'react';

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

import { useActiveFilters } from '@/features/content';
import { useCatalogView } from '@/features/filters/hooks/use-catalog-view';
import useChangeParam from '@/features/filters/hooks/use-change-param';
import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';
import { useFiltersSidebar } from '@/features/filters/hooks/use-filters-sidebar';
import Sort from '@/features/filters/sort';
import { ReadFiltersModal } from '@/features/read';
import { AnimeFiltersModal } from '@/features/watch';

import { cn } from '@/utils/cn';
import {
    CONTENT_TYPES,
    READ_STATUS,
    WATCH_STATUS,
} from '@/utils/constants/common';
import { useParams } from '@/utils/navigation';

const STATUSES = { ...WATCH_STATUS, ...READ_STATUS };

interface Props {
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const UserlistNavbar: FC<Props> = ({ content_type }) => {
    const isAnime = content_type === ContentTypeEnum.ANIME;
    const router = useRouter();
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

    // Status stats
    const { data: watchData } = useUserWatchStats({
        username: params.username,
        options: { enabled: isAnime },
    });
    const { data: readData } = useReadStats({
        username: params.username,
        contentType: content_type as
            | ContentTypeEnum.MANGA
            | ContentTypeEnum.NOVEL,
        options: { enabled: !isAnime },
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

    // Random content
    const mutationRandomRead = useRandomReadByStatus({
        options: {
            onSuccess: (data) => {
                router.navigate({
                    to: `/${content_type}/${data.slug}` as '/',
                });
            },
        },
    });
    const mutationRandomWatch = useRandomWatchByStatus({
        options: {
            onSuccess: (data) => {
                router.navigate({
                    to: `/${content_type}/${data.slug}` as '/',
                });
            },
        },
    });

    const handleRandom = () => {
        if (isAnime) {
            mutationRandomWatch.mutate({
                username: String(params.username),
                status: status as WatchStatusEnum,
            });
        } else {
            mutationRandomRead.mutate({
                contentType: content_type,
                username: String(params.username),
                status: status as ReadStatusEnum,
            });
        }
    };

    const handleChangeView = (value: string) => {
        if (!value) return;
        setView(value as Hikka.View);
    };

    return (
        <>
            <div className="bg-secondary/20 flex flex-col gap-4 rounded-md border p-4 md:flex-row md:items-center">
                <div className="flex flex-1 gap-4 items-center">
                    <Select
                        value={[status]}
                        onValueChange={(value) =>
                            handleChangeParam('status', value[0])
                        }
                    >
                        <SelectTrigger size="md" className=" flex-1">
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
                                                  listData as unknown as Record<
                                                      string,
                                                      number
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
                        className="h-6 hidden md:block"
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
                    <div className="gap-4 items-center flex flex-1">
                        <Sort
                            sort_type={isAnime ? 'watch' : 'read'}
                            compact
                            className="min-w-0 flex-1 overflow-hidden md:flex-none md:w-50"
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
                                <p className="text-sm">
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
                            <p className="text-sm">
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
                    content_type={content_type}
                    sort_type="read"
                />
            )}
        </>
    );
};

export default UserlistNavbar;
