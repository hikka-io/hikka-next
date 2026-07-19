import type * as React from 'react';
import {
    createElement,
    type ReactElement,
    type ReactNode,
    useState,
} from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    type AnimeCatalogResponse,
    ContentTypeEnum,
    type MangaCatalogResponse,
    type NovelCatalogResponse,
    type ReadArgs,
    ReadStatusEnum,
    readAddMutation,
    type WatchArgs,
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

type Props =
    | {
          title: string;
          type: typeof ContentTypeEnum.ANIME;
          item: AnimeCatalogResponse;
      }
    | {
          title: string;
          type: typeof ContentTypeEnum.MANGA;
          item: MangaCatalogResponse;
      }
    | {
          title: string;
          type: typeof ContentTypeEnum.NOVEL;
          item: NovelCatalogResponse;
      };

type StatusConfig = typeof WATCH_STATUS | typeof READ_STATUS;
type StatusIcon = (props: { className?: string }) => ReactElement;

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

type StatusOption = ReturnType<typeof buildStatusOptions>[number];

const WATCH_STATUS_OPTIONS = buildStatusOptions(WATCH_STATUS);
const READ_STATUS_OPTIONS = buildStatusOptions(READ_STATUS);

const buildWatchArgs = (
    item: AnimeCatalogResponse,
    status: string,
): WatchArgs => {
    const watch = item.watch?.[0];
    const current = watch
        ? {
              episodes: watch.episodes || undefined,
              score: watch.score || undefined,
              note: watch.note || undefined,
              rewatches: watch.rewatches || undefined,
          }
        : {};

    if (status === WatchStatusEnum.COMPLETED) {
        return {
            status: WatchStatusEnum.COMPLETED,
            ...current,
            episodes: item.episodes_total || undefined,
        };
    }

    return { status: status as WatchStatusEnum, ...current };
};

const buildReadArgs = (
    item: MangaCatalogResponse | NovelCatalogResponse,
    status: string,
): ReadArgs => {
    const read = item.read?.[0];
    const current = read
        ? {
              chapters: read.chapters || undefined,
              volumes: read.volumes || undefined,
              score: read.score || undefined,
              note: read.note || undefined,
              rereads: read.rereads || undefined,
          }
        : {};

    if (status === ReadStatusEnum.COMPLETED) {
        return {
            status: ReadStatusEnum.COMPLETED,
            ...current,
            volumes: item.volumes || undefined,
            chapters: item.chapters || undefined,
        };
    }

    return { status: status as ReadStatusEnum, ...current };
};

type TrackingSelectProps = {
    title: string;
    disabled: boolean;
    currentStatus: string[];
    statusOptions: StatusOption[];
    plannedIcon: StatusIcon;
    hasTracking: boolean;
    trigger: ReactNode;
    editOpen: boolean;
    modal: ReactNode;
    onValueChange: (options: string[]) => void;
    onAddPlanned: (e: React.MouseEvent | React.TouchEvent) => void;
    onEditOpenChange: (open: boolean) => void;
};

/**
 * Presentational shell shared by the watch and read variants: the status
 * `Select`, the "add to planned" split button, and the edit modal frame.
 */
