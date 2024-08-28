'use client';

import { FC, createElement } from 'react';
import MaterialSymbolsSettingsOutline from '~icons/material-symbols/settings-outline';

import { Button } from '@/components/ui/button';
import { SelectTrigger } from '@/components/ui/select';

import ReadEditModal from '@/features/modals/read-edit-modal.component';

import useMangaInfo from '@/services/hooks/manga/use-manga-info';
import useNovelInfo from '@/services/hooks/novel/use-novel-info';
import { useModalContext } from '@/services/providers/modal-provider';
import { READ_STATUS } from '@/utils/constants/common';
import { cn } from '@/utils/utils';

interface ReadStatusTriggerProps {
    read: API.Read;
    content_type: 'novel' | 'manga';
    disabled?: boolean;
    slug: string;
    size?: 'sm' | 'md';
}

const ReadStatusTrigger: FC<ReadStatusTriggerProps> = ({
    read,
    content_type,
    disabled,
    slug,
    size,
}) => {
    const { openModal } = useModalContext();

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

    const readStatus = READ_STATUS[read.status];

    return (
        <SelectTrigger asChild className="gap-0 border-none p-0">
            <div className="flex w-full">
                <Button
                    size={size}
                    variant="secondary"
                    disabled={disabled}
                    className={cn(
                        'flex-1 flex-nowrap overflow-hidden rounded-r-none',
                    )}
                >
                    <div
                        className="rounded-sm p-0.5"
                        style={{ backgroundColor: readStatus.color }}
                    >
                        {createElement(READ_STATUS[read.status].icon!)}
                    </div>
                    <span className="truncate rounded-none">
                        {readStatus.title_ua || readStatus.title_en}
                    </span>
                    {read.score > 0 && (
                        <>
                            <span className="opacity-60">-</span>
                            <span className="opacity-60">{read.score}</span>
                        </>
                    )}
                </Button>
                <Button
                    variant="secondary"
                    size={size ? `icon-${size}` : 'icon'}
                    type="button"
                    onClick={openReadEditModal}
                    disabled={disabled}
                    className={cn('rounded-l-none')}
                >
                    <MaterialSymbolsSettingsOutline />
                </Button>
            </div>
        </SelectTrigger>
    );
};

export default ReadStatusTrigger;
