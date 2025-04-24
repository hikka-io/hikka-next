'use client';

import { ReadContentType, ReadResponseBase } from '@hikka/client';
import { useMangaInfo, useNovelInfo } from '@hikka/react';
import { FC, createElement } from 'react';

import ReadEditModal from '@/features/modals/read-edit-modal.component';

import { useModalContext } from '@/services/providers/modal-provider';
import { READ_STATUS } from '@/utils/constants/common';
import { cn } from '@/utils/utils';

import MaterialSymbolsSettingsOutlineRounded from '../icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import { Button } from '../ui/button';
import { SelectTrigger } from '../ui/select';

interface ReadStatusTriggerProps {
    read: ReadResponseBase;
    content_type: ReadContentType;
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

    const { data: manga } = useMangaInfo({
        slug,
        options: {
            enabled: !disabled && content_type === 'manga',
        },
    });

    const { data: novel } = useNovelInfo({
        slug,
        options: {
            enabled: !disabled && content_type === 'novel',
        },
    });

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
                    <MaterialSymbolsSettingsOutlineRounded />
                </Button>
            </div>
        </SelectTrigger>
    );
};

export default ReadStatusTrigger;
