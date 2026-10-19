import type { FC, ReactNode } from 'react';

import { CONTENT_TYPES } from '@hikka/core';

import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import {
    type HistoryFact,
    HistoryFacts,
    HistoryRow,
} from '@/components/list-items';
import { labelVariants } from '@/components/ui/label';
import TextLink from '@/components/ui/text-link';
import { useTitle } from '@/services/session';
import { cn } from '@/utils/cn';
import { contentPath } from '@/utils/content-paths';

import type { FranchiseNode } from '../franchise-model';
import { RELATION_GROUP_STYLES } from '../relation-groups';
import FranchisePoster from './franchise-poster';

type Props = {
    node: FranchiseNode;
    isCurrent: boolean;
    label: ReactNode;
    facts: HistoryFact[];
    size?: 'default' | 'lg';
    withStatus?: boolean;
    action?: ReactNode;
};

const ChronologyRow: FC<Props> = ({
    node,
    isCurrent,
    label,
    facts,
    size = 'default',
    withStatus,
    action,
}) => {
    const title = useTitle(node.content);
    const style = RELATION_GROUP_STYLES[node.group];
    const Icon = CONTENT_TYPE_ICONS[node.contentType];

    return (
        <HistoryRow
            node={
                <span
                    title={
                        isCurrent
                            ? 'Цей тайтл'
                            : CONTENT_TYPES[node.contentType].title_ua
                    }
                    className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-md',
                        isCurrent ? cn(style.solid, 'text-card') : style.tile,
                    )}
                >
                    <Icon className="size-4" />
                </span>
            }
            poster={
                <FranchisePoster
                    content={node.content}
                    withStatus={withStatus}
                />
            }
        >
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    {label}
                    <TextLink
                        to={contentPath(node.contentType, node.content.slug)}
                        className={cn(labelVariants(), 'line-clamp-2')}
                    >
                        {title}
                    </TextLink>
                    <HistoryFacts
                        facts={facts}
                        className={cn(size === 'lg' && 'md:text-sm')}
                    />
                </div>
                {action}
            </div>
        </HistoryRow>
    );
};

export default ChronologyRow;
