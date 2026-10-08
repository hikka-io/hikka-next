import type * as React from 'react';
import { createElement, type FC } from 'react';

import {
    ContentTypeEnum,
    type MainContentTypeEnum,
    type Options,
    type ReadAddData,
    ReadStatusEnum,
    type WatchAddData,
    WatchStatusEnum,
} from '@hikka/api';

import { LIST_STATUS_ICONS } from '@/components/icons/list-status-icons';
import MaterialSymbolsArrowDropDownRounded from '@/components/icons/material-symbols/MaterialSymbolsArrowDropDownRounded';
import { Button } from '@/components/ui/button';
import { SelectTrigger } from '@/components/ui/select';
import Spinner from '@/components/ui/spinner';
import { cn } from '@/utils/cn';

import { useAddRead, useAddWatch } from './use-tracking-mutations';

type Props = {
    disabled?: boolean;
    slug: string;
    contentType: MainContentTypeEnum;
    size?: 'sm' | 'md';
    isLoading?: boolean;
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

const NewStatusTrigger: FC<Props> = ({
    disabled,
    slug,
    contentType,
    size,
    isLoading,
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

    return (
        <SelectTrigger
            asChild
            className="gap-0 border-none p-0"
            onSelect={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <div className="flex w-full">
                <Button
                    variant="secondary"
                    size={size}
                    disabled={disabled}
                    onClick={handleAddToPlanned}
                    className={cn(
                        'flex-1 flex-nowrap overflow-hidden rounded-r-none',
                    )}
                >
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <div
                            className={cn(
                                'rounded-sm border border-secondary-foreground/20 p-1',
                            )}
                        >
                            {createElement(LIST_STATUS_ICONS[kind].planned, {
                                className: 'size-3!',
                            })}
                        </div>
                    )}
                    <span className="truncate rounded-none">
                        Додати у список
                    </span>
                </Button>
                <Button
                    variant="secondary"
                    size={size ? `icon-${size}` : 'icon'}
                    type="button"
                    disabled={disabled}
                    className={cn('rounded-l-none text-xl')}
                >
                    <MaterialSymbolsArrowDropDownRounded />
                </Button>
            </div>
        </SelectTrigger>
    );
};

export default NewStatusTrigger;
