'use client';

import { createElement } from 'react';
import MaterialSymbolsSettingsOutline from '~icons/material-symbols/settings-outline';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectSeparator,
} from '@/components/ui/select';

import ReadEditModal from '@/features/modals/read-edit-modal';

import useMangaInfo from '@/services/hooks/manga/use-manga-info';
import useNovelInfo from '@/services/hooks/novel/use-novel-info';
import useAddRead from '@/services/hooks/read/use-add-read';
import useRead from '@/services/hooks/read/use-read';
import { useModalContext } from '@/services/providers/modal-provider';
import { READ_STATUS } from '@/utils/constants';

import NewStatusTrigger from './new-status-trigger';
import ReadStatusTrigger from './read-status-trigger';

interface Props {
    slug: string;
    additional?: boolean;
    disabled?: boolean;
    content_type: 'novel' | 'manga';
    read?: API.Read;
    size?: 'sm' | 'md';
}

const SETTINGS_BUTTON = {
    label: (
        <div className="flex items-center gap-2">
            <MaterialSymbolsSettingsOutline />
            Налаштування
        </div>
    ),
    value: 'settings',
    disableCheckbox: true,
    title: 'Налаштування',
};

const OPTIONS = [
    ...Object.keys(READ_STATUS).map((status) => ({
        value: status,
        title: READ_STATUS[status as API.ReadStatus].title_ua,
        label: (
            <div className="flex items-center gap-2">
                {createElement(READ_STATUS[status as API.ReadStatus].icon!)}
                {READ_STATUS[status as API.ReadStatus].title_ua}
            </div>
        ),
    })),
];

const Component = ({
    slug,
    content_type,
    disabled,
    read: readProp,
    size,
}: Props) => {
    const { openModal } = useModalContext();

    const { data: readQuery, isError: readError } = useRead(
        {
            slug,
            content_type,
        },
        { enabled: !disabled && !readProp },
    );

    const { data: manga } = useMangaInfo(
        {
            slug,
        },
        { enabled: !disabled && content_type === 'manga' },
    );

    const { data: novel } = useNovelInfo(
        {
            slug,
        },
        { enabled: !disabled && content_type === 'novel' },
    );

    const { mutate: addRead } = useAddRead();

    const read = readProp || (readQuery && !readError ? readQuery : undefined);

    const openReadEditModal = () => {
        if (manga || novel) {
            const content = manga || novel;

            openModal({
                content: (
                    <ReadEditModal
                        read={read}
                        content_type={content_type}
                        slug={content!.slug}
                    />
                ),
                className: '!max-w-xl',
                title: content!.title,
                forceModal: true,
            });
        }
    };

    const handleChangeStatus = (options: string[]) => {
        const params =
            read && !readError
                ? {
                      volumes: read?.volumes || undefined,
                      score: read?.score || undefined,
                      note: read?.note || undefined,
                      rereads: read?.rereads || undefined,
                  }
                : {};

        if (options[0] === 'settings') {
            openReadEditModal();
            return;
        }

        if (options[0] === 'completed') {
            addRead({
                params: {
                    slug,
                    content_type,
                    status: 'completed',
                    ...params,
                    volumes: manga?.volumes || undefined,
                    chapters: manga?.chapters || undefined,
                },
            });
        } else {
            addRead({
                params: {
                    slug,
                    content_type,
                    status: options[0] as API.ReadStatus,
                    ...params,
                },
            });
        }
    };

    return (
        <Select
            value={read && !readError ? [read.status] : []}
            onValueChange={handleChangeStatus}
        >
            {read && !readError ? (
                <ReadStatusTrigger
                    content_type={content_type}
                    read={read!}
                    disabled={disabled}
                    slug={slug}
                    size={size}
                />
            ) : (
                <NewStatusTrigger
                    content_type={content_type}
                    slug={slug}
                    disabled={disabled}
                    size={size}
                />
            )}

            <SelectContent>
                <SelectList>
                    <SelectGroup>
                        {OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                    {read && !readError && <SelectSeparator />}
                    {read && !readError && (
                        <SelectGroup>
                            {read && !readError && (
                                <SelectItem disableCheckbox value="settings">
                                    {SETTINGS_BUTTON.label}
                                </SelectItem>
                            )}
                        </SelectGroup>
                    )}
                </SelectList>
            </SelectContent>
        </Select>
    );
};

export default Component;
