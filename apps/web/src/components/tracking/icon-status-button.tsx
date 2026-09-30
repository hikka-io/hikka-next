import type * as React from 'react';
import { createElement, type FC } from 'react';

import {
    ContentTypeEnum,
    type MainContentTypeEnum,
    type Options,
    type ReadAddData,
    type ReadResponseBase,
    ReadStatusEnum,
    type WatchAddData,
    type WatchResponse,
    type WatchResponseBase,
    WatchStatusEnum,
} from '@hikka/api';

import { LIST_STATUS_ICONS } from '@/components/icons/list-status-icons';
import { Button, type ButtonProps } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { cn } from '@/utils/cn';

import { useAddRead, useAddWatch } from './use-tracking-mutations';

type Props = Omit<ButtonProps, 'content'> & {
    contentType: MainContentTypeEnum;
    entry?: WatchResponse | WatchResponseBase | ReadResponseBase;
    content?: object;
    disabled?: boolean;
    size?: 'icon-sm' | 'icon-md';
    slug: string;
    isLoading?: boolean;
    onOpenModal?: () => void;
};

type AddMutation = {
    mutate(variables: Options<WatchAddData> | Options<ReadAddData>): void;
};

// Keep the hook-named property: the React Compiler memoizes `MAP[kind]()` as a plain call.
const ADD_MUTATIONS: Record<
    keyof typeof LIST_STATUS_ICONS,
    { useAdd: () => AddMutation }
> = {
    watch: { useAdd: useAddWatch },
    read: { useAdd: useAddRead },
};

const TRACKED_CLASS_NAMES: Record<
    keyof typeof LIST_STATUS_ICONS,
    string | undefined
> = {
    watch: undefined,
    read: 'border',
};

const IconStatusButton: FC<Props> = ({
    contentType,
    entry,
    disabled,
    size,
    slug,
    content,
    isLoading,
    onOpenModal,
    ...props
}) => {
    const kind = contentType === ContentTypeEnum.ANIME ? 'watch' : 'read';
    const { mutate: addEntry } = ADD_MUTATIONS[kind].useAdd();

    const handleAddToPlanned = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addEntry(
            contentType === ContentTypeEnum.ANIME
                ? {
                      path: { slug },
                      body: {
                          status: WatchStatusEnum.PLANNED,
                      },
                  }
                : {
                      path: { content_type: contentType, slug },
                      body: {
                          status: ReadStatusEnum.PLANNED,
                      },
                  },
        );
    };

    const openEditModal = () => {
        if (content && onOpenModal) {
            onOpenModal();
        }
    };

    const StatusIcon = entry
        ? LIST_STATUS_ICONS[kind][
              entry.status as keyof (typeof LIST_STATUS_ICONS)[typeof kind]
          ]
        : null;

    if (!entry || !StatusIcon) {
        return (
            <Button
                size={size}
                variant="secondary"
                disabled={disabled}
                onClick={handleAddToPlanned}
                {...props}
            >
                {createElement(LIST_STATUS_ICONS[kind].planned)}
            </Button>
        );
    }

    return (
        <Button
            size={size}
            variant="secondary"
            disabled={disabled}
            onClick={openEditModal}
            className={cn(
                TRACKED_CLASS_NAMES[kind],
                `bg-${entry.status} text-${entry.status}-foreground border-${entry.status}-border`,
            )}
            {...props}
        >
            {isLoading ? <Spinner /> : createElement(StatusIcon)}
        </Button>
    );
};

export default IconStatusButton;