function TrackingSelect({
    title,
    disabled,
    currentStatus,
    statusOptions,
    plannedIcon,
    hasTracking,
    trigger,
    editOpen,
    modal,
    onValueChange,
    onAddPlanned,
    onEditOpenChange,
}: TrackingSelectProps) {
    return (
        <>
            <Select
                disabled={disabled}
                value={currentStatus}
                onValueChange={onValueChange}
            >
                {hasTracking ? (
                    trigger
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
                                disabled={disabled}
                                onClick={onAddPlanned}
                                className="flex-1 flex-nowrap overflow-hidden rounded-r-none"
                            >
                                {disabled ? (
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
                                disabled={disabled}
                                className="rounded-l-none text-xl"
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
                        {hasTracking && (
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
                onOpenChange={onEditOpenChange}
                forceDesktop
            >
                <ResponsiveModalContent className="md:max-w-xl">
                    <ResponsiveModalHeader>
                        <ResponsiveModalTitle>{title}</ResponsiveModalTitle>
                    </ResponsiveModalHeader>
                    {modal}
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
}

function WatchTrackingButtons({
    title,
    item,
}: {
    title: string;
    item: AnimeCatalogResponse;
}) {
    const queryClient = useQueryClient();
    const [editOpen, setEditOpen] = useState(false);

    const { mutate: addWatch, isPending } = useMutation({
        ...watchAddMutation(),
        onSuccess: (data) => applyWatchMutation(queryClient, data),
    });

    const tracking = item.watch?.[0];

    const handleChangeStatus = (options: string[]) => {
        const selected = options[0];

        if (selected === 'settings') {
            setEditOpen(true);
            return;
        }

        addWatch({
            path: { slug: item.slug },
            body: buildWatchArgs(item, selected),
        });
    };

    const handleAddToPlanned = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addWatch({
            path: { slug: item.slug },
            body: { status: WatchStatusEnum.PLANNED },
        });
    };

    return (
        <TrackingSelect
            title={title}
            disabled={isPending}
            currentStatus={tracking ? [tracking.status] : []}
            statusOptions={WATCH_STATUS_OPTIONS}
            plannedIcon={WATCH_STATUS[WatchStatusEnum.PLANNED].icon!}
            hasTracking={Boolean(tracking)}
            trigger={
                tracking && (
                    <WatchStatusTrigger
                        watch={tracking}
                        size="md"
                        isLoading={isPending}
                        onOpenModal={() => setEditOpen(true)}
                    />
                )
            }
            editOpen={editOpen}
            onValueChange={handleChangeStatus}
            onAddPlanned={handleAddToPlanned}
            onEditOpenChange={setEditOpen}
            modal={
                <WatchEditModal
                    slug={item.slug}
                    watch={tracking}
                    onClose={() => setEditOpen(false)}
                />
            }
        />
    );
}

function ReadTrackingButtons({
    title,
    type,
    item,
}: {
    title: string;
    type: typeof ContentTypeEnum.MANGA | typeof ContentTypeEnum.NOVEL;
    item: MangaCatalogResponse | NovelCatalogResponse;
}) {
    const queryClient = useQueryClient();
    const [editOpen, setEditOpen] = useState(false);

    const { mutate: addRead, isPending } = useMutation({
        ...readAddMutation(),
        onSuccess: (data) => applyReadMutation(queryClient, data),
    });

    const tracking = item.read?.[0];

    const handleChangeStatus = (options: string[]) => {
        const selected = options[0];

        if (selected === 'settings') {
            setEditOpen(true);
            return;
        }

        addRead({
            path: { content_type: type, slug: item.slug },
            body: buildReadArgs(item, selected),
        });
    };

    const handleAddToPlanned = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addRead({
            path: { content_type: type, slug: item.slug },
            body: { status: ReadStatusEnum.PLANNED },
        });
    };

    return (
        <TrackingSelect
            title={title}
            disabled={isPending}
            currentStatus={tracking ? [tracking.status] : []}
            statusOptions={READ_STATUS_OPTIONS}
            plannedIcon={READ_STATUS[ReadStatusEnum.PLANNED].icon!}
            hasTracking={Boolean(tracking)}
            trigger={
                tracking && (
                    <ReadStatusTrigger
                        read={tracking}
                        size="md"
                        isLoading={isPending}
                        onOpenModal={() => setEditOpen(true)}
                    />
                )
            }
            editOpen={editOpen}
            onValueChange={handleChangeStatus}
            onAddPlanned={handleAddToPlanned}
            onEditOpenChange={setEditOpen}
            modal={
                <ReadEditModal
                    slug={item.slug}
                    content_type={type}
                    read={tracking}
                    onClose={() => setEditOpen(false)}
                />
            }
        />
    );
}

export function TrackingButtonsGroup(props: Props) {
    if (props.type === ContentTypeEnum.ANIME) {
        return <WatchTrackingButtons title={props.title} item={props.item} />;
    }

    return (
        <ReadTrackingButtons
            title={props.title}
            type={props.type}
            item={props.item}
        />
    );
}
