import { type FC, Fragment, useState } from 'react';

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
import { labelVariants } from '@/components/ui/label';
import SegmentedBar from '@/components/ui/segmented-bar';
import { Separator } from '@/components/ui/separator';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import TextLink from '@/components/ui/text-link';
import { useVisibleOnce } from '@/services/hooks/use-visible-once';
import { cn } from '@/utils/cn';
import { contentPath } from '@/utils/content-paths';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { TITLE_FORMS } from '@/utils/i18n/word-forms';
import { Link } from '@/utils/navigation';

import FranchiseRow from './components/franchise-row';
import RelationLabel from './components/relation-label';
import {
    type DirectRelation,
    type FranchiseModel,
    groupByLabel,
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
const GROUP_PREVIEW_SIZE = 3;

const FranchiseCardSkeleton: FC = () => (
    <div className="flex flex-col gap-4 px-4">
        {range(0, SKELETON_ROWS).map((index) => (
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
        <div className="flex flex-col gap-4">
            {groupByLabel(others).map((entries) => (
                <Fragment key={entries[0].label}>
                    {entries.slice(0, GROUP_PREVIEW_SIZE).map((entry) => (
                        <DirectRow key={entry.node.id} relation={entry} />
                    ))}
                    {entries.length > GROUP_PREVIEW_SIZE && (
                        <TextLink
                            to={href}
                            className="pl-16 text-muted-foreground text-sm"
                        >
                            Ще {entries.length - GROUP_PREVIEW_SIZE}
                        </TextLink>
                    )}
                </Fragment>
            ))}
        </div>
    );

    return (
        <>
            {rail.length > 0 && (
                <div className="flex flex-col gap-4 px-4">
                    {rail.map((entry) => (
                        <DirectRow key={entry.node.id} relation={entry} />
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
                                <CollapsibleContent className="pt-4">
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
