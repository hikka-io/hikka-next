import { useEffect, useRef, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    ContentTypeEnum,
    type MainContentTypeEnum,
    type ReadArgs,
    type ReadContentTypeEnum,
    type ReadResponse,
    ReadStatusEnum,
    readAddMutation,
    type WatchArgs,
    type WatchResponse,
    WatchStatusEnum,
    watchAddMutation,
} from '@hikka/api';

import useDebounce from '@/services/hooks/use-debounce';
import {
    applyReadMutation,
    applyWatchMutation,
} from '@/utils/api/invalidate-content-state';
import {
    carryOverReadArgs,
    carryOverWatchArgs,
} from '@/utils/api/tracking-args';

type MappedListItem = {
    progress: number;
    total: number | null;
    score: number | undefined;
    status: ReadStatusEnum | WatchStatusEnum | undefined;
    slug: string;
    extraArgs: Partial<WatchArgs> | Partial<ReadArgs>;
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
                extraArgs: carryOverWatchArgs(listItem as WatchResponse),
            };
        case ContentTypeEnum.MANGA:
        case ContentTypeEnum.NOVEL:
            return {
                progress: (listItem as ReadResponse)?.chapters,
                total: (listItem as ReadResponse)?.content.chapters,
                status: (listItem as ReadResponse)?.status as ReadStatusEnum,
                score: listItem?.score,
                slug: (listItem as ReadResponse)?.content.slug,
                extraArgs: carryOverReadArgs(listItem as ReadResponse),
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

    const [debouncedUpdate] = useDebounce({
        value: pendingUpdate,
        delay: 500,
    });

    const queryClient = useQueryClient();

    const { mutate: mutateCreateWatch } = useMutation({
        ...watchAddMutation(),
        onSuccess: (data) => {
            applyWatchMutation(queryClient, data);
        },
    });
    const { mutate: mutateCreateRead } = useMutation({
        ...readAddMutation(),
        onSuccess: (data) => {
            applyReadMutation(queryClient, data);
        },
    });

    const mappedListItem = mapListItem({ listItem, content_type });

    // Slug-gated: the hook survives $slug navigation, so an ungated read
    // would bleed the previous title's progress/score into the next one.
    const activePending =
        pendingUpdate?.slug === mappedListItem.slug ? pendingUpdate : null;

    const currentScore = activePending?.score ?? mappedListItem.score;
    const currentProgress = activePending?.progress ?? mappedListItem.progress;
    const currentStatus = activePending?.status ?? mappedListItem.status;

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

        let status = currentStatus;

        if (
            status === statuses[content_type][CommonStatusEnum.COMPLETED] &&
            mappedListItem.total != null &&
            progress < mappedListItem.total
        ) {
            status = statuses[content_type][CommonStatusEnum.ON_PROGRESS];
        }

        updateListItem({ progress, status });
    };

    const setScore = (value: number) => {
        if (!listItem) return;

        updateListItem({ score: value * 2 });
    };

    const sentRef = useRef<MappedListItem | null>(null);

    useEffect(() => {
        if (
            !debouncedUpdate ||
            debouncedUpdate === sentRef.current ||
            debouncedUpdate.slug !== mappedListItem.slug
        ) {
            return;
        }
        sentRef.current = debouncedUpdate;

        switch (content_type) {
            case ContentTypeEnum.ANIME:
                mutateCreateWatch({
                    path: { slug: debouncedUpdate.slug },
                    body: {
                        ...debouncedUpdate.extraArgs,
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
                        ...debouncedUpdate.extraArgs,
                        score: debouncedUpdate.score,
                        status: debouncedUpdate.status as ReadStatusEnum,
                        chapters: debouncedUpdate.progress,
                    },
                });
                break;
        }
    }, [
        debouncedUpdate,
        content_type,
        mappedListItem.slug,
        mutateCreateRead,
        mutateCreateWatch,
    ]);

    return {
        addProgress,
        removeProgress,
        setScore,
        score: currentScore,
        progress: currentProgress,
        total: mappedListItem.total,
    };
};
