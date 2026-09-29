import { createElement, type FC } from 'react';

import {
    type MangaInfoResponse,
    type MangaResponse,
    type NovelInfoResponse,
    type NovelResponse,
    type ReadContentTypeEnum,
    type ReadResponseBase,
    type ReadStatusEnum,
    ReadStatusEnum as ReadStatusEnumValue,
} from '@hikka/api';

import { READ_STATUS_ICONS } from '@/components/icons/list-status-icons';
import { Button, type ButtonProps } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { cn } from '@/utils/cn';

import { useAddRead } from './use-tracking-mutations';

type IconReadStatusButtonProps = Omit<ButtonProps, 'content'> & {
    read?: ReadResponseBase;
    disabled?: boolean;
    size?: 'icon-sm' | 'icon-md';
    slug: string;
    content_type: ReadContentTypeEnum;
    content?:
        | MangaResponse
        | NovelResponse
        | MangaInfoResponse
        | NovelInfoResponse;
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
    const { mutate: createRead } = useAddRead();

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

    const StatusIcon = read
        ? READ_STATUS_ICONS[read.status as ReadStatusEnum]
        : null;

    if (!read || !StatusIcon) {
        return (
            <Button
                {...props}
                size={size}
                variant="secondary"
                disabled={disabled}
                onClick={handleAddToPlanned}
            >
                {createElement(READ_STATUS_ICONS.planned)}
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
            {isLoading ? <Spinner /> : createElement(StatusIcon)}
        </Button>
    );
};

export default IconReadStatusButton;
