import type { FC } from 'react';

import { Share2 } from 'lucide-react';

import type { MainContentTypeEnum } from '@hikka/api';
import type { FranchiseOrder, FranchiseView } from '@hikka/core';
import { contentPath } from '@hikka/core';

import { HistoryTimelineSkeleton } from '@/components/list-items';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import { type ChipTabOption, ChipTabs } from '@/components/ui/chip-tabs';
import EmptyState from '@/components/ui/empty-state';

import ContentSubpage from '../content-subpage';
import FranchiseChronology from './franchise-chronology';
import FranchiseChronologyToolbar from './franchise-chronology-toolbar';
import FranchiseComposition from './franchise-composition';
import { franchiseTypes } from './franchise-model';
import FranchiseRelated from './franchise-related';
import { useFranchise } from './use-franchise';
import { useGraphOverlay } from './use-graph-overlay';

const CHRONOLOGY_SKELETON_ROWS = 4;

type Props = {
    content_type: MainContentTypeEnum;
    slug: string;
    view?: FranchiseView;
    order?: FranchiseOrder;
    types?: MainContentTypeEnum[];
};

const FranchisePage: FC<Props> = ({
    content_type,
    slug,
    view = 'chrono',
    order = 'desc',
    types,
}) => {
    const { data: model, isPending } = useFranchise(content_type, slug);
    const [, setGraphOpen] = useGraphOverlay();

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
    ];
    const presentTypes = model ? franchiseTypes(model) : [];
    const selectedTypes = presentTypes.filter((type) => types?.includes(type));
    const activeTypes = selectedTypes.length ? selectedTypes : presentTypes;

    return (
        <ContentSubpage
            slug={slug}
            contentType={content_type}
            actions={
                <Button
                    size="md"
                    variant="outline"
                    disabled={!model}
                    onClick={() => setGraphOpen(true)}
                >
                    <Share2 className="rotate-90" />
                    Граф
                </Button>
            }
        >
            {model || isPending ? (
                <Block>
                    <FranchiseComposition model={model} />
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <ChipTabs
                            options={options}
                            value={view}
                            className="md:min-w-0 md:flex-1"
                        />
                        {view === 'chrono' && (
                            <FranchiseChronologyToolbar
                                to={to}
                                order={order}
                                model={model}
                                types={presentTypes}
                                selected={selectedTypes}
                            />
                        )}
                    </div>
                    {view === 'related' && <FranchiseRelated model={model} />}
                    {view === 'chrono' &&
                        (model ? (
                            <FranchiseChronology
                                model={model}
                                order={order}
                                types={activeTypes}
                            />
                        ) : (
                            <HistoryTimelineSkeleton
                                count={CHRONOLOGY_SKELETON_ROWS}
                                size="lg"
                            />
                        ))}
                </Block>
            ) : (
                <EmptyState
                    bordered
                    icon={<Share2 className="rotate-90" />}
                    title="Франшизу не знайдено"
                    description="Інформацію ще не додано"
                />
            )}
        </ContentSubpage>
    );
};

export default FranchisePage;
