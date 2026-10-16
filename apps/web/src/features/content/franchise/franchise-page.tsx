import type { FC } from 'react';

import type { MainContentTypeEnum } from '@hikka/api';

import MaterialSymbolsSortRounded from '@/components/icons/material-symbols/MaterialSymbolsSortRounded';
import { HistoryTimelineSkeleton } from '@/components/list-items';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import { type ChipTabOption, ChipTabs } from '@/components/ui/chip-tabs';
import {
    Header,
    HeaderActions,
    HeaderContainer,
    HeaderTitle,
} from '@/components/ui/header';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';
import { contentPath } from '@/utils/content-paths';
import { Link } from '@/utils/navigation';
import type { FranchiseOrder, FranchiseView } from '@/utils/search-schemas';

import FranchiseChronology from './franchise-chronology';
import FranchiseComposition from './franchise-composition';
import FranchiseRelated from './franchise-related';
import FranchiseGraph, {
    FranchiseGraphSkeleton,
} from './graph/franchise-graph';
import { useFranchise } from './use-franchise';

const CHRONOLOGY_SKELETON_ROWS = 4;

type Props = {
    content_type: MainContentTypeEnum;
    slug: string;
    view?: FranchiseView;
    order?: FranchiseOrder;
};

const FranchisePage: FC<Props> = ({
    content_type,
    slug,
    view = 'chrono',
    order = 'desc',
}) => {
    const { data: model, isPending } = useFranchise(content_type, slug);

    if (!model && !isPending) {
        return null;
    }

    const to = `${contentPath(content_type, slug)}/franchise`;
    const options: ChipTabOption<FranchiseView>[] = [
        {
            label: 'Хронологія',
            value: 'chrono',
            count: model?.nodes.length,
            to,
        },
        {
            label: 'Пов’язане',
            value: 'related',
            count: model?.direct.length,
            to,
            search: { view: 'related' },
        },
        { label: 'Граф', value: 'graph', to, search: { view: 'graph' } },
    ];
    const orderLabel = order === 'asc' ? 'Спочатку старі' : 'Спочатку нові';

    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle>
                        Франшиза{' '}
                        {model && (
                            <span className="text-muted-foreground">
                                ({model.nodes.length})
                            </span>
                        )}
                    </HeaderTitle>
                </HeaderContainer>
                {view === 'chrono' && (
                    <HeaderActions>
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <Button
                                        size="icon-sm"
                                        variant="outline"
                                        aria-label={`Порядок років: ${orderLabel}`}
                                        render={
                                            <Link
                                                to={to}
                                                search={{
                                                    order:
                                                        order === 'desc'
                                                            ? 'asc'
                                                            : undefined,
                                                }}
                                                replace
                                                resetScroll={false}
                                            />
                                        }
                                    />
                                }
                            >
                                <MaterialSymbolsSortRounded
                                    className={cn(
                                        order === 'asc' && '-scale-y-100',
                                    )}
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{orderLabel}</p>
                            </TooltipContent>
                        </Tooltip>
                    </HeaderActions>
                )}
            </Header>
            <FranchiseComposition model={model} />
            <ChipTabs options={options} value={view} />
            {view === 'related' && <FranchiseRelated model={model} />}
            {view === 'chrono' &&
                (model ? (
                    <FranchiseChronology model={model} order={order} />
                ) : (
                    <HistoryTimelineSkeleton
                        count={CHRONOLOGY_SKELETON_ROWS}
                        size="lg"
                    />
                ))}
            {view === 'graph' &&
                (model ? (
                    <FranchiseGraph model={model} />
                ) : (
                    <FranchiseGraphSkeleton />
                ))}
        </Block>
    );
};

export default FranchisePage;
