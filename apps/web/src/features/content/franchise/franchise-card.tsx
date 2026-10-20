import type { FC } from 'react';

import { range } from '@antfu/utils';
import { Share2 } from 'lucide-react';

import type { MainContentTypeEnum } from '@hikka/api';
import { contentPath } from '@hikka/core';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Header, HeaderActions, HeaderTitle } from '@/components/ui/header';
import { labelVariants } from '@/components/ui/label';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useVisibleOnce } from '@/services/hooks/use-visible-once';

import FranchiseRow from './components/franchise-row';
import RelationLabel from './components/relation-label';
import ShowMoreTrigger from './components/show-more-trigger';
import type { DirectRelation, FranchiseModel } from './franchise-model';
import { useFranchise } from './use-franchise';
import { useGraphOverlay } from './use-graph-overlay';

type Props = {
    content_type: MainContentTypeEnum;
    slug: string;
    className?: string;
};

const PREVIEW_ROWS = 2;

const FranchiseCardSkeleton: FC = () => (
    <div className="flex flex-col gap-4">
        {range(0, PREVIEW_ROWS).map((index) => (
            <div key={index} className="flex items-center gap-4">
                <PosterCardSkeleton
                    hasTitle={false}
                    className="w-12 shrink-0"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <SkeletonText
                        className="text-xs leading-4"
                        barClassName="w-16 rounded"
                    />
                    <SkeletonText
                        className={labelVariants()}
                        barClassName="rounded"
                    />
                    <SkeletonText
                        className="text-xs"
                        barClassName="w-24 rounded"
                    />
                </div>
                <Skeleton className="size-8 shrink-0" />
            </div>
        ))}
    </div>
);

const DirectRow: FC<{ relation: DirectRelation }> = ({ relation }) => (
    <FranchiseRow
        content={relation.node.content}
        label={
            <RelationLabel group={relation.group}>
                <span className="truncate">{relation.label}</span>
            </RelationLabel>
        }
    />
);

const FranchiseCardBody: FC<{ model: FranchiseModel }> = ({ model }) => {
    const preview = model.direct.slice(0, PREVIEW_ROWS);
    const rest = model.direct.slice(PREVIEW_ROWS);

    return (
        <Collapsible className="flex flex-col gap-4">
            {preview.map((entry) => (
                <DirectRow key={entry.node.id} relation={entry} />
            ))}
            {rest.length > 0 && (
                <>
                    <CollapsibleContent className="flex flex-col gap-4">
                        {rest.map((entry) => (
                            <DirectRow key={entry.node.id} relation={entry} />
                        ))}
                    </CollapsibleContent>
                    <ShowMoreTrigger count={rest.length} />
                </>
            )}
        </Collapsible>
    );
};

const FranchiseCard: FC<Props> = ({ content_type, slug, className }) => {
    const { ref, visible } = useVisibleOnce();
    const { data: model, isPending } = useFranchise(
        content_type,
        slug,
        visible,
    );
    const [, setGraphOpen] = useGraphOverlay();

    if (!isPending && !model?.direct.length) {
        return null;
    }

    const href = `${contentPath(content_type, slug)}/franchise`;

    return (
        <Block
            variant="card"
            ref={ref}
            id="content-franchise"
            className={className}
        >
            <Header>
                <HeaderTitle to={href}>Франшиза</HeaderTitle>
                <HeaderActions>
                    <Tooltip>
                        <TooltipTrigger
                            render={
                                <Button
                                    size="icon-sm"
                                    variant="outline"
                                    aria-label="Граф франшизи"
                                    onClick={() => setGraphOpen(true)}
                                />
                            }
                        >
                            <Share2 className="rotate-90" />
                        </TooltipTrigger>
                        <TooltipContent>Граф франшизи</TooltipContent>
                    </Tooltip>
                </HeaderActions>
            </Header>
            {model ? (
                <FranchiseCardBody model={model} />
            ) : (
                <FranchiseCardSkeleton />
            )}
        </Block>
    );
};

export default FranchiseCard;
