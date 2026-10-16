import type { FC } from 'react';

import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import { HistoryRow, historyRowsVariants } from '@/components/list-items';
import TextLink from '@/components/ui/text-link';
import { useTitle } from '@/services/session';
import { cn } from '@/utils/cn';
import { contentPath } from '@/utils/content-paths';
import { CONTENT_TYPES } from '@/utils/labels';

import FranchiseListButton from './components/franchise-list-button';
import FranchiseMeta from './components/franchise-meta';
import FranchisePoster from './components/franchise-poster';
import RelationLine from './components/relation-line';
import {
    chronologyMeta,
    type FranchiseModel,
    type FranchiseNode,
} from './franchise-model';
import { RELATION_GROUP_STYLES } from './relation-groups';

type Props = {
    model: FranchiseModel;
};

const ANNOUNCED = 'Анонс';

function groupByYear(model: FranchiseModel) {
    const sorted = [...model.nodes].sort(
        (a, b) =>
            (a.content.year ?? Number.MAX_SAFE_INTEGER) -
                (b.content.year ?? Number.MAX_SAFE_INTEGER) ||
            Number(a.chainIndex === null) - Number(b.chainIndex === null) ||
            a.when - b.when,
    );
    const years = new Map<string, FranchiseNode[]>();

    for (const node of sorted) {
        const key = node.content.year ? String(node.content.year) : ANNOUNCED;
        years.set(key, [...(years.get(key) ?? []), node]);
    }

    return [...years.entries()];
}

const ChronologyRow: FC<{ model: FranchiseModel; node: FranchiseNode }> = ({
    model,
    node,
}) => {
    const title = useTitle(node.content);
    const isCurrent = node === model.current;
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
            poster={<FranchisePoster content={node.content} />}
        >
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <RelationLine model={model} node={node} />
                    <TextLink
                        to={contentPath(node.contentType, node.content.slug)}
                        className="line-clamp-2 font-medium text-sm"
                    >
                        {title}
                    </TextLink>
                    <FranchiseMeta parts={chronologyMeta(node.content)} />
                </div>
                <FranchiseListButton content={node.content} size="icon-md" />
            </div>
        </HistoryRow>
    );
};

const FranchiseChronology: FC<Props> = ({ model }) => (
    <div className="flex flex-col gap-10">
        {groupByYear(model).map(([year, nodes]) => (
            <section key={year}>
                <div className="mb-4 flex items-baseline gap-2">
                    <h4>{year}</h4>
                </div>
                <div className={historyRowsVariants({ size: 'lg' })}>
                    {nodes.map((node) => (
                        <ChronologyRow
                            key={node.id}
                            model={model}
                            node={node}
                        />
                    ))}
                </div>
            </section>
        ))}
    </div>
);

export default FranchiseChronology;
