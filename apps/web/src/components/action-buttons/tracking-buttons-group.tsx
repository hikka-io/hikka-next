import type * as React from 'react';
import { createElement, useCallback, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    type AnimeResponseWithWatch,
    type MangaResponseWithRead,
    type NovelResponseWithRead,
    type ReadArgs,
    type ReadContentTypeEnum,
    type ReadResponseBase,
    ReadStatusEnum,
    readAddMutation,
    type WatchArgs,
    type WatchResponseBase,
    WatchStatusEnum,
    watchAddMutation,
} from '@hikka/api';

import MaterialSymbolsArrowDropDownRounded from '@/components/icons/material-symbols/MaterialSymbolsArrowDropDownRounded';
import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalHeader,
    ResponsiveModalTitle,
} from '@/components/ui/responsive-modal';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectSeparator,
    SelectTrigger,
} from '@/components/ui/select';
import Spinner from '@/components/ui/spinner';
import {
    applyReadMutation,
    applyWatchMutation,
} from '@/utils/api/invalidate-content-state';
import { cn } from '@/utils/cn';
import { READ_STATUS, WATCH_STATUS } from '@/utils/constants/common';

import ReadEditModal from './read-edit-modal';
import ReadStatusTrigger from './readlist-button/components/read-status-trigger';
import WatchEditModal from './watch-edit-modal';
import WatchStatusTrigger from './watchlist-button/components/watch-status-trigger';

type Props = { title: string } & (
    | { type: 'anime'; item: AnimeResponseWithWatch }
    | { type: 'manga'; item: MangaResponseWithRead }
    | { type: 'novel'; item: NovelResponseWithRead }
);

type StatusConfig = typeof WATCH_STATUS | typeof READ_STATUS;

const buildStatusOptions = (config: StatusConfig) =>
    Object.keys(config).map((status) => ({
        value: status,
        title: config[status as keyof StatusConfig].title_ua,
        label: (
            <div className="flex items-center gap-2">
                <div
                    className={cn(
                        'w-fit rounded-sm border p-1',
                        `bg-${status} text-${status}-foreground border-${status}-border`,
                    )}
                >
                    {createElement(config[status as keyof StatusConfig].icon!, {
                        className: 'size-3!',
                    })}
                </div>
                {config[status as keyof StatusConfig].title_ua}
            </div>
        ),
    }));

const WATCH_STATUS_OPTIONS = buildStatusOptions(WATCH_STATUS);
const READ_STATUS_OPTIONS = buildStatusOptions(READ_STATUS);

