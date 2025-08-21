'use client';

import {
    MangaResponse,
    NovelResponse,
    ReadContentType,
    ReadResponseBase,
} from '@hikka/client';
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
    size?: 'sm' | 'md';
    isLoading?: boolean;
    content?: MangaResponse | NovelResponse;
}

const ReadStatusTrigger: FC<ReadStatusTriggerProps> = ({
    read,
    content_type,
    disabled,
    size,
    isLoading,
    content,
}) => {
    const { openModal } = useModalContext();

    const openReadEditModal = () => {
        if (content) {
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
                        'flex-1 flex-nowrap overflow-hidden rounded-r-none border border-r-0',
                        `bg-${read.status} text-${read.status}-foreground border-${read.status}-border`,
                    )}
                >
                    {isLoading ? (
                        <span className="loading loading-spinner"></span>
                    ) : (
                        <div
                            className={cn(
                                'rounded-sm p-1 border',
                                `bg-${read.status} text-${read.status}-foreground border-${read.status}-border`,
                            )}
                        >
                            {createElement(READ_STATUS[read.status].icon!, {
                                className: '!size-3',
                            })}
                        </div>
                    )}
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
                    className={cn(
                        'rounded-l-none border border-l-0',
                        `bg-${read.status} text-${read.status}-foreground border-${read.status}-border`,
                    )}
                >
                    <MaterialSymbolsSettingsOutlineRounded />
                </Button>
            </div>
        </SelectTrigger>
    );
};

export default ReadStatusTrigger;
