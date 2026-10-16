import type { FC, ReactNode } from 'react';

import { useTitle } from '@/services/session';
import { cn } from '@/utils/cn';
import { contentPath } from '@/utils/content-paths';
import { Link } from '@/utils/navigation';

import {
    type FranchiseModel,
    type FranchiseNode,
    relationText,
} from '../franchise-model';
import RelationLabel from './relation-label';

const LINK_CLASS =
    'min-w-0 truncate underline decoration-1 underline-offset-3 transition-colors hover:text-foreground';

type Props = {
    model: FranchiseModel;
    node: FranchiseNode;
    onSelect?: (id: string) => void;
    suffix?: ReactNode;
    className?: string;
};

const RelationTarget: FC<{
    target: FranchiseNode;
    onSelect?: (id: string) => void;
}> = ({ target, onSelect }) => {
    const title = useTitle(target.content);

    if (onSelect) {
        return (
            <button
                type="button"
                className={cn(LINK_CLASS, 'cursor-pointer')}
                onClick={() => onSelect(target.id)}
            >
                {title}
            </button>
        );
    }

    return (
        <Link
            to={contentPath(target.contentType, target.content.slug)}
            className={LINK_CLASS}
        >
            {title}
        </Link>
    );
};

const RelationLine: FC<Props> = ({
    model,
    node,
    onSelect,
    suffix,
    className,
}) => {
    const target =
        node.chainIndex === null && node.relation?.targetId
            ? model.byId.get(node.relation.targetId)
            : undefined;
    const kind = node.relation?.targetKind;

    return (
        <RelationLabel group={node.group} className={className}>
            <span className={cn(target ? 'shrink-0' : 'truncate')}>
                {relationText(model, node)}
                {target && ` до ${kind ? `${kind} ` : ''}`}
            </span>
            {target && <RelationTarget target={target} onSelect={onSelect} />}
            {suffix && <span className="shrink-0">{suffix}</span>}
        </RelationLabel>
    );
};

export default RelationLine;
