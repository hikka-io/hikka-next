import { createElement, type FC } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    type AnimeResponse,
    type WatchResponse,
    type WatchResponseBase,
    type WatchStatusEnum,
    WatchStatusEnum as WatchStatusEnumValue,
    watchAddMutation,
    watchGetQueryKey,
} from '@hikka/api';

import { Button, type ButtonProps } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { cn } from '@/utils/cn';
import { WATCH_STATUS } from '@/utils/constants/common';

type IconWatchStatusButtonProps = ButtonProps & {
    watch?: WatchResponse | WatchResponseBase;
    disabled?: boolean;
    size?: 'icon-sm' | 'icon-md';
    slug: string;
    anime?: AnimeResponse;
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
        onSuccess: (data, { path }) => {
            queryClient.setQueryData(
                watchGetQueryKey({ path: { slug: path.slug } }),
                data,
            );
            queryClient.invalidateQueries({
                predicate: (query) =>
                    (query.queryKey[0] as { _id?: string } | undefined)?._id ===
                    'userWatchList',
            });
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

    const watchStatus = watch
        ? WATCH_STATUS[watch.status as WatchStatusEnum]
        : null;

    if (!watch || !watchStatus) {
        return (
            <Button
                size={size}
                variant="secondary"
                disabled={disabled}
                onClick={handleAddToPlanned}
                {...props}
            >
                {createElement(WATCH_STATUS.planned.icon!)}
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
            {isLoading ? <Spinner /> : createElement(watchStatus.icon!)}
        </Button>
    );
};

export default IconWatchStatusButton;
