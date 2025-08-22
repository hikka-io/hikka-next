'use client';

import {
    ContentTypeEnum,
    MangaResponse,
    NovelResponse,
    ReadContentType,
    ReadResponseBase,
    ReadStatusEnum,
} from '@hikka/client';
import {
    useCreateRead,
    useMangaBySlug,
    useNovelBySlug,
    useReadBySlug,
} from '@hikka/react';
import { createElement, useCallback, useMemo } from 'react';

import { ButtonProps } from '@/components/ui/button';

import ReadEditModal from '@/features/modals/read-edit-modal.component';

import { useModalContext } from '@/services/providers/modal-provider';
import { READ_STATUS } from '@/utils/constants/common';
import { cn } from '@/utils/utils';

import MaterialSymbolsSettingsOutlineRounded from '../icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectSeparator,
} from '../ui/select';
import IconReadStatusButton from './icon-read-status-button';
import NewStatusTrigger from './new-status-trigger';
import ReadStatusTrigger from './read-status-trigger';

interface Props {
    slug: string;
    additional?: boolean;
    disabled?: boolean;
    content_type: ReadContentType;
    read?: ReadResponseBase | null;
    content?: MangaResponse | NovelResponse;
    size?: 'sm' | 'md' | 'icon-sm' | 'icon-md';
    buttonProps?: ButtonProps;
}

// Move constants outside component to prevent recreation on each render
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

const STATUS_OPTIONS = Object.keys(READ_STATUS).map((status) => ({
    value: status,
    title: READ_STATUS[status as ReadStatusEnum].title_ua,
    label: (
        <div className="flex items-center gap-2">
            <div
                className={cn(
                    'w-fit rounded-sm border p-1',
                    `bg-${status} text-${status}-foreground border-${status}-border`,
                )}
            >
                {createElement(READ_STATUS[status as ReadStatusEnum].icon!, {
                    className: '!size-3',
                })}
            </div>
            {READ_STATUS[status as ReadStatusEnum].title_ua}
        </div>
    ),
}));

const ReadlistButton = ({
    slug,
    content_type,
    disabled,
    read: readProp,
    content: contentProp,
    size,
    buttonProps,
}: Props) => {
    const { openModal } = useModalContext();

    const { data: readQuery, isError: readError } = useReadBySlug({
        contentType: content_type,
        slug,
        options: {
            enabled: !disabled && !readProp && readProp !== null,
        },
    });

    const { data: manga } = useMangaBySlug({
        slug,
        options: {
            enabled: !disabled && content_type === 'manga' && !contentProp,
        },
    });

    const { data: novel } = useNovelBySlug({
        slug,
        options: {
            enabled: !disabled && content_type === 'novel' && !contentProp,
        },
    });

    const { mutate: createRead, isPending: isChangingStatus } = useCreateRead();

    // Memoize derived values to prevent unnecessary recalculations
    const read = useMemo(
        () => readProp || (readQuery && !readError ? readQuery : undefined),
        [readProp, readQuery, readError],
    );

    const content = useMemo(
        () => contentProp || manga || novel,
        [contentProp, manga, novel],
    );

    const openReadEditModal = useCallback(() => {
        if (content) {
            openModal({
                content: (
                    <ReadEditModal
                        read={read}
                        content_type={content_type}
                        slug={content.slug}
                    />
                ),
                className: '!max-w-xl',
                title: content.title,
                forceModal: true,
            });
        }
    }, [content, read, content_type, openModal]);

    const handleChangeStatus = useCallback(
        (options: string[]) => {
            const selectedOption = options[0];

            if (selectedOption === 'settings') {
                openReadEditModal();
                return;
            }

            // Extract current read parameters
            const currentReadParams =
                read && !readError
                    ? {
                          chapters: read.chapters || undefined,
                          volumes: read.volumes || undefined,
                          score: read.score || undefined,
                          note: read.note || undefined,
                          rereads: read.rereads || undefined,
                      }
                    : {};

            // Handle completed status specially to set volumes and chapters for manga/novel
            const readArgs =
                selectedOption === 'completed'
                    ? {
                          status: ReadStatusEnum.COMPLETED,
                          ...currentReadParams,
                          volumes:
                              (content_type === ContentTypeEnum.MANGA
                                  ? manga?.volumes
                                  : novel?.volumes) ||
                              read?.volumes ||
                              undefined,
                          chapters:
                              (content_type === ContentTypeEnum.MANGA
                                  ? manga?.chapters
                                  : novel?.chapters) ||
                              read?.chapters ||
                              undefined,
                      }
                    : {
                          status: selectedOption as ReadStatusEnum,
                          ...currentReadParams,
                      };

            createRead({
                contentType: content_type,
                slug,
                args: readArgs,
            });
        },
        [
            read,
            readError,
            manga,
            novel,
            content_type,
            slug,
            createRead,
            openReadEditModal,
        ],
    );

    const hasValidRead = read && !readError;
    const currentStatus = hasValidRead ? [read.status] : [];

    if (size?.includes('icon')) {
        return (
            <IconReadStatusButton
                {...buttonProps}
                read={read}
                disabled={disabled}
                size={size as 'icon-sm' | 'icon-md'}
                slug={slug}
                content_type={content_type}
                content={content}
                isLoading={isChangingStatus}
            />
        );
    }

    return (
        <Select
            disabled={disabled || isChangingStatus}
            value={currentStatus}
            onValueChange={handleChangeStatus}
        >
            {hasValidRead ? (
                <ReadStatusTrigger
                    content_type={content_type}
                    read={read}
                    disabled={disabled}
                    content={content}
                    size={size as 'sm' | 'md'}
                    isLoading={isChangingStatus}
                />
            ) : (
                <NewStatusTrigger
                    content_type={content_type}
                    slug={slug}
                    disabled={disabled}
                    size={size as 'sm' | 'md'}
                    isLoading={isChangingStatus}
                />
            )}

            <SelectContent>
                <SelectList>
                    <SelectGroup>
                        {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                    {hasValidRead && (
                        <>
                            <SelectSeparator />
                            <SelectGroup>
                                <SelectItem disableCheckbox value="settings">
                                    {SETTINGS_BUTTON.label}
                                </SelectItem>
                            </SelectGroup>
                        </>
                    )}
                </SelectList>
            </SelectContent>
        </Select>
    );
};

export default ReadlistButton;
