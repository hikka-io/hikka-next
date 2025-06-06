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

import ReadEditModal from '@/features/modals/read-edit-modal.component';

import { useModalContext } from '@/services/providers/modal-provider';
import { READ_STATUS } from '@/utils/constants/common';

import MaterialSymbolsSettingsOutlineRounded from '../icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectSeparator,
} from '../ui/select';
import NewStatusTrigger from './new-status-trigger';
import ReadStatusTrigger from './read-status-trigger';

interface Props {
    slug: string;
    additional?: boolean;
    disabled?: boolean;
    content_type: ReadContentType;
    read?: ReadResponseBase;
    content?: MangaResponse | NovelResponse;
    size?: 'sm' | 'md';
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
            {createElement(READ_STATUS[status as ReadStatusEnum].icon!)}
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
}: Props) => {
    const { openModal } = useModalContext();

    const { data: readQuery, isError: readError } = useReadBySlug({
        contentType: content_type,
        slug,
        options: {
            enabled: !disabled && !readProp,
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
            content_type,
            slug,
            createRead,
            openReadEditModal,
        ],
    );

    const hasValidRead = read && !readError;
    const currentStatus = hasValidRead ? [read.status] : [];

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
                    slug={slug}
                    size={size}
                    isLoading={isChangingStatus}
                />
            ) : (
                <NewStatusTrigger
                    content_type={content_type}
                    slug={slug}
                    disabled={disabled}
                    size={size}
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
