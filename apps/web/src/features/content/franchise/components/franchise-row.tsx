import type { FC, ReactNode } from 'react';

import { contentPath } from '@hikka/core';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import { HistoryFacts } from '@/components/list-items';
import { useTitle } from '@/services/session';

import { basicMeta, type FranchiseContent } from '../franchise-model';
import FranchiseListButton from './franchise-list-button';
import FranchisePoster from './franchise-poster';

type Props = {
    content: FranchiseContent;
    label: ReactNode;
    action?: ReactNode;
    listSize?: 'icon-sm' | 'icon-md';
    className?: string;
};

const FranchiseRow: FC<Props> = ({
    content,
    label,
    action,
    listSize = 'icon-sm',
    className,
}) => {
    const title = useTitle(content);

    return (
        <HorizontalCard className={className}>
            <FranchisePoster content={content} className="w-12 shrink-0" />
            <HorizontalCardContainer className="gap-1">
                {label}
                <HorizontalCardTitle
                    to={contentPath(content.data_type, content.slug)}
                >
                    {title}
                </HorizontalCardTitle>
                <HistoryFacts facts={basicMeta(content)} />
            </HorizontalCardContainer>
            <FranchiseListButton content={content} size={listSize} />
            {action}
        </HorizontalCard>
    );
};

export default FranchiseRow;
