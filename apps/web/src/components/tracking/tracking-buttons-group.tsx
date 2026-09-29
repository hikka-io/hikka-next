import type * as React from 'react';
import {
    createElement,
    type FC,
    type ReactElement,
    type ReactNode,
    useState,
} from 'react';

import {
    type AnimeResponse,
    type AnimeResponseWithWatch,
    ContentTypeEnum,
    type MangaResponse,
    type MangaResponseWithRead,
    type NovelResponse,
    type NovelResponseWithRead,
    type ReadArgs,
    type ReadResponseBase,
    ReadStatusEnum,
    type WatchArgs,
    type WatchResponseBase,
    WatchStatusEnum,
} from '@hikka/api';

import {
    READ_STATUS_ICONS,
    WATCH_STATUS_ICONS,
} from '@/components/icons/list-status-icons';
import MaterialSymbolsArrowDropDownRounded from '@/components/icons/material-symbols/MaterialSymbolsArrowDropDownRounded';
import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import { Button } from '@/components/ui/button';
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
    carryOverReadArgs,
    carryOverWatchArgs,
} from '@/utils/api/tracking-args';
import { resolveTrackingEntry } from '@/utils/api/tracking-entry';

import ListEntryEditDialog from './list-entry-edit-dialog';
import {
    READ_STATUS_OPTIONS,
    type StatusOption,
    WATCH_STATUS_OPTIONS,
} from './status-options';
import StatusTrigger from './status-trigger';
import { useAddRead, useAddWatch } from './use-tracking-mutations';

/** `default` keeps the Button primitive's own height; `sm`/`md` shrink it. */
type TrackingSize = 'sm' | 'md' | 'default';

/**
 * `watch`/`read` win over the array embedded in `item`: responses that nest the
 * content inside a list entry (userlist) carry the tracking on the entry, not
 * on the content. `undefined` means "not supplied", `null` means "untracked".
 */
type Props = { size?: TrackingSize } & (
    | {
          type: typeof ContentTypeEnum.ANIME;
          item: AnimeResponse | AnimeResponseWithWatch;
          watch?: WatchResponseBase | null;
      }
    | {
          type: typeof ContentTypeEnum.MANGA;
          item: MangaResponse | MangaResponseWithRead;
          read?: ReadResponseBase | null;
      }
    | {
          type: typeof ContentTypeEnum.NOVEL;
          item: NovelResponse | NovelResponseWithRead;
          read?: ReadResponseBase | null;
      }
);

type StatusIcon = (props: { className?: string }) => ReactElement;

const buildWatchArgs = (
    item: AnimeResponse | AnimeResponseWithWatch,
    watch: WatchResponseBase | undefined,
    status: string,
): WatchArgs => {
    const current = carryOverWatchArgs(watch);

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
    item:
        | MangaResponse
        | NovelResponse
        | MangaResponseWithRead
        | NovelResponseWithRead,
    read: ReadResponseBase | undefined,
    status: string,
): ReadArgs => {
    const current = carryOverReadArgs(read);

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
    size: TrackingSize;
    disabled: boolean;
    currentStatus: string[];
    statusOptions: StatusOption[];
    plannedIcon: StatusIcon;
    hasTracking: boolean;
    trigger: ReactNode;
    modal: ReactNode;
    onValueChange: (options: string[]) => void;
    onAddPlanned: (e: React.MouseEvent | React.TouchEvent) => void;
};

/**
 * Presentational shell shared by the watch and read variants: the status
 * `Select` and the "add to planned" split button.
 */
function TrackingSelect({
    size,
    disabled,
    currentStatus,
    statusOptions,
    plannedIcon,
    hasTracking,
    trigger,
    modal,
    onValueChange,
    onAddPlanned,
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
                                size={size}
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
                                size={
                                    size === 'default' ? 'icon' : `icon-${size}`
                                }
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
            {modal}
        </>
    );
}

