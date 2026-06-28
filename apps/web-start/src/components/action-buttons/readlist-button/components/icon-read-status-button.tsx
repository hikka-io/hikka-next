import { createElement, type FC } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    type MangaResponse,
    type NovelResponse,
    type ReadContentTypeEnum,
    type ReadResponseBase,
    type ReadStatusEnum,
    ReadStatusEnum as ReadStatusEnumValue,
    readAddMutation,
} from '@hikka/api';

import { Button, type ButtonProps } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { applyReadMutation } from '@/utils/api/invalidate-content-state';
import { cn } from '@/utils/cn';
import { READ_STATUS } from '@/utils/constants/common';

type IconReadStatusButtonProps = Omit<ButtonProps, 'content'> & {
    read?: ReadResponseBase;
    disabled?: boolean;
    size?: 'icon-sm' | 'icon-md';
    slug: string;
    content_type: ReadContentTypeEnum;
    content?: MangaResponse | NovelResponse;
    isLoading?: boolean;
    onOpenModal?: () => void;
};

const IconReadStatusButton: FC<IconReadStatusButtonProps> = ({
    read,
    disabled,
    size,
    slug,
    content_type,
    content,
    isLoading,
    onOpenModal,
    ...props
}) => {
    const queryClient = useQueryClient();

    const { mutate: createRead } = useMutation({
        ...readAddMutation(),
        onSuccess: (data) => {
            applyReadMutation(queryClient, data);
        },
    });

    const handleAddToPlanned = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        createRead({
            path: { content_type, slug },
            body: {
                status: ReadStatusEnumValue.PLANNED,
            },
        });
    };

    const openReadEditModal = () => {
        if (content && onOpenModal) {
            onOpenModal();
        }
    };

    const readStatus = read ? READ_STATUS[read.status as ReadStatusEnum] : null;

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
            {isLoading ? <Spinner /> : createElement(readStatus.icon!)}
        </Button>
    );
};

export default IconReadStatusButton;
