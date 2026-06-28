import { useEffect, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    ContentTypeEnum,
    type MainContentTypeEnum,
    type ReadContentTypeEnum,
    type ReadResponse,
    ReadStatusEnum,
    readAddMutation,
    readGetQueryKey,
    type WatchResponse,
    WatchStatusEnum,
    watchAddMutation,
    watchGetQueryKey,
} from '@hikka/api';

import useDebounce from '@/services/hooks/use-debounce';
import {
    invalidateReadState,
    invalidateWatchState,
} from '@/utils/api/invalidate-content-state';

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
                status: (listItem as WatchResponse)?.status as WatchStatusEnum,
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
                status: (listItem as ReadResponse)?.status as ReadStatusEnum,
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
    content_type: MainContentTypeEnum;
};

export const useUserlistManager = ({
    listItem,
    content_type,
}: ListManagerProps) => {
    const [pendingUpdate, setPendingUpdate] = useState<MappedListItem | null>(
        null,
    );

    const debouncedUpdate = useDebounce({
        value: pendingUpdate,
        delay: 500,
    });

    const queryClient = useQueryClient();

    const { mutate: mutateCreateWatch } = useMutation({
        ...watchAddMutation(),
        onSuccess: (data, { path }) => {
            queryClient.setQueryData(
                watchGetQueryKey({ path: { slug: path.slug } }),
                data,
            );
            invalidateWatchState(queryClient);
        },
    });
    const { mutate: mutateCreateRead } = useMutation({
        ...readAddMutation(),
        onSuccess: (data, { path }) => {
            queryClient.setQueryData(
                readGetQueryKey({
                    path: { content_type: path.content_type, slug: path.slug },
                }),
                data,
            );
            invalidateReadState(queryClient);
        },
    });

    const mappedListItem = mapListItem({ listItem, content_type });

    useEffect(() => {
        setPendingUpdate(null);
    }, [mappedListItem.slug]);

    const currentScore = pendingUpdate?.score ?? mappedListItem.score;
    const currentProgress = pendingUpdate?.progress ?? mappedListItem.progress;
    const currentStatus = pendingUpdate?.status ?? mappedListItem.status;

    const updateListItem = (
        fields: Partial<Pick<MappedListItem, 'score' | 'progress' | 'status'>>,
    ) => {
        setPendingUpdate({
            slug: mappedListItem.slug,
            total: mappedListItem.total,
            extraArgs: mappedListItem.extraArgs,
            score: currentScore,
            progress: currentProgress,
            status: currentStatus,
            ...fields,
        });
    };

    const addProgress = () => {
        if (!listItem) return;

        const progress = currentProgress + 1;

        if (mappedListItem.total && progress > mappedListItem.total) return;

        let status = currentStatus;

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

        updateListItem({ progress, status });
    };

    const removeProgress = () => {
        if (!listItem) return;

        const progress = currentProgress - 1;

        if (progress < 0) return;

        updateListItem({ progress });
    };

    const setScore = (value: number) => {
        if (!listItem) return;

        updateListItem({ score: value * 2 });
    };

    useEffect(() => {
        if (!debouncedUpdate || debouncedUpdate.slug !== mappedListItem.slug) {
            return;
        }

        switch (content_type) {
            case ContentTypeEnum.ANIME:
                mutateCreateWatch({
                    path: { slug: debouncedUpdate.slug },
                    body: {
                        note: debouncedUpdate.extraArgs.note,
                        rewatches: debouncedUpdate.extraArgs.rewatches,
                        score: debouncedUpdate.score,
                        status: debouncedUpdate.status as WatchStatusEnum,
                        episodes: debouncedUpdate.progress,
                    },
                });
                break;
            case ContentTypeEnum.MANGA:
            case ContentTypeEnum.NOVEL:
                mutateCreateRead({
                    path: {
                        content_type: content_type as ReadContentTypeEnum,
                        slug: debouncedUpdate.slug,
                    },
                    body: {
                        note: debouncedUpdate.extraArgs.note,
                        rereads: debouncedUpdate.extraArgs.rereads,
                        score: debouncedUpdate.score,
                        status: debouncedUpdate.status as ReadStatusEnum,
                        chapters: debouncedUpdate.progress,
                        volumes: debouncedUpdate.extraArgs.volumes,
                    },
                });
                break;
        }
    }, [debouncedUpdate]);

    return {
        addProgress,
        removeProgress,
        setScore,
        score: currentScore,
        progress: currentProgress,
        total: pendingUpdate?.total ?? mappedListItem.total,
    };
};