function WatchTrackingButtons({
    size,
    item,
    watch,
}: {
    size: TrackingSize;
    item: AnimeResponse | AnimeResponseWithWatch;
    watch?: WatchResponseBase | null;
}) {
    const [editOpen, setEditOpen] = useState(false);

    const { mutate: addWatch, isPending } = useAddWatch({
        awaitInvalidation: true,
    });

    const tracking =
        resolveTrackingEntry(
            watch,
            'watch' in item ? item.watch?.[0] : undefined,
        ) ?? undefined;

    const handleChangeStatus = (options: string[]) => {
        const selected = options[0];

        if (selected === 'settings') {
            setEditOpen(true);
            return;
        }

        addWatch({
            path: { slug: item.slug },
            body: buildWatchArgs(item, tracking, selected),
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
            size={size}
            disabled={isPending}
            currentStatus={tracking ? [tracking.status] : []}
            statusOptions={WATCH_STATUS_OPTIONS}
            plannedIcon={WATCH_STATUS_ICONS[WatchStatusEnum.PLANNED]}
            hasTracking={Boolean(tracking)}
            trigger={
                tracking && (
                    <StatusTrigger
                        contentType={ContentTypeEnum.ANIME}
                        entry={tracking}
                        size={size === 'default' ? undefined : size}
                        isLoading={isPending}
                        onOpenModal={() => setEditOpen(true)}
                    />
                )
            }
            onValueChange={handleChangeStatus}
            onAddPlanned={handleAddToPlanned}
            modal={
                <ListEntryEditDialog
                    open={editOpen}
                    onOpenChange={setEditOpen}
                    content={item}
                    slug={item.slug}
                    contentType={ContentTypeEnum.ANIME}
                    watch={tracking}
                />
            }
        />
    );
}

function ReadTrackingButtons({
    size,
    type,
    item,
    read,
}: {
    size: TrackingSize;
    type: typeof ContentTypeEnum.MANGA | typeof ContentTypeEnum.NOVEL;
    item:
        | MangaResponse
        | NovelResponse
        | MangaResponseWithRead
        | NovelResponseWithRead;
    read?: ReadResponseBase | null;
}) {
    const [editOpen, setEditOpen] = useState(false);

    const { mutate: addRead, isPending } = useAddRead({
        awaitInvalidation: true,
    });

    const tracking =
        resolveTrackingEntry(
            read,
            'read' in item ? item.read?.[0] : undefined,
        ) ?? undefined;

    const handleChangeStatus = (options: string[]) => {
        const selected = options[0];

        if (selected === 'settings') {
            setEditOpen(true);
            return;
        }

        addRead({
            path: { content_type: type, slug: item.slug },
            body: buildReadArgs(item, tracking, selected),
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
            size={size}
            disabled={isPending}
            currentStatus={tracking ? [tracking.status] : []}
            statusOptions={READ_STATUS_OPTIONS}
            plannedIcon={READ_STATUS_ICONS[ReadStatusEnum.PLANNED]}
            hasTracking={Boolean(tracking)}
            trigger={
                tracking && (
                    <StatusTrigger
                        contentType={type}
                        entry={tracking}
                        size={size === 'default' ? undefined : size}
                        isLoading={isPending}
                        onOpenModal={() => setEditOpen(true)}
                    />
                )
            }
            onValueChange={handleChangeStatus}
            onAddPlanned={handleAddToPlanned}
            modal={
                <ListEntryEditDialog
                    open={editOpen}
                    onOpenChange={setEditOpen}
                    content={item}
                    slug={item.slug}
                    contentType={type}
                    read={tracking}
                />
            }
        />
    );
}

const TrackingButtonsGroup: FC<Props> = (props) => {
    const size = props.size ?? 'md';

    if (props.type === ContentTypeEnum.ANIME) {
        return (
            <WatchTrackingButtons
                size={size}
                item={props.item}
                watch={props.watch}
            />
        );
    }

    return (
        <ReadTrackingButtons
            size={size}
            type={props.type}
            item={props.item}
            read={props.read}
        />
    );
};

export default TrackingButtonsGroup;
