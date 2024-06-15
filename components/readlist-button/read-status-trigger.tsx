'use client';

import * as React from 'react';
import { FC, createElement } from 'react';
import IcBaselineRemoveCircle from '~icons/ic/baseline-remove-circle';

import { Button } from '@/components/ui/button';
import { SelectTrigger } from '@/components/ui/select';

import useDeleteRead from '@/services/hooks/read/use-delete-read';
import { READ_STATUS } from '@/utils/constants';
import { cn } from '@/utils/utils';

interface ReadStatusTriggerProps {
    read: API.Read;
    content_type: 'novel' | 'manga';
    disabled?: boolean;
    slug: string;
}

const ReadStatusTrigger: FC<ReadStatusTriggerProps> = ({
    read,
    content_type,
    disabled,
    slug,
}) => {
    const { mutate: deleteRead } = useDeleteRead();

    const handleDeleteFromList = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        deleteRead({ params: { slug, content_type } });
    };

    return (
        <SelectTrigger asChild className="gap-0 border-none p-0">
            <div className="flex w-full">
                <Button
                    variant="secondary"
                    disabled={disabled}
                    className={cn(
                        'flex-1 flex-nowrap overflow-hidden rounded-r-none',
                    )}
                >
                    {createElement(READ_STATUS[read.status].icon!)}
                    <span className="truncate rounded-none">
                        {READ_STATUS[read.status].title_ua ||
                            READ_STATUS[read.status].title_en}
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
                    size="icon"
                    type="button"
                    onClick={handleDeleteFromList}
                    disabled={disabled}
                    className={cn('rounded-l-none text-xl hover:bg-red-500')}
                >
                    <IcBaselineRemoveCircle />
                </Button>
            </div>
        </SelectTrigger>
    );
};

export default ReadStatusTrigger;
