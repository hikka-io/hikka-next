import { type FC, useState } from 'react';

import { ArrowUpRight, X } from 'lucide-react';

import { HistoryFacts, historyRowsVariants } from '@/components/list-items';
import { Collapsible } from '@/components/ui/collapsible';
import { labelVariants } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import TextLink from '@/components/ui/text-link';
import { useTitle } from '@/services/session';
import { cn } from '@/utils/cn';
import { contentPath } from '@/utils/content-paths';
import { Link } from '@/utils/navigation';

import ChronologyRow from '../components/chronology-row';
import FranchiseListButton from '../components/franchise-list-button';
import FranchisePoster from '../components/franchise-poster';
import FranchiseRow from '../components/franchise-row';
import RelationLabel from '../components/relation-label';
import RelationLine from '../components/relation-line';
import ShowMoreTrigger from '../components/show-more-trigger';
import {
    basicMeta,
    type DirectRelation,
    type FranchiseModel,
    type FranchiseNode,
} from '../franchise-model';
import GraphIconButton from './graph-icon-button';

const PREVIEW_ROWS = 2;

type Props = {
    model: FranchiseModel;
    node: FranchiseNode;
    variant: 'panel' | 'peek';
    onSelect: (id: string) => void;
    onClose?: () => void;
};

type NodeProps = Pick<Props, 'model' | 'node' | 'onSelect'>;

export const OpenPageButton: FC<{ node: FranchiseNode }> = ({ node }) => (
    <GraphIconButton
        label="До сторінки"
        render={<Link to={contentPath(node.contentType, node.content.slug)} />}
    >
        <ArrowUpRight />
    </GraphIconButton>
);

export const CloseSelectionButton: FC<{
    onClose: () => void;
    className?: string;
}> = ({ onClose, className }) => (
    <GraphIconButton
        label="Зняти вибір"
        variant="ghost"
        size="icon-sm"
        onClick={onClose}
        className={cn('shrink-0 text-muted-foreground', className)}
    >
        <X />
    </GraphIconButton>
);

const GraphRelation: FC<NodeProps> = ({ model, node, onSelect }) =>
    node === model.current ? (
        <RelationLabel group="sequel">
            <span className="truncate">Цей тайтл</span>
        </RelationLabel>
    ) : (
        <RelationLine model={model} node={node} onSelect={onSelect} />
    );

const GraphRelations: FC<{
    model: FranchiseModel;
    relations: DirectRelation[];
}> = ({ model, relations }) => {
    const [open, setOpen] = useState(false);
    const rows = open ? relations : relations.slice(0, PREVIEW_ROWS);

    return (
        <Collapsible
            open={open}
            onOpenChange={setOpen}
            className="flex flex-col gap-4"
        >
            <div className={historyRowsVariants()}>
                {rows.map((relation) => (
                    <ChronologyRow
                        key={relation.node.id}
                        node={relation.node}
                        isCurrent={relation.node === model.current}
                        label={
                            <RelationLabel group={relation.group}>
                                <span className="truncate">
                                    {relation.label}
                                </span>
                            </RelationLabel>
                        }
                        facts={basicMeta(relation.node.content)}
                    />
                ))}
            </div>
            {relations.length > PREVIEW_ROWS && (
                <ShowMoreTrigger count={relations.length - PREVIEW_ROWS} />
            )}
        </Collapsible>
    );
};

const GraphDetails: FC<Props> = ({
    model,
    node,
    variant,
    onSelect,
    onClose,
}) => {
    const title = useTitle(node.content);
    const relation = (
        <GraphRelation model={model} node={node} onSelect={onSelect} />
    );

    if (variant === 'peek') {
        return (
            <FranchiseRow
                content={node.content}
                label={relation}
                listSize="icon-md"
                action={<OpenPageButton node={node} />}
            />
        );
    }

    const relations = model.relations.get(node.id) ?? [];

    return (
        <>
            <div className="flex gap-3">
                <FranchisePoster
                    content={node.content}
                    className="w-14 shrink-0"
                />
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                    {relation}
                    <TextLink
                        to={contentPath(node.contentType, node.content.slug)}
                        className={cn(labelVariants(), 'line-clamp-2')}
                    >
                        {title}
                    </TextLink>
                    <HistoryFacts facts={basicMeta(node.content)} />
                </div>
                {onClose && (
                    <CloseSelectionButton
                        onClose={onClose}
                        className="-mt-1 -mr-1"
                    />
                )}
            </div>
            <div className="flex gap-2">
                <div className="min-w-0 flex-1">
                    <FranchiseListButton content={node.content} size="md" />
                </div>
                <OpenPageButton node={node} />
            </div>
            {relations.length > 0 && (
                <>
                    <Separator className="-mx-4 w-auto" />
                    <GraphRelations model={model} relations={relations} />
                </>
            )}
        </>
    );
};

export default GraphDetails;
