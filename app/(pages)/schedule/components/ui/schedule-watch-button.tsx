'use client';

import React, { Fragment, createElement, memo } from 'react';

import WatchEditModal from '@/components/modals/watch-edit-modal';
import { Button } from '@/components/ui/button';
import useAuth from '@/services/hooks/auth/useAuth';
import useAddToList from '@/services/hooks/watch/useAddToList';
import { useModalContext } from '@/services/providers/modal-provider';
import { WATCH_STATUS } from '@/utils/constants';
import { useSnackbar } from 'notistack';

interface Props {
    item: API.AnimeSchedule;
    title: string;
}

const ScheduleWatchButton = ({ item, title }: Props) => {
    const { enqueueSnackbar } = useSnackbar();
    const { auth } = useAuth();
    const { openModal } = useModalContext();
    const { mutate: addToList } = useAddToList({ slug: item.anime.slug });

    const watch = item.anime.watch.length > 0 ? item.anime.watch[0] : null;
    const watchStatus = watch ? WATCH_STATUS[watch.status] : null;

    const handleWatch = () => {
        if (watchStatus) {
            openModal({
                content: <WatchEditModal slug={item.anime.slug} />,
                className: '!max-w-xl',
                title: title,
            });

            return;
        }

        addToList({ status: 'planned' });

        enqueueSnackbar(
            'Аніме додано до Вашого списку',
            { variant: 'success' },
        );
    };

    return (
        <Fragment>
            {auth && (
                <Button
                    className="hidden sm:flex"
                    style={{
                        backgroundColor: watchStatus?.color
                    }}
                    onClick={handleWatch}
                    variant={watchStatus ? 'secondary' : 'outline'}
                    size="icon-sm"
                >
                    {watchStatus
                        ? createElement(watchStatus.icon!)
                        : createElement(WATCH_STATUS.planned.icon!)}
                </Button>
            )}
            {auth && (
                <Button
                    className="flex sm:hidden"
                    onClick={handleWatch}
                    variant={watchStatus ? 'secondary' : 'outline'}
                    size="sm"
                >
                    {watchStatus
                        ? createElement(watchStatus.icon!)
                        : createElement(WATCH_STATUS.planned.icon!)}
                    {watchStatus ? watchStatus.title_ua : 'Додати у список'}
                </Button>
            )}
        </Fragment>
    );
};

export default memo(ScheduleWatchButton);
