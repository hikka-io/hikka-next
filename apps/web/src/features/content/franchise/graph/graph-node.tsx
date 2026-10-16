import type { FC } from 'react';

import type { CardStatus } from '@/components/content-card/content-status';
import PosterCard from '@/components/content-card/poster-card';
import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import { useTitle } from '@/services/session';
import { cn } from '@/utils/cn';
import { CONTENT_TYPES, getMediaTypeLabel } from '@/utils/labels';

import type { FranchiseNode } from '../franchise-model';
import { RELATION_GROUP_STYLES } from '../relation-groups';

export type NodeState = 'default' | 'isolated' | 'far';

type Props = {
    node: FranchiseNode;
    position: [number, number];
    isCurrent: boolean;
    isSelected: boolean;
    state: NodeState;
    showMedia: boolean;
    compactMedia: boolean;
    imageSizes: string;
    largeImage: boolean;
    onSelect: (id: string) => void;
};

function statusOf(node: FranchiseNode): CardStatus | undefined {
    const { content } = node;
    const entry =
        content.data_type === 'anime' ? content.watch[0] : content.read[0];

    if (!entry) return undefined;

    return {
        value: entry.status,
        kind: content.data_type === 'anime' ? 'watch' : 'read',
    };
}

const GraphNode: FC<Props> = ({
    node,
    position: [column, row],
    isCurrent,
    isSelected,
    state,
    showMedia,
    compactMedia,
    imageSizes,
    largeImage,
    onSelect,
}) => {
    const title = useTitle(node.content);
    const media = CONTENT_TYPES[node.contentType].title_ua;
    const MediaIcon = CONTENT_TYPE_ICONS[node.contentType];
    const details = [
        ...new Set([
            media,
            node.content.year,
            getMediaTypeLabel(node.content.media_type),
        ]),
    ]
        .filter(Boolean)
        .join(', ');

    return (
        <button
            type="button"
            data-node={node.id}
            title={`${title} (${details})`}
            aria-label={title}
            aria-pressed={isSelected}
            onClick={() => onSelect(node.id)}
            className={cn(
                'absolute z-1 -mt-[calc(var(--gp)/1.4)] -ml-[calc(var(--gp)/2)] block w-(--gp) cursor-pointer rounded-md transition-opacity',
                state === 'isolated' && 'opacity-20 grayscale',
                state === 'far' && 'opacity-30',
            )}
            style={{
                left: `calc(var(--axis) + var(--cw) * ${column + 0.5})`,
                top: `calc(var(--rh) * ${row + 0.5})`,
            }}
        >
            <PosterCard
                image={node.content.image}
                imagePreset={largeImage ? 'cardSm' : 'cardXs'}
                imageProps={{ sizes: imageSizes, resize: 'fill' }}
                imageClassName="size-full! object-cover"
                status={statusOf(node)}
                statusSize="sm"
                containerClassName={cn(
                    'shadow-[0_0_0_3px_var(--card)]',
                    isCurrent &&
                        'shadow-[0_0_0_2px_var(--primary-foreground),0_0_0_5px_var(--card)]',
                    isSelected &&
                        'shadow-[0_0_0_2px_var(--foreground),0_0_0_5px_var(--card)]',
                )}
            >
                {node.group !== 'source' && (
                    <span
                        className={cn(
                            'absolute inset-x-0 bottom-0 z-2 h-1',
                            RELATION_GROUP_STYLES[node.group].solid,
                        )}
                    />
                )}
            </PosterCard>
            {showMedia && (
                <span className="absolute top-[calc(100%+6px)] left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-md bg-card px-1.5 py-0.5 font-medium text-muted-foreground text-xs leading-4">
                    <MediaIcon className="size-3 shrink-0" />
                    {!compactMedia && media}
                </span>
            )}
        </button>
    );
};

export default GraphNode;
