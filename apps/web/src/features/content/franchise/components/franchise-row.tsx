import type { FC, ReactNode } from 'react';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import { HistoryFacts } from '@/components/list-items';
import { useTitle } from '@/services/session';
import { contentPath } from '@/utils/content-paths';

import { basicMeta, type FranchiseContent } from '../franchise-model';
import FranchiseListButton from './franchise-list-button';
import FranchisePoster from './franchise-poster';

type Props = {
    content: FranchiseContent;
    label: ReactNode;
    action?: ReactNode;
    className?: string;
};

const FranchiseRow: FC<Props> = ({ content, label, action, className }) => {
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
            <FranchiseListButton content={content} size="icon-sm" />
            {action}
        </HorizontalCard>
    );
};

export default FranchiseRow;
