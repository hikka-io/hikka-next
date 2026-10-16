import type { FC } from 'react';

import TextLink from '@/components/ui/text-link';
import { useTitle } from '@/services/session';
import { cn } from '@/utils/cn';
import { contentPath } from '@/utils/content-paths';

import { basicMeta, type DirectRelation } from '../franchise-model';
import { RELATION_GROUP_STYLES } from '../relation-groups';
import FranchiseListButton from './franchise-list-button';
import FranchiseMeta from './franchise-meta';
import FranchisePoster from './franchise-poster';

type Props = {
    relation: DirectRelation;
};

const FranchiseRow: FC<Props> = ({ relation: { node, label, group } }) => {
    const title = useTitle(node.content);

    return (
        <div className="flex items-center gap-3">
            <FranchisePoster content={node.content} className="w-10 shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span
                    className={cn(
                        'truncate font-medium text-xs leading-4',
                        RELATION_GROUP_STYLES[group].text,
                    )}
                >
                    {label}
                </span>
                <TextLink
                    to={contentPath(node.contentType, node.content.slug)}
                    className="line-clamp-2 font-medium text-sm leading-tight"
                >
                    {title}
                </TextLink>
                <FranchiseMeta parts={basicMeta(node.content)} />
            </div>
            <FranchiseListButton content={node.content} size="icon-sm" />
        </div>
    );
};

export default FranchiseRow;
