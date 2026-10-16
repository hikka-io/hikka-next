import type { FC } from 'react';

import Card from '@/components/ui/card';
import SegmentedBar from '@/components/ui/segmented-bar';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';

import {
    type FranchiseModel,
    groupCounts,
    sourceTypes,
} from './franchise-model';
import { mediaListLabel, RELATION_GROUP_STYLES } from './relation-groups';

type Props = {
    model?: FranchiseModel;
};

const FranchiseComposition: FC<Props> = ({ model }) => {
    if (!model) {
        return (
            <Card className="gap-3">
                <Skeleton className="h-2 w-full rounded-xs" />
                <SkeletonText
                    className="text-sm"
                    barClassName="w-2/3 rounded"
                />
            </Card>
        );
    }

    const sourceLabel = mediaListLabel(sourceTypes(model));
    const counts = groupCounts(model);

    return (
        <Card className="gap-3">
            <SegmentedBar
                segments={counts.map(({ group, count }) => ({
                    key: group,
                    count,
                    className: RELATION_GROUP_STYLES[group].solid,
                }))}
            />
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-medium text-sm">
                {counts.map(({ group, count }) => (
                    <span key={group} className="flex items-center gap-2">
                        <span
                            className={cn(
                                'size-2 shrink-0 rounded-full',
                                RELATION_GROUP_STYLES[group].solid,
                            )}
                        />
                        <span className="text-muted-foreground">
                            {group === 'source'
                                ? sourceLabel
                                : RELATION_GROUP_STYLES[group].label}
                        </span>
                        <span className="tabular-nums">{count}</span>
                    </span>
                ))}
            </div>
        </Card>
    );
};

export default FranchiseComposition;
