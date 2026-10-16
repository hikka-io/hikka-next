import type { FC } from 'react';

import type { MainContentTypeEnum } from '@hikka/api';

import { HistoryTimelineSkeleton } from '@/components/list-items';
import Block from '@/components/ui/block';
import { type ChipTabOption, ChipTabs } from '@/components/ui/chip-tabs';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { contentPath } from '@/utils/content-paths';
import type { FranchiseView } from '@/utils/search-schemas';

import FranchiseChronology from './franchise-chronology';
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
};

const FranchisePage: FC<Props> = ({ content_type, slug, view = 'related' }) => {
    const { data: model, isPending } = useFranchise(content_type, slug);

    if (!model && !isPending) {
        return null;
    }

    const to = `${contentPath(content_type, slug)}/franchise`;
    const options: ChipTabOption<FranchiseView>[] = [
        {
            label: 'Пов’язане',
            value: 'related',
            count: model?.direct.length,
            to,
        },
        {
            label: 'Хронологія',
            value: 'chrono',
            count: model?.nodes.length,
            to,
            search: { view: 'chrono' },
        },
        { label: 'Граф', value: 'graph', to, search: { view: 'graph' } },
    ];

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
            </Header>
            <ChipTabs options={options} value={view} />
            {view === 'related' && <FranchiseRelated model={model} />}
            {view === 'chrono' &&
                (model ? (
                    <FranchiseChronology model={model} />
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
