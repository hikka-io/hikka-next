'use client';

import {
    MangaResponse,
    NovelResponse,
    ReadContentType,
    ReadResponseBase,
} from '@hikka/client';
import { FC, createElement, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalHeader,
    ResponsiveModalTitle,
} from '@/components/ui/responsive-modal';
import { SelectTrigger } from '@/components/ui/select';

import { ReadEditModal } from '@/features/read';

import { cn } from '@/utils/cn';
import { READ_STATUS } from '@/utils/constants/common';

import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';

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
    const [editOpen, setEditOpen] = useState(false);

    const openReadEditModal = () => {
        if (content) {
            setEditOpen(true);
        }
    };

    const readStatus = READ_STATUS[read.status];

    return (
        <>
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
                                    'rounded-sm border p-1',
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
            <ResponsiveModal open={editOpen} onOpenChange={setEditOpen} forceDesktop>
                <ResponsiveModalContent className="!max-w-xl">
                    <ResponsiveModalHeader>
                        <ResponsiveModalTitle>{content?.title}</ResponsiveModalTitle>
                    </ResponsiveModalHeader>
                    <ReadEditModal slug={content?.slug || ''} content_type={content_type} read={read} onClose={() => setEditOpen(false)} />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default ReadStatusTrigger;
