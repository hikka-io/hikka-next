import { type FC, useState } from 'react';

import { ArrowUpRight, Link2, X } from 'lucide-react';
import { toast } from 'sonner';

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
    type FranchiseModel,
    type FranchiseNode,
    relationPath,
} from '../franchise-model';
import GraphIconButton from './graph-icon-button';

const PATH_PREVIEW_ROWS = 2;

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

const CopyLinkButton: FC<{ node: FranchiseNode }> = ({ node }) => {
    const copy = () => {
        const url = new URL(window.location.pathname, window.location.origin);
        url.searchParams.set('graph', 'true');
        url.searchParams.set('focus', node.content.slug);

        navigator.clipboard
            .writeText(url.toString())
            .then(() => toast.success('Посилання скопійовано'))
            .catch(() => toast.error('Не вдалося скопіювати посилання'));
    };

    return (
        <GraphIconButton label="Копіювати посилання" onClick={copy}>
            <Link2 />
        </GraphIconButton>
    );
};

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

const GraphPath: FC<Omit<NodeProps, 'node'> & { path: FranchiseNode[] }> = ({
    model,
    path,
    onSelect,
}) => {
    const [open, setOpen] = useState(false);
    const rows = open ? path : path.slice(0, PATH_PREVIEW_ROWS);

    return (
        <Collapsible
            open={open}
            onOpenChange={setOpen}
            className="flex flex-col gap-4"
        >
            <div className={historyRowsVariants()}>
                {rows.map((step) => (
                    <ChronologyRow
                        key={step.id}
                        node={step}
                        isCurrent={step === model.current}
                        label={
                            <GraphRelation
                                model={model}
                                node={step}
                                onSelect={onSelect}
                            />
                        }
                        facts={basicMeta(step.content)}
                    />
                ))}
            </div>
            {path.length > PATH_PREVIEW_ROWS && (
                <ShowMoreTrigger count={path.length - PATH_PREVIEW_ROWS} />
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

    const path = relationPath(model, node.id, model.current.id).slice(1);

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
                <CopyLinkButton node={node} />
                <OpenPageButton node={node} />
            </div>
            {path.length > 0 && (
                <>
                    <Separator className="-mx-4 w-auto" />
                    <GraphPath model={model} path={path} onSelect={onSelect} />
                </>
            )}
        </>
    );
};

export default GraphDetails;
