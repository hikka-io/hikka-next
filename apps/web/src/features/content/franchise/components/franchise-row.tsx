import type { FC, ReactNode } from 'react';

import { HistoryFacts } from '@/components/list-items';
import TextLink from '@/components/ui/text-link';
import { useTitle } from '@/services/session';
import { cn } from '@/utils/cn';
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
        <div className={cn('flex items-center gap-3', className)}>
            <FranchisePoster content={content} className="w-10 shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                {label}
                <TextLink
                    to={contentPath(content.data_type, content.slug)}
                    className="line-clamp-2 font-medium text-sm leading-tight"
                >
                    {title}
                </TextLink>
                <HistoryFacts facts={basicMeta(content)} />
            </div>
            <FranchiseListButton content={content} size="icon-sm" />
            {action}
        </div>
    );
};

export default FranchiseRow;
