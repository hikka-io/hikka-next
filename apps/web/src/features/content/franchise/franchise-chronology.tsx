import type { FC } from 'react';

import type { MainContentTypeEnum } from '@hikka/api';

import { historyRowsVariants } from '@/components/list-items';
import type { FranchiseOrder } from '@/utils/search-schemas';

import ChronologyRow from './components/chronology-row';
import FranchiseListButton from './components/franchise-list-button';
import RelationLine from './components/relation-line';
import {
    chronologyMeta,
    type FranchiseModel,
    groupByYear,
} from './franchise-model';

type Props = {
    model: FranchiseModel;
    order: FranchiseOrder;
    types: MainContentTypeEnum[];
};

const inOrder = <T,>(items: T[], order: FranchiseOrder) =>
    order === 'desc' ? [...items].reverse() : items;

const FranchiseChronology: FC<Props> = ({ model, order, types }) => {
    const visible = model.nodes.filter((node) =>
        types.includes(node.contentType),
    );

    return (
        <div className="flex flex-col gap-10">
            {inOrder(groupByYear(visible), order).map(({ label, nodes }) => (
                <section key={label}>
                    <h3 className="mb-4 font-semibold text-base">{label}</h3>
                    <div className={historyRowsVariants({ size: 'lg' })}>
                        {[...inOrder(nodes, order)]
                            .sort(
                                (a, b) =>
                                    Number(a.chainIndex === null) -
                                    Number(b.chainIndex === null),
                            )
                            .map((node) => (
                                <ChronologyRow
                                    key={node.id}
                                    node={node}
                                    isCurrent={node === model.current}
                                    label={
                                        <RelationLine
                                            model={model}
                                            node={node}
                                        />
                                    }
                                    facts={chronologyMeta(node.content)}
                                    size="lg"
                                    action={
                                        <FranchiseListButton
                                            content={node.content}
                                            size="icon-md"
                                        />
                                    }
                                />
                            ))}
                    </div>
                </section>
            ))}
        </div>
    );
};

export default FranchiseChronology;
