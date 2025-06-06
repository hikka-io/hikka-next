'use client';

import { AnimeScheduleResponse, WatchStatusEnum } from '@hikka/client';
import { useCreateWatch, useSession } from '@hikka/react';
import { useSnackbar } from 'notistack';
import { FC, Fragment, createElement, memo } from 'react';

import { Button } from '@/components/ui/button';

import { useModalContext } from '@/services/providers/modal-provider';
import { WATCH_STATUS } from '@/utils/constants/common';

import WatchEditModal from '../../modals/watch-edit-modal.component';

interface Props {
    item: AnimeScheduleResponse;
    title: string;
}

const ScheduleWatchButton: FC<Props> = ({ item, title }) => {
    const { user: loggedUser } = useSession();
    const { enqueueSnackbar } = useSnackbar();
    const { openModal } = useModalContext();
    const { mutate: createWatch } = useCreateWatch();

    const watch = item.anime.watch.length > 0 ? item.anime.watch[0] : undefined;
    const watchStatus = watch ? WATCH_STATUS[watch.status] : null;

    const handleWatch = () => {
        if (watchStatus) {
            openModal({
                content: (
                    <WatchEditModal slug={item.anime.slug} watch={watch} />
                ),
                className: '!max-w-xl',
                title: title,
                forceModal: true,
            });

            return;
        }

        createWatch({
            slug: item.anime.slug,
            args: { status: WatchStatusEnum.PLANNED },
        });

        enqueueSnackbar('Аніме додано до Вашого списку', {
            variant: 'success',
        });
    };

    if (!loggedUser) return null;

    return (
        <Fragment>
            <Button
                className="hidden sm:flex"
                style={{
                    backgroundColor: watchStatus?.color,
                }}
                onClick={handleWatch}
                variant={watchStatus ? 'secondary' : 'outline'}
                size="icon-sm"
            >
                {watchStatus
                    ? createElement(watchStatus.icon!)
                    : createElement(WATCH_STATUS.planned.icon!)}
            </Button>

            <Button
                className="flex sm:hidden"
                onClick={handleWatch}
                variant={watchStatus ? 'secondary' : 'outline'}
                size="md"
            >
                {watchStatus
                    ? createElement(watchStatus.icon!)
                    : createElement(WATCH_STATUS.planned.icon!)}
                {watchStatus ? watchStatus.title_ua : 'Додати у список'}
            </Button>
        </Fragment>
    );
};

export default memo(ScheduleWatchButton);
