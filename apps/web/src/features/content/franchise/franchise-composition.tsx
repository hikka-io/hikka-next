import type { FC } from 'react';

import Card from '@/components/ui/card';
import SegmentedBar from '@/components/ui/segmented-bar';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';
import { CONTENT_TYPES } from '@/utils/labels';

import { compositionCounts, type FranchiseModel } from './franchise-model';
import { RELATION_GROUP_STYLES } from './relation-groups';

// A page shows at most two other media; two shades of the muted relation colour tell them apart.
const MEDIA_SHADES = ['bg-relation-source', 'bg-relation-source/50'];

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

    const entries = compositionCounts(model).map((entry, _, list) => ({
        ...entry,
        key: entry.contentType ?? entry.group,
        label: entry.contentType
            ? CONTENT_TYPES[entry.contentType].title_ua
            : RELATION_GROUP_STYLES[entry.group].label,
        className: entry.contentType
            ? MEDIA_SHADES[
                  list.filter((other) => other.contentType).indexOf(entry)
              ]
            : RELATION_GROUP_STYLES[entry.group].solid,
    }));

    return (
        <Card className="gap-3">
            <SegmentedBar
                segments={entries.map(({ key, count, className }) => ({
                    key,
                    count,
                    className,
                }))}
            />
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-medium text-sm">
                {entries.map(({ key, label, count, className }) => (
                    <span key={key} className="flex items-center gap-2">
                        <span
                            className={cn(
                                'size-2 shrink-0 rounded-full',
                                className,
                            )}
                        />
                        <span className="text-muted-foreground">{label}</span>
                        <span className="tabular-nums">{count}</span>
                    </span>
                ))}
            </div>
        </Card>
    );
};

export default FranchiseComposition;
