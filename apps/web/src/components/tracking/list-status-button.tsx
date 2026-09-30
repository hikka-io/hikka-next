import { type FC, useCallback, useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
    type AnimeInfoResponse,
    type AnimeResponse,
    ContentTypeEnum,
    type MainContentTypeEnum,
    type MangaInfoResponse,
    type MangaResponse,
    type NovelInfoResponse,
    type NovelResponse,
    type Options,
    type ReadAddData,
    type ReadArgs,
    type ReadContentTypeEnum,
    type ReadResponse,
    type ReadResponseBase,
    type WatchAddData,
    type WatchArgs,
    type WatchResponse,
    type WatchResponseBase,
} from '@hikka/api';

import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import type { ButtonProps } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectSeparator,
} from '@/components/ui/select';
import { listEntryOptions } from '@/utils/api/content-queries';
import {
    carryOverReadArgs,
    carryOverWatchArgs,
    omitUndefined,
} from '@/utils/api/tracking-args';

import IconStatusButton from './icon-status-button';
import ListEntryEditDialog from './list-entry-edit-dialog';
import NewStatusTrigger from './new-status-trigger';
import {
    READ_STATUS_OPTIONS,
    type StatusOption,
    WATCH_STATUS_OPTIONS,
} from './status-options';
import StatusTrigger from './status-trigger';
import { useAddRead, useAddWatch } from './use-tracking-mutations';

type WatchEntry = WatchResponse | WatchResponseBase;
type ReadEntry = ReadResponse | ReadResponseBase;
type WatchContent = AnimeResponse | AnimeInfoResponse;
type ReadContent =
    | MangaResponse
    | NovelResponse
    | MangaInfoResponse
    | NovelInfoResponse;

type Props = {
    slug: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'icon-sm' | 'icon-md';
    buttonProps?: ButtonProps;
} & (
    | {
          contentType: typeof ContentTypeEnum.ANIME;
          entry?: WatchResponseBase | null;
          content?: WatchContent;
      }
    | {
          contentType: ReadContentTypeEnum;
          entry?: ReadResponseBase | null;
          content?: ReadContent;
      }
);

type KindConfig = {
    options: StatusOption[];
    dropsEntryWhenMissing: boolean;
    useEntry(
        slug: string,
        enabled: boolean,
        contentType: MainContentTypeEnum,
    ): { data?: WatchResponse | ReadResponse | null; isError: boolean };
    useAdd(): {
        mutate(variables: Options<WatchAddData> | Options<ReadAddData>): void;
        isPending: boolean;
    };
    carryOver(
        entry: WatchEntry | ReadEntry | undefined,
    ): Partial<WatchArgs> | Partial<ReadArgs>;
    fillCompleted(
        content: WatchContent | ReadContent | undefined,
        entry: WatchEntry | ReadEntry | undefined,
    ): Partial<WatchArgs> | Partial<ReadArgs>;
};

const SETTINGS_BUTTON = {
    label: (
        <div className="flex items-center gap-2">
            <MaterialSymbolsSettingsOutlineRounded />
            Налаштування
        </div>
    ),
    value: 'settings',
    disableCheckbox: true,
    title: 'Налаштування',
};

const useWatchEntry = (slug: string, enabled: boolean) =>
    useQuery({
        ...listEntryOptions(ContentTypeEnum.ANIME, slug),
        retry: false,
        enabled,
    });

const useReadEntry = (
    slug: string,
    enabled: boolean,
    contentType: ReadContentTypeEnum,
) =>
    useQuery({
        ...listEntryOptions(contentType, slug),
        retry: false,
        enabled,
    });

// Keep the hook-named properties: the React Compiler memoizes `MAP[kind]()` as a plain call.
const KINDS: Record<'watch' | 'read', KindConfig> = {
    watch: {
        options: WATCH_STATUS_OPTIONS,
        dropsEntryWhenMissing: false,
        useEntry: useWatchEntry,
        useAdd: useAddWatch,
        carryOver: carryOverWatchArgs,
        fillCompleted: (content: WatchContent | undefined) => ({
            episodes: content?.episodes_total || undefined,
        }),
    },
    read: {
        options: READ_STATUS_OPTIONS,
        dropsEntryWhenMissing: true,
        useEntry: useReadEntry,
        useAdd: useAddRead,
        carryOver: carryOverReadArgs,
        fillCompleted: (
            content: ReadContent | undefined,
            entry: ReadEntry | undefined,
        ) => ({
            volumes: content?.volumes || entry?.volumes || undefined,
            chapters: content?.chapters || entry?.chapters || undefined,
        }),
    },
};

