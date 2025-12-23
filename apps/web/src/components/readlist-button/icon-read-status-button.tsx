'use client';

import {
    MangaResponse,
    NovelResponse,
    ReadContentType,
    ReadResponseBase,
    ReadStatusEnum,
} from '@hikka/client';
import { useCreateRead } from '@hikka/react';
import { FC, createElement } from 'react';

import { Button, ButtonProps } from '@/components/ui/button';

import { ReadEditModal } from '@/features/modals';

import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/cn';
import { READ_STATUS } from '@/utils/constants/common';

interface IconReadStatusButtonProps extends Omit<ButtonProps, 'content'> {
    read?: ReadResponseBase;
    disabled?: boolean;
    size?: 'icon-sm' | 'icon-md';
    slug: string;
    content_type: ReadContentType;
    content?: MangaResponse | NovelResponse;
    isLoading?: boolean;
}

const IconReadStatusButton: FC<IconReadStatusButtonProps> = ({
    read,
    disabled,
    size,
    slug,
    content_type,
    content,
    isLoading,
    ...props
}) => {
    const { openModal } = useModalContext();
    const { mutate: createRead } = useCreateRead();

    const handleAddToPlanned = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        createRead({
            contentType: content_type,
            slug,
            args: {
                status: ReadStatusEnum.PLANNED,
            },
        });
    };

    const openReadEditModal = () => {
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
    };

    const readStatus = read ? READ_STATUS[read.status] : null;

    if (!read || !readStatus) {
        return (
            <Button
                {...props}
                size={size}
                variant="secondary"
                disabled={disabled}
                onClick={handleAddToPlanned}
            >
                {createElement(READ_STATUS.planned.icon!)}
            </Button>
        );
    }

    return (
        <Button
            {...props}
            size={size}
            variant="secondary"
            disabled={disabled}
            onClick={openReadEditModal}
            className={cn(
                'border',
                `bg-${read.status} text-${read.status}-foreground border-${read.status}-border`,
            )}
        >
            {isLoading ? (
                <span className="loading loading-spinner"></span>
            ) : (
                createElement(readStatus.icon!)
            )}
        </Button>
    );
};

export default IconReadStatusButton;