export function TrackingButtonsGroup(props: Props) {
    const { type, title } = props;

    if (!type) {
        throw new Error(
            'Props "type" is required for TrackingButtonsGroup component',
        );
    }

    const isAnime = type === 'anime';

    const [editOpen, setEditOpen] = useState(false);
    const queryClient = useQueryClient();

    const slug = props.item.slug;
    const tracking =
        props.type === 'anime' ? props.item.watch?.[0] : props.item.read?.[0];

    // Both hooks are declared unconditionally (rules of hooks); only the one
    // matching `type` is ever invoked.
    const { mutate: addWatch, isPending: watchPending } = useMutation({
        ...watchAddMutation(),
        onSuccess: (data) => {
            applyWatchMutation(queryClient, data);
        },
    });

    const { mutate: addRead, isPending: readPending } = useMutation({
        ...readAddMutation(),
        onSuccess: (data) => {
            applyReadMutation(queryClient, data);
        },
    });

    const isChangingStatus = isAnime ? watchPending : readPending;
    const statusOptions = isAnime ? WATCH_STATUS_OPTIONS : READ_STATUS_OPTIONS;
    const plannedIcon = isAnime
        ? WATCH_STATUS[WatchStatusEnum.PLANNED].icon!
        : READ_STATUS[ReadStatusEnum.PLANNED].icon!;

    const currentStatus = tracking ? [tracking.status] : [];

    const handleChangeStatus = useCallback(
        (options: string[]) => {
            const selectedOption = options[0];

            if (selectedOption === 'settings') {
                setEditOpen(true);
                return;
            }

            if (props.type === 'anime') {
                const watch = props.item.watch?.[0];
                const currentWatchParams = watch
                    ? {
                          episodes: watch.episodes || undefined,
                          score: watch.score || undefined,
                          note: watch.note || undefined,
                          rewatches: watch.rewatches || undefined,
                      }
                    : {};

                const watchArgs: WatchArgs =
                    selectedOption === 'completed'
                        ? {
                              status: WatchStatusEnum.COMPLETED,
                              ...currentWatchParams,
                              episodes: props.item.episodes_total || undefined,
                          }
                        : {
                              status: selectedOption as WatchStatusEnum,
                              ...currentWatchParams,
                          };

                addWatch({ path: { slug: props.item.slug }, body: watchArgs });
                return;
            } else {
                const read = props.item.read?.[0];
                const currentReadParams = read
                    ? {
                          chapters: read.chapters || undefined,
                          volumes: read.volumes || undefined,
                          score: read.score || undefined,
                          note: read.note || undefined,
                          rereads: read.rereads || undefined,
                      }
                    : {};

                const readArgs: ReadArgs =
                    selectedOption === 'completed'
                        ? {
                              status: ReadStatusEnum.COMPLETED,
                              ...currentReadParams,
                              volumes: props.item.volumes || undefined,
                              chapters: props.item.chapters || undefined,
                          }
                        : {
                              status: selectedOption as ReadStatusEnum,
                              ...currentReadParams,
                          };

                addRead({
                    path: { content_type: props.type, slug: props.item.slug },
                    body: readArgs,
                });

                return;
            }
        },
        [props, addWatch, addRead],
    );

    const handleAddToPlanned = useCallback(
        (e: React.MouseEvent | React.TouchEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (props.type === 'anime') {
                addWatch({
                    path: { slug: props.item.slug },
                    body: { status: WatchStatusEnum.PLANNED },
                });
                return;
            }

            addRead({
                path: { content_type: props.type, slug: props.item.slug },
                body: { status: ReadStatusEnum.PLANNED },
            });
        },
        [props, addWatch, addRead],
    );

    return (
        <>
            <Select
                disabled={isChangingStatus}
                value={currentStatus}
                onValueChange={handleChangeStatus}
            >
                {tracking ? (
                    isAnime ? (
                        <WatchStatusTrigger
                            watch={tracking as WatchResponseBase}
                            size="md"
                            isLoading={isChangingStatus}
                            onOpenModal={() => setEditOpen(true)}
                        />
                    ) : (
                        <ReadStatusTrigger
                            read={tracking as ReadResponseBase}
                            size="md"
                            isLoading={isChangingStatus}
                            onOpenModal={() => setEditOpen(true)}
                        />
                    )
                ) : (
                    <SelectTrigger
                        asChild
                        className="gap-0 border-none p-0"
                        onSelect={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <div className="flex w-full">
                            <Button
                                variant="secondary"
                                size="md"
                                disabled={isChangingStatus}
                                onClick={handleAddToPlanned}
                                className={cn(
                                    'flex-1 flex-nowrap overflow-hidden rounded-r-none',
                                )}
                            >
                                {isChangingStatus ? (
                                    <Spinner />
                                ) : (
                                    <div className="rounded-sm border border-secondary-foreground/20 p-1">
                                        {createElement(plannedIcon, {
                                            className: 'size-3!',
                                        })}
                                    </div>
                                )}
                                <span className="truncate rounded-none">
                                    Додати у список
                                </span>
                            </Button>
                            <Button
                                variant="secondary"
                                size="icon-md"
                                type="button"
                                disabled={isChangingStatus}
                                className={cn('rounded-l-none text-xl')}
                            >
                                <MaterialSymbolsArrowDropDownRounded />
                            </Button>
                        </div>
                    </SelectTrigger>
                )}

                <SelectContent>
                    <SelectList>
                        <SelectGroup>
                            {statusOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                        {tracking && (
                            <>
                                <SelectSeparator />
                                <SelectGroup>
                                    <SelectItem
                                        disableCheckbox
                                        value="settings"
                                    >
                                        <div className="flex items-center gap-2">
                                            <MaterialSymbolsSettingsOutlineRounded />
                                            Налаштування
                                        </div>
                                    </SelectItem>
                                </SelectGroup>
                            </>
                        )}
                    </SelectList>
                </SelectContent>
            </Select>
            <ResponsiveModal
                open={editOpen}
                onOpenChange={setEditOpen}
                forceDesktop
            >
                <ResponsiveModalContent className="md:max-w-xl">
                    <ResponsiveModalHeader>
                        <ResponsiveModalTitle>{title}</ResponsiveModalTitle>
                    </ResponsiveModalHeader>
                    {isAnime ? (
                        <WatchEditModal
                            slug={slug}
                            watch={tracking as WatchResponseBase | undefined}
                            onClose={() => setEditOpen(false)}
                        />
                    ) : (
                        <ReadEditModal
                            slug={slug}
                            content_type={type as ReadContentTypeEnum}
                            read={tracking as ReadResponseBase | undefined}
                            onClose={() => setEditOpen(false)}
                        />
                    )}
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
}
