import { createElement, type FC } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    type AnimeInfoResponse,
    type AnimeResponse,
    type WatchResponse,
    type WatchResponseBase,
    type WatchStatusEnum,
    WatchStatusEnum as WatchStatusEnumValue,
    watchAddMutation,
} from '@hikka/api';

import { WATCH_STATUS_ICONS } from '@/components/icons/list-status-icons';
import { Button, type ButtonProps } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { applyWatchMutation } from '@/utils/api/invalidate-content-state';
import { cn } from '@/utils/cn';

type IconWatchStatusButtonProps = ButtonProps & {
    watch?: WatchResponse | WatchResponseBase;
    disabled?: boolean;
    size?: 'icon-sm' | 'icon-md';
    slug: string;
    anime?: AnimeResponse | AnimeInfoResponse;
    isLoading?: boolean;
    onOpenModal?: () => void;
};

const IconWatchStatusButton: FC<IconWatchStatusButtonProps> = ({
    watch,
    disabled,
    size,
    slug,
    anime,
    isLoading,
    onOpenModal,
    ...props
}) => {
    const queryClient = useQueryClient();

    const { mutate: createWatch } = useMutation({
        ...watchAddMutation(),
        onSuccess: (data) => {
            applyWatchMutation(queryClient, data);
        },
    });

    const handleAddToPlanned = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        createWatch({
            path: { slug },
            body: {
                status: WatchStatusEnumValue.PLANNED,
            },
        });
    };

    const openWatchEditModal = () => {
        if (anime && onOpenModal) {
            onOpenModal();
        }
    };

    const StatusIcon = watch
        ? WATCH_STATUS_ICONS[watch.status as WatchStatusEnum]
        : null;

    if (!watch || !StatusIcon) {
        return (
            <Button
                size={size}
                variant="secondary"
                disabled={disabled}
                onClick={handleAddToPlanned}
                {...props}
            >
                {createElement(WATCH_STATUS_ICONS.planned)}
            </Button>
        );
    }

    return (
        <Button
            size={size}
            variant="secondary"
            disabled={disabled}
            onClick={openWatchEditModal}
            className={cn(
                `bg-${watch.status} text-${watch.status}-foreground border-${watch.status}-border`,
            )}
            {...props}
        >
            {isLoading ? <Spinner /> : createElement(StatusIcon)}
        </Button>
    );
};

export default IconWatchStatusButton;
