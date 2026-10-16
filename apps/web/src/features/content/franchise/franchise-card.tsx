import type { FC } from 'react';

import { range } from '@antfu/utils';
import { ChevronDown, Share2 } from 'lucide-react';

import type { MainContentTypeEnum } from '@hikka/api';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { labelVariants } from '@/components/ui/label';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { useVisibleOnce } from '@/services/hooks/use-visible-once';
import { contentPath } from '@/utils/content-paths';
import { Link } from '@/utils/navigation';

import FranchiseRow from './components/franchise-row';
import RelationLabel from './components/relation-label';
import type { DirectRelation, FranchiseModel } from './franchise-model';
import { useFranchise } from './use-franchise';

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
                    <CollapsibleTrigger
                        render={
                            <Button
                                variant="ghost"
                                size="md"
                                className="group w-full text-muted-foreground"
                            />
                        }
                    >
                        <ChevronDown className="group-data-panel-open:rotate-180" />
                        <span className="group-data-panel-open:hidden">
                            Показати ще {rest.length}
                        </span>
                        <span className="hidden group-data-panel-open:inline">
                            Згорнути
                        </span>
                    </CollapsibleTrigger>
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

    if (!isPending && !model?.direct.length) {
        return null;
    }

    const href = `${contentPath(content_type, slug)}/franchise`;

    return (
        <Card ref={ref} id="content-franchise" className={className}>
            <Header href={href}>
                <HeaderContainer>
                    <HeaderTitle variant="h4">Франшиза</HeaderTitle>
                    <Button
                        size="icon-sm"
                        variant="outline"
                        aria-label="Граф франшизи"
                        render={<Link to={href} search={{ view: 'graph' }} />}
                    >
                        <Share2 />
                    </Button>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            {model ? (
                <FranchiseCardBody model={model} />
            ) : (
                <FranchiseCardSkeleton />
            )}
        </Card>
    );
};

export default FranchiseCard;
