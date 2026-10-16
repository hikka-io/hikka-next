import type { FC, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import type { RelationGroupEnum } from '../franchise-model';
import { RELATION_GROUP_STYLES } from '../relation-groups';

type Props = {
    group: RelationGroupEnum;
    children: ReactNode;
    className?: string;
};

const RelationLabel: FC<Props> = ({ group, children, className }) => (
    <span
        className={cn(
            'flex min-w-0 items-baseline whitespace-pre font-medium text-xs leading-4',
            RELATION_GROUP_STYLES[group].text,
            className,
        )}
    >
        {children}
    </span>
);

export default RelationLabel;
