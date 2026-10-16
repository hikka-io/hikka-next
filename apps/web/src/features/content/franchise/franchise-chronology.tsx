import type { FC } from 'react';

import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import {
    HistoryFacts,
    HistoryRow,
    historyRowsVariants,
} from '@/components/list-items';
import { labelVariants } from '@/components/ui/label';
import TextLink from '@/components/ui/text-link';
import { useTitle } from '@/services/session';
import { cn } from '@/utils/cn';
import { contentPath } from '@/utils/content-paths';
import { CONTENT_TYPES } from '@/utils/labels';

import FranchiseListButton from './components/franchise-list-button';
import FranchisePoster from './components/franchise-poster';
import RelationLine from './components/relation-line';
import {
    chronologyMeta,
    type FranchiseModel,
    type FranchiseNode,
    groupByYear,
} from './franchise-model';
import { RELATION_GROUP_STYLES } from './relation-groups';

type Props = {
    model: FranchiseModel;
};

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
                        className={cn(labelVariants(), 'line-clamp-2')}
                    >
                        {title}
                    </TextLink>
                    <HistoryFacts
                        facts={chronologyMeta(node.content)}
                        className="md:text-sm"
                    />
                </div>
                <FranchiseListButton content={node.content} size="icon-md" />
            </div>
        </HistoryRow>
    );
};

const FranchiseChronology: FC<Props> = ({ model }) => (
    <div className="flex flex-col gap-10">
        {groupByYear(model.nodes)
            .reverse()
            .map(({ label, nodes }) => (
                <section key={label}>
                    <h4 className="mb-4">{label}</h4>
                    <div className={historyRowsVariants({ size: 'lg' })}>
                        {[...nodes]
                            .reverse()
                            .sort(
                                (a, b) =>
                                    Number(a.chainIndex === null) -
                                    Number(b.chainIndex === null),
                            )
                            .map((node) => (
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
