import { useCallback, useMemo, useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
    type MangaInfoResponse,
    type MangaResponse,
    type NovelInfoResponse,
    type NovelResponse,
    type ReadArgs,
    type ReadContentTypeEnum,
    type ReadResponseBase,
    ReadStatusEnum,
    readAddMutation,
    readGetOptions,
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
import { applyReadMutation } from '@/utils/api/invalidate-content-state';
import { carryOverReadArgs } from '@/utils/api/tracking-args';

import IconReadStatusButton from './icon-read-status-button';
import ListEntryEditDialog from './list-entry-edit-dialog';
import NewReadStatusTrigger from './new-read-status-trigger';
import ReadStatusTrigger from './read-status-trigger';
import { READ_STATUS_OPTIONS } from './status-options';

type Props = {
    slug: string;
    disabled?: boolean;
    content_type: ReadContentTypeEnum;
    read?: ReadResponseBase | null;
    content:
        | MangaResponse
        | NovelResponse
        | MangaInfoResponse
        | NovelInfoResponse
        | undefined;
    size?: 'sm' | 'md' | 'icon-sm' | 'icon-md';
    buttonProps?: ButtonProps;
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

const ReadListButton = ({
    slug,
    content_type,
    disabled,
    read: readProp,
    content,
    size,
    buttonProps,
}: Props) => {
    const [editOpen, setEditOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data: readQuery, isError: readError } = useQuery({
        ...readGetOptions({ path: { content_type, slug } }),
        retry: false,
        enabled: !disabled && !readProp && readProp !== null,
    });

    const { mutate: createRead, isPending: isChangingStatus } = useMutation({
        ...readAddMutation(),
        onSuccess: (data) => {
            applyReadMutation(queryClient, data);
        },
    });

    const read = useMemo(
        () => readProp || (readQuery && !readError ? readQuery : undefined),
        [readProp, readQuery, readError],
    );

    const openReadEditModal = useCallback(() => {
        if (content) {
            setEditOpen(true);
        }
    }, [content]);

    const handleChangeStatus = useCallback(
        (options: string[]) => {
            const selectedOption = options[0];

            if (selectedOption === 'settings') {
                openReadEditModal();
                return;
            }

            const currentReadParams = carryOverReadArgs(
                read && !readError ? read : undefined,
            );

            const readArgs: ReadArgs =
                selectedOption === 'completed'
                    ? {
                          status: ReadStatusEnum.COMPLETED,
                          ...currentReadParams,
                          volumes:
                              content?.volumes || read?.volumes || undefined,
                          chapters:
                              content?.chapters || read?.chapters || undefined,
                      }
                    : {
                          status: selectedOption as ReadStatusEnum,
                          ...currentReadParams,
                      };

            createRead({
                path: { content_type, slug },
                body: readArgs,
            });
        },
        [
            read,
            readError,
            content,
            content_type,
            slug,
            createRead,
            openReadEditModal,
        ],
    );

    const hasValidRead = read && !readError;
    const currentStatus = hasValidRead ? [read.status] : [];

    return (
        <>
            {size?.includes('icon') ? (
                <IconReadStatusButton
                    {...buttonProps}
                    read={read}
                    disabled={disabled}
                    size={size as 'icon-sm' | 'icon-md'}
                    slug={slug}
                    content_type={content_type}
                    content={content}
                    isLoading={isChangingStatus}
                    onOpenModal={() => setEditOpen(true)}
                />
            ) : (
                <Select
                    disabled={disabled || isChangingStatus}
                    value={currentStatus}
                    onValueChange={handleChangeStatus}
                >
                    {hasValidRead ? (
                        <ReadStatusTrigger
                            read={read}
                            disabled={disabled}
                            size={size as 'sm' | 'md'}
                            isLoading={isChangingStatus}
                            onOpenModal={() => setEditOpen(true)}
                        />
                    ) : (
                        <NewReadStatusTrigger
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
                                {READ_STATUS_OPTIONS.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                            {hasValidRead && (
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
                contentType={content_type}
                read={read}
            />
        </>
    );
};

export default ReadListButton;
