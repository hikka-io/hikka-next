import { createElement, type FC } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';

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
import { LIST_STATUS_ICONS } from '@/components/icons/list-status-icons';
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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { ViewToggle } from '@/features/catalog';
import {
    FiltersButton,
    FiltersSidebarToggle,
    Sort,
    useChangeParam,
} from '@/features/filters';
import { cn } from '@/utils/cn';
import { CONTENT_TYPES, LIST_STATUS } from '@/utils/labels';
import { useParams, useRouteSearch } from '@/utils/navigation';
import type { UserlistSearch } from '@/utils/search-schemas';

import UserListFiltersModal from './user-list-filters-modal';

const STATUSES = { ...LIST_STATUS.watch, ...LIST_STATUS.read };
const STATUS_ICONS = { ...LIST_STATUS_ICONS.watch, ...LIST_STATUS_ICONS.read };

type Props = {
    content_type: MainContentTypeEnum;
};

const UserListNavbar: FC<Props> = ({ content_type }) => {
    const isAnime = content_type === ContentTypeEnum.ANIME;
    const router = useRouter();
    const queryClient = useQueryClient();
    const params = useParams();
    const search = useRouteSearch<Pick<UserlistSearch, 'status'>>();
    const handleChangeParam = useChangeParam();

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
    const statuses = LIST_STATUS[isAnime ? 'watch' : 'read'];
    const randomLabel = `${content_type === ContentTypeEnum.MANGA ? 'Випадкова' : 'Випадкове'} ${CONTENT_TYPES[content_type].title_ua.toLowerCase()}`;

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

    return (
        <>
            <div className="surface -mx-4 flex flex-col gap-4 rounded-none border border-x-0 p-4 md:mx-0 md:flex-row md:items-center md:rounded-md md:border-x">
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
                                                            STATUS_ICONS[key],
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
                    <ViewToggle viewKey="userlist" views={['table', 'grid']} />
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
                            <TooltipTrigger
                                render={
                                    <Button
                                        variant="outline"
                                        size="icon-md"
                                        onClick={handleRandom}
                                        aria-label={randomLabel}
                                    />
                                }
                            >
                                <FeRandom className="size-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{randomLabel}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <Separator orientation="vertical" className="h-6" />

                    <FiltersButton
                        className="lg:hidden"
                        renderModal={(props) => (
                            <UserListFiltersModal
                                content_type={content_type}
                                {...props}
                            />
                        )}
                    />

                    <FiltersSidebarToggle storageKey="userlist_filters_sidebar" />
                </div>
            </div>
        </>
    );
};

export default UserListNavbar;
