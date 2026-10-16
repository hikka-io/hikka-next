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
import { RELATION_GROUP_STYLES } from '../relation-groups';

const LINK_CLASS =
    'underline decoration-1 underline-offset-3 transition-colors hover:text-foreground';

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

    return (
        <span
            className={cn(
                'truncate font-medium text-xs leading-4',
                RELATION_GROUP_STYLES[node.group].text,
                className,
            )}
        >
            {relationText(model, node)}
            {target && (
                <>
                    {' до '}
                    {node.relation?.targetKind &&
                        `${node.relation.targetKind} `}
                    <RelationTarget target={target} onSelect={onSelect} />
                </>
            )}
            {suffix}
        </span>
    );
};

export default RelationLine;
