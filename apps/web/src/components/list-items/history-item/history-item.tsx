import type { FC } from 'react';

import { type HistoryResponse, HistoryTypeEnum } from '@hikka/api';

import { labelVariants } from '@/components/ui/label';
import TextLink from '@/components/ui/text-link';
import { useTitle } from '@/services/session';
import { cn } from '@/utils/cn';
import { contentPath } from '@/utils/content-paths';

import { convertHistory } from './convert-history';
import { formatHistoryTime } from './history-dates';
import HistoryFacts from './history-facts';
import HistoryNode from './history-node';
import HistoryPoster from './history-poster';
import { HISTORY_ROW_LINE } from './history-variants';

type Props = {
    data: HistoryResponse;
    posterClassName: string;
    mainFactOnly?: boolean;
    withUser?: boolean;
    timeZone?: string;
};

const IMPORT_TITLES: Partial<Record<HistoryTypeEnum, string>> = {
    [HistoryTypeEnum.WATCH_IMPORT]: 'Імпорт аніме',
    [HistoryTypeEnum.READ_IMPORT]: 'Імпорт манґи та ранобе',
};

const HistoryItem: FC<Props> = ({
    data,
    posterClassName,
    mainFactOnly,
    withUser,
    timeZone,
}) => {
    const title = useTitle(data.content);
    const entry = convertHistory(data, timeZone);
    const facts = mainFactOnly ? entry.facts.slice(0, 1) : entry.facts;

    return (
        <div className={cn('flex items-start gap-4', HISTORY_ROW_LINE)}>
            <div className="flex shrink-0 items-center gap-3">
                <HistoryNode
                    entry={entry}
                    user={withUser ? data.user : undefined}
                />
                <HistoryPoster
                    content={data.content}
                    medium={entry.medium}
                    deleted={entry.icon.kind === 'delete'}
                    className={posterClassName}
                />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 self-stretch">
                <div className="flex items-baseline gap-3">
                    <TextLink
                        to={
                            data.content
                                ? contentPath(
                                      data.content.data_type,
                                      data.content.slug,
                                  )
                                : undefined
                        }
                        className={cn(labelVariants(), 'min-w-0 truncate')}
                    >
                        {title ||
                            IMPORT_TITLES[data.history_type] ||
                            'Загальне'}
                    </TextLink>
                    <time
                        dateTime={new Date(data.created * 1000).toISOString()}
                        className="ml-auto shrink-0 text-muted-foreground text-xs tabular-nums opacity-60"
                        suppressHydrationWarning
                    >
                        {formatHistoryTime(data.created, timeZone)}
                    </time>
                </div>
                <HistoryFacts
                    facts={facts}
                    lead={
                        withUser && (
                            <TextLink
                                to={`/u/${data.user.username}`}
                                className="font-medium text-foreground"
                            >
                                {data.user.username}
                            </TextLink>
                        )
                    }
                />
            </div>
        </div>
    );
};

export default HistoryItem;