const ListStatusButton: FC<Props> = ({
    slug,
    contentType,
    disabled,
    entry: entryProp,
    content,
    size,
    buttonProps,
}) => {
    const kind = contentType === ContentTypeEnum.ANIME ? 'watch' : 'read';
    const [editOpen, setEditOpen] = useState(false);

    const { data: entryQuery, isError: entryError } = KINDS[kind].useEntry(
        slug,
        !disabled && !entryProp && entryProp !== null,
        contentType,
    );

    const { mutate: addEntry, isPending: isChangingStatus } =
        KINDS[kind].useAdd();

    const entryUnreadable =
        entryProp === undefined && entryQuery === undefined && entryError;
    const blocked = disabled || entryUnreadable;
    const entry = useMemo(
        () => entryProp || entryQuery || undefined,
        [entryProp, entryQuery],
    );
    const trackedEntry =
        KINDS[kind].dropsEntryWhenMissing && entryQuery === null
            ? undefined
            : entry;

    const openEditModal = useCallback(() => {
        if (content) {
            setEditOpen(true);
        }
    }, [content]);

    const handleChangeStatus = useCallback(
        (options: string[]) => {
            const selectedOption = options[0];

            if (selectedOption === 'settings') {
                openEditModal();
                return;
            }

            const body = {
                status: selectedOption,
                ...KINDS[kind].carryOver(trackedEntry),
                ...(selectedOption === 'completed'
                    ? omitUndefined(KINDS[kind].fillCompleted(content, entry))
                    : undefined),
            };

            addEntry(
                contentType === ContentTypeEnum.ANIME
                    ? { path: { slug }, body: body as WatchArgs }
                    : {
                          path: { content_type: contentType, slug },
                          body: body as ReadArgs,
                      },
            );
        },
        [
            kind,
            trackedEntry,
            content,
            entry,
            contentType,
            slug,
            addEntry,
            openEditModal,
        ],
    );

    const currentStatus = trackedEntry ? [trackedEntry.status] : [];
    const trackedProps =
        contentType === ContentTypeEnum.ANIME
            ? { contentType, entry: trackedEntry as WatchEntry }
            : { contentType, entry: trackedEntry as ReadEntry };
    const dialogProps =
        contentType === ContentTypeEnum.ANIME
            ? { contentType, watch: entry as WatchEntry | undefined }
            : { contentType, read: entry as ReadEntry | undefined };

    return (
        <>
            {size?.includes('icon') ? (
                <IconStatusButton
                    {...buttonProps}
                    contentType={contentType}
                    entry={entry}
                    disabled={blocked}
                    size={size as 'icon-sm' | 'icon-md'}
                    slug={slug}
                    content={content}
                    isLoading={isChangingStatus}
                    onOpenModal={() => setEditOpen(true)}
                />
            ) : (
                <Select
                    disabled={blocked || isChangingStatus}
                    value={currentStatus}
                    onValueChange={handleChangeStatus}
                >
                    {trackedEntry ? (
                        <StatusTrigger
                            {...trackedProps}
                            disabled={blocked}
                            size={size as 'sm' | 'md'}
                            isLoading={isChangingStatus}
                            onOpenModal={() => setEditOpen(true)}
                        />
                    ) : (
                        <NewStatusTrigger
                            contentType={contentType}
                            size={size as 'sm' | 'md'}
                            slug={slug}
                            disabled={blocked}
                            isLoading={isChangingStatus}
                        />
                    )}

                    <SelectContent>
                        <SelectList>
                            <SelectGroup>
                                {KINDS[kind].options.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                            {trackedEntry && (
                                <>
                                    <SelectSeparator />
                                    <SelectGroup>
                                        <SelectItem
                                            disableCheckbox
                                            value="settings"
                                        >
                                            {SETTINGS_BUTTON.label}
                                        </SelectItem>
                                    </SelectGroup>
                                </>
                            )}
                        </SelectList>
                    </SelectContent>
                </Select>
            )}
            <ListEntryEditDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                content={content}
                slug={slug}
                {...dialogProps}
            />
        </>
    );
};

export default ListStatusButton;
