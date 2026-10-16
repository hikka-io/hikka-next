import { type FC, useState } from 'react';

import { range } from '@antfu/utils';
import { ChevronDown } from 'lucide-react';

import type { MainContentTypeEnum } from '@hikka/api';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
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
import SegmentedBar from '@/components/ui/segmented-bar';
import { Separator } from '@/components/ui/separator';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { useVisibleOnce } from '@/services/hooks/use-visible-once';
import { cn } from '@/utils/cn';
import { contentPath } from '@/utils/content-paths';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { TITLE_FORMS } from '@/utils/i18n/word-forms';
import { Link } from '@/utils/navigation';

import FranchiseRow from './components/franchise-row';
import {
    type FranchiseModel,
    groupCounts,
    type RelationGroupEnum,
    sourceTypes,
} from './franchise-model';
import { mediaListLabel, RELATION_GROUP_STYLES } from './relation-groups';
import { useFranchise } from './use-franchise';

type Props = {
    content_type: MainContentTypeEnum;
    slug: string;
    className?: string;
};

const SKELETON_ROWS = 2;

const FranchiseCardSkeleton: FC = () => (
    <div className="flex flex-col gap-3 px-4">
        {range(0, SKELETON_ROWS).map((index) => (
            <div key={index} className="flex items-center gap-3">
                <PosterCardSkeleton
                    hasTitle={false}
                    className="w-10 shrink-0"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <SkeletonText
                        className="text-xs leading-4"
                        barClassName="w-16 rounded"
                    />
                    <SkeletonText
                        className="text-sm leading-tight"
                        barClassName="rounded"
                    />
                    <SkeletonText
                        className="text-xs leading-4"
                        barClassName="w-24 rounded"
                    />
                </div>
                <Skeleton className="size-8 shrink-0" />
            </div>
        ))}
    </div>
);

const FranchiseComposition: FC<{ model: FranchiseModel; href: string }> = ({
    model,
    href,
}) => {
    const [hovered, setHovered] = useState<RelationGroupEnum | null>(null);
    const counts = groupCounts(model);
    const total = model.nodes.length;
    const sourceLabel = mediaListLabel(sourceTypes(model));

    return (
        <div className="flex flex-col gap-3 px-4">
            <div className="flex items-center justify-between gap-2 font-medium text-sm">
                <span>Уся франшиза</span>
                <span className="font-normal text-muted-foreground tabular-nums">
                    {total} {getDeclensionWord(total, TITLE_FORMS)}
                </span>
            </div>
            <SegmentedBar
                dimmedKey={hovered}
                segments={counts.map(({ group, count }) => ({
                    key: group,
                    count,
                    className: RELATION_GROUP_STYLES[group].solid,
                }))}
            />
            <div className="-mx-2 flex flex-col">
                {counts.map(({ group, count }) => (
                    <Link
                        key={group}
                        to={href}
                        search={{ view: 'graph' }}
                        onMouseEnter={() => setHovered(group)}
                        onMouseLeave={() => setHovered(null)}
                        className="flex items-center justify-between gap-2 rounded-sm px-2 py-1.5 font-medium text-sm hover:bg-accent"
                    >
                        <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                            <span
                                className={cn(
                                    'size-2 shrink-0 rounded-full',
                                    RELATION_GROUP_STYLES[group].solid,
                                )}
                            />
                            <span className="truncate">
                                {group === 'source'
                                    ? sourceLabel
                                    : RELATION_GROUP_STYLES[group].label}
                            </span>
                        </span>
                        <span className="tabular-nums">{count}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

const FranchiseCardBody: FC<{ model: FranchiseModel; href: string }> = ({
    model,
    href,
}) => {
    const prequel = model.direct.find(
        (entry) => entry.succession === 'prequel',
    );
    const sequel = model.direct.find((entry) => entry.succession === 'sequel');
    const rail = [prequel, sequel].filter((entry) => entry !== undefined);
    const others = model.direct.filter((entry) => !rail.includes(entry));

    const otherRows = (
        <div className="flex flex-col gap-3">
            {others.map((entry) => (
                <FranchiseRow key={entry.node.id} relation={entry} />
            ))}
        </div>
    );

    return (
        <>
            {rail.length > 0 && (
                <div className="flex flex-col gap-3 px-4">
                    {rail.map((entry) => (
                        <FranchiseRow key={entry.node.id} relation={entry} />
                    ))}
                </div>
            )}
            {others.length > 0 && (
                <>
                    <Separator />
                    <div className="px-4">
                        {rail.length > 0 ? (
                            <Collapsible>
                                <CollapsibleTrigger className="group flex w-full cursor-pointer items-center gap-2 text-left font-medium text-sm">
                                    <span className="truncate group-hover:underline">
                                        Пов’язане з цим тайтлом
                                    </span>
                                    <span className="text-muted-foreground tabular-nums">
                                        {others.length}
                                    </span>
                                    <ChevronDown className="ml-auto size-4 text-muted-foreground group-data-panel-open:rotate-180" />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="pt-3">
                                    {otherRows}
                                </CollapsibleContent>
                            </Collapsible>
                        ) : (
                            otherRows
                        )}
                    </div>
                </>
            )}
            {model.nodes.length > 2 && (
                <>
                    <Separator />
                    <FranchiseComposition model={model} href={href} />
                </>
            )}
        </>
    );
};

const FranchiseCard: FC<Props> = ({ content_type, slug, className }) => {
    const { ref, visible } = useVisibleOnce();
    const { data: model, isPending } = useFranchise(
        content_type,
        slug,
        visible,
    );

    if (!isPending && (!model || model.nodes.length < 2)) {
        return null;
    }

    const href = `${contentPath(content_type, slug)}/franchise`;

    return (
        <Card
            ref={ref}
            id="content-franchise"
            className={cn('px-0', className)}
        >
            <Header href={href} className="px-4">
                <HeaderContainer>
                    <HeaderTitle variant="h4">Франшиза</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            {model ? (
                <FranchiseCardBody model={model} href={href} />
            ) : (
                <FranchiseCardSkeleton />
            )}
        </Card>
    );
};

export default FranchiseCard;
