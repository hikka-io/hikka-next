import {
    ContentTypeEnum,
    ReadResponse,
    ReadStatusEnum,
    WatchResponse,
    WatchStatusEnum,
} from '@hikka/client';
import { useCreateRead, useCreateWatch } from '@hikka/react';
import { useEffect, useState } from 'react';

import useDebounce from '@/services/hooks/use-debounce';

type MappedListItem = {
    progress: number;
    total: number | null;
    score: number | undefined;
    status: ReadStatusEnum | WatchStatusEnum | undefined;
    slug: string;
    extraArgs: Record<string, any>;
};

const mapListItem = ({
    listItem,
    content_type,
}: ListManagerProps): MappedListItem => {
    switch (content_type) {
        case ContentTypeEnum.ANIME:
            return {
                progress: (listItem as WatchResponse)?.episodes,
                total: (listItem as WatchResponse)?.anime.episodes_total,
                score: listItem?.score,
                status: listItem?.status,
                slug: (listItem as WatchResponse)?.anime.slug,
                extraArgs: {
                    note: listItem?.note,
                    rewatches: (listItem as WatchResponse)?.rewatches,
                },
            };
        case ContentTypeEnum.MANGA:
        case ContentTypeEnum.NOVEL:
            return {
                progress: (listItem as ReadResponse)?.chapters,
                total: (listItem as ReadResponse)?.content.chapters,
                status: listItem?.status,
                score: listItem?.score,
                slug: (listItem as ReadResponse)?.content.slug,
                extraArgs: {
                    volumes: (listItem as ReadResponse)?.volumes,
                    note: listItem?.note,
                    rereads: (listItem as ReadResponse)?.rereads,
                },
            };
    }
};

enum CommonStatusEnum {
    COMPLETED = 'completed',
    ON_PROGRESS = 'on_progress',
    PLANNED = 'planned',
    ON_HOLD = 'on_hold',
    DROPPED = 'dropped',
}

const statuses = {
    [ContentTypeEnum.ANIME]: {
        [CommonStatusEnum.COMPLETED]: WatchStatusEnum.COMPLETED,
        [CommonStatusEnum.ON_PROGRESS]: WatchStatusEnum.WATCHING,
        [CommonStatusEnum.PLANNED]: WatchStatusEnum.PLANNED,
        [CommonStatusEnum.ON_HOLD]: WatchStatusEnum.ON_HOLD,
        [CommonStatusEnum.DROPPED]: WatchStatusEnum.DROPPED,
    },
    [ContentTypeEnum.MANGA]: {
        [CommonStatusEnum.COMPLETED]: ReadStatusEnum.COMPLETED,
        [CommonStatusEnum.ON_PROGRESS]: ReadStatusEnum.READING,
        [CommonStatusEnum.PLANNED]: ReadStatusEnum.PLANNED,
        [CommonStatusEnum.ON_HOLD]: ReadStatusEnum.ON_HOLD,
        [CommonStatusEnum.DROPPED]: ReadStatusEnum.DROPPED,
    },
    [ContentTypeEnum.NOVEL]: {
        [CommonStatusEnum.COMPLETED]: ReadStatusEnum.COMPLETED,
        [CommonStatusEnum.ON_PROGRESS]: ReadStatusEnum.READING,
        [CommonStatusEnum.PLANNED]: ReadStatusEnum.PLANNED,
        [CommonStatusEnum.ON_HOLD]: ReadStatusEnum.ON_HOLD,
        [CommonStatusEnum.DROPPED]: ReadStatusEnum.DROPPED,
    },
};

type ListManagerProps = {
    listItem?: ReadResponse | WatchResponse;
    content_type:
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL
        | ContentTypeEnum.ANIME;
};

export const useUserlistManager = ({
    listItem,
    content_type,
}: ListManagerProps) => {
    const [updatedListItem, setUpdatedListItem] =
        useState<MappedListItem | null>(null);

    const deboucedUpdatedListItem = useDebounce({
        value: updatedListItem,
        delay: 500,
    });

    const { mutate: mutateCreateWatch } = useCreateWatch();
    const { mutate: mutateCreateRead } = useCreateRead();

    const mappedListItem = mapListItem({ listItem, content_type });

    const addProgress = () => {
        if (listItem) {
            const progress =
                (updatedListItem?.progress ?? mappedListItem.progress) + 1;

            if (mappedListItem.total && progress > mappedListItem.total) return;

            let status = updatedListItem?.status ?? mappedListItem.status;

            if (progress === mappedListItem.total) {
                status = statuses[content_type][CommonStatusEnum.COMPLETED];
            }

            if (
                !mappedListItem.progress &&
                mappedListItem.status ===
                    statuses[content_type][CommonStatusEnum.PLANNED]
            ) {
                status = statuses[content_type][CommonStatusEnum.ON_PROGRESS];
            }

            setUpdatedListItem({
                slug: mappedListItem.slug,
                score: mappedListItem.score,
                total: mappedListItem.total,
                extraArgs: mappedListItem.extraArgs,
                ...updatedListItem,
                status,
                progress,
            });
        }
    };

    const removeProgress = () => {
        if (listItem) {
            const progress =
                (updatedListItem?.progress ?? mappedListItem.progress) - 1;

            if (progress < 0) return;

            setUpdatedListItem({
                status: mappedListItem.status,
                slug: mappedListItem.slug,
                score: mappedListItem.score,
                total: mappedListItem.total,
                extraArgs: mappedListItem.extraArgs,
                ...updatedListItem,
                progress,
            });
        }
    };

    const setScore = (value: number) => {
        if (listItem) {
            setUpdatedListItem({
                status: mappedListItem.status,
                progress: mappedListItem.progress,
                slug: mappedListItem.slug,
                total: mappedListItem.total,
                extraArgs: mappedListItem.extraArgs,
                ...updatedListItem,
                score: value * 2,
            });
        }
    };

    const mutateListItem = () => {
        switch (content_type) {
            case ContentTypeEnum.ANIME:
                mutateCreateWatch({
                    slug: mappedListItem.slug,
                    args: {
                        note: deboucedUpdatedListItem?.extraArgs.note,
                        rewatches: deboucedUpdatedListItem?.extraArgs.rewatches,
                        score: deboucedUpdatedListItem?.score,
                        status: deboucedUpdatedListItem?.status as WatchStatusEnum,
                        episodes: deboucedUpdatedListItem?.progress,
                    },
                });
                break;
            case ContentTypeEnum.MANGA:
            case ContentTypeEnum.NOVEL:
                mutateCreateRead({
                    contentType: content_type,
                    slug: mappedListItem.slug,
                    args: {
                        note: deboucedUpdatedListItem?.extraArgs.note,
                        rereads: deboucedUpdatedListItem?.extraArgs.rereads,
                        score: deboucedUpdatedListItem?.score,
                        status: deboucedUpdatedListItem?.status as ReadStatusEnum,
                        chapters: deboucedUpdatedListItem?.progress,
                        volumes: deboucedUpdatedListItem?.extraArgs.volumes,
                    },
                });
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (deboucedUpdatedListItem) {
            mutateListItem();
        }
    }, [deboucedUpdatedListItem]);

    return {
        addProgress,
        removeProgress,
        setScore,
        score: updatedListItem?.score ?? mappedListItem.score,
        progress: updatedListItem?.progress ?? mappedListItem.progress,
        total: updatedListItem?.total ?? mappedListItem.total,
    };
};
