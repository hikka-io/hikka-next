import { createElement, type FC } from 'react';

import {
    ContentTypeEnum,
    type ReadContentTypeEnum,
    type ReadResponseBase,
    type WatchResponse,
    type WatchResponseBase,
} from '@hikka/api';

import { LIST_STATUS_ICONS } from '@/components/icons/list-status-icons';
import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import { Button } from '@/components/ui/button';
import { SelectTrigger } from '@/components/ui/select';
import Spinner from '@/components/ui/spinner';
import { cn } from '@/utils/cn';
import { LIST_STATUS } from '@/utils/labels/enum-labels';

type Props = {
    disabled?: boolean;
    size?: 'sm' | 'md';
    isLoading?: boolean;
    onOpenModal?: () => void;
} & (
    | {
          contentType: typeof ContentTypeEnum.ANIME;
          entry: WatchResponse | WatchResponseBase;
      }
    | {
          contentType: ReadContentTypeEnum;
          entry: ReadResponseBase;
      }
);

const SELECT_TRIGGER_CLASS_NAMES: Record<
    keyof typeof LIST_STATUS,
    string | undefined
> = {
    watch: undefined,
    read: 'gap-0 border-none p-0',
};

const StatusTrigger: FC<Props> = ({
    contentType,
    entry,
    disabled,
    size,
    isLoading,
    onOpenModal,
}) => {
    const kind = contentType === ContentTypeEnum.ANIME ? 'watch' : 'read';
    const statusKey = entry.status as keyof (typeof LIST_STATUS)[typeof kind];
    const entryStatus = LIST_STATUS[kind][statusKey];

    return (
        <SelectTrigger asChild className={SELECT_TRIGGER_CLASS_NAMES[kind]}>
            <div className="flex w-full">
                <Button
                    size={size}
                    variant="secondary"
                    disabled={disabled}
                    className={cn(
                        'flex-1 flex-nowrap overflow-hidden rounded-r-none border border-r-0',
                        `bg-${entry.status} text-${entry.status}-foreground border-${entry.status}-border`,
                    )}
                >
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <div
                            className={cn(
                                'rounded-sm border p-1',
                                `bg-${entry.status} text-${entry.status}-foreground border-${entry.status}-border`,
                            )}
                        >
                            {createElement(LIST_STATUS_ICONS[kind][statusKey], {
                                className: 'size-3!',
                            })}
                        </div>
                    )}
                    <span className="truncate rounded-none">
                        {entryStatus.title_ua || entryStatus.title_en}
                    </span>
                    {entry.score > 0 && (
                        <>
                            <span className="opacity-60">-</span>
                            <span className="opacity-60">{entry.score}</span>
                        </>
                    )}
                </Button>
                <Button
                    variant="secondary"
                    size={size ? `icon-${size}` : 'icon'}
                    type="button"
                    onClick={onOpenModal}
                    disabled={disabled}
                    className={cn(
                        'rounded-l-none border border-l-0',
                        `bg-${entry.status} text-${entry.status}-foreground border-${entry.status}-border`,
                    )}
                >
                    <MaterialSymbolsSettingsOutlineRounded />
                </Button>
            </div>
        </SelectTrigger>
    );
};

export default StatusTrigger;
