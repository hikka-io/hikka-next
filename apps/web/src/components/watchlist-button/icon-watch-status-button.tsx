'use client';

import {
    AnimeResponse,
    WatchResponse,
    WatchResponseBase,
    WatchStatusEnum,
} from '@hikka/client';
import { useCreateWatch } from '@hikka/react';
import { FC, createElement } from 'react';

import { Button, ButtonProps } from '@/components/ui/button';

import { WatchEditModal } from '@/features/modals';

import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/cn';
import { WATCH_STATUS } from '@/utils/constants/common';

interface IconWatchStatusButtonProps extends ButtonProps {
    watch?: WatchResponse | WatchResponseBase;
    disabled?: boolean;
    size?: 'icon-sm' | 'icon-md';
    slug: string;
    anime?: AnimeResponse;
    isLoading?: boolean;
}

const IconWatchStatusButton: FC<IconWatchStatusButtonProps> = ({
    watch,
    disabled,
    size,
    slug,
    anime,
    isLoading,
    ...props
}) => {
    const { openModal } = useModalContext();
    const { mutate: createWatch } = useCreateWatch();

    const handleAddToPlanned = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        createWatch({
            slug,
            args: {
                status: WatchStatusEnum.PLANNED,
            },
        });
    };

    const openWatchEditModal = () => {
        if (anime) {
            openModal({
                content: <WatchEditModal slug={anime.slug} watch={watch} />,
                className: '!max-w-xl',
                title: anime.title,
                forceModal: true,
            });
        }
    };

    const watchStatus = watch ? WATCH_STATUS[watch.status] : null;

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
                `bg-${watch.status} text-${watch.status}-foreground border- border${watch.status}-border`,
            )}
            {...props}
        >
            {isLoading ? (
                <span className="loading loading-spinner"></span>
            ) : (
                createElement(watchStatus.icon!)
            )}
        </Button>
    );
};

export default IconWatchStatusButton;
