import { type FC, type MouseEvent, memo } from 'react';

import PosterCard from '@/components/content-card/poster-card';
import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import { useTitle } from '@/services/session';
import { cn } from '@/utils/cn';
import { contentPath } from '@/utils/content-paths';

import { type FranchiseNode, listStatus } from '../franchise-model';
import GraphOrderTile from './graph-order-tile';
import { NODE_RING_CLASS, NODE_RING_COLOR } from './node-rings';

export type NodeState = 'default' | 'isolated' | 'far';

// Opaque stand-ins for 30% opacity over the card (a see-through poster would show the edges
// beneath it). The filter order is explicit: contrast then brightness fades towards white.
const FADED_CLASS: Record<Exclude<NodeState, 'default'>, string> = {
    far: '[filter:contrast(0.18)_brightness(1.7)] dark:[filter:brightness(0.3)]',
    isolated:
        '[filter:grayscale(1)_contrast(0.18)_brightness(1.7)] dark:[filter:grayscale(1)_brightness(0.3)]',
};

type Props = {
    node: FranchiseNode;
    position: [number, number];
    isCurrent: boolean;
    isSelected: boolean;
    state: NodeState;
    order: number | null;
    showLabel: boolean;
    wideLabel: boolean;
    highlight: boolean;
    labelLines: 1 | 2;
    showMedia: boolean;
    showStatus: boolean;
    tabbable: boolean;
    imageSizes: string;
    onSelect: (id: string) => void;
};

const GraphNode: FC<Props> = ({
    node,
    position: [column, row],
    isCurrent,
    isSelected,
    state,
    order,
    showLabel,
    wideLabel,
    highlight,
    labelLines,
    showMedia,
    showStatus,
    tabbable,
    imageSizes,
    onSelect,
}) => {
    const title = useTitle(node.content);
    const MediaIcon = CONTENT_TYPE_ICONS[node.contentType];

    // A plain click selects; modified and middle clicks keep the link's own behaviour (new tab).
    const handleClick = (event: MouseEvent) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }
        event.preventDefault();
        onSelect(node.id);
    };

    return (
        <a
            href={contentPath(node.contentType, node.content.slug)}
            data-node={node.id}
            tabIndex={tabbable ? 0 : -1}
            aria-label={title}
            aria-current={isSelected || undefined}
            onClick={handleClick}
            className={cn(
                'group/node absolute z-1 -mt-[calc(var(--gp)/1.4)] -ml-[calc(var(--gp)/2)] block w-(--gp) cursor-pointer rounded-(--node-radius) outline-none transition-[filter,scale] duration-150 motion-reduce:transition-none',
                NODE_RING_COLOR[isCurrent ? 'current' : 'selected'],
                isCurrent && 'z-2',
                isSelected && 'z-5 scale-125 max-md:scale-120',
                state !== 'default' && FADED_CLASS[state],
            )}
            style={{
                left: `calc(var(--cw) * ${column + 0.5})`,
                top: `calc(var(--rh) * ${row + 0.5})`,
            }}
        >
            <PosterCard
                image={node.content.image}
                imagePreset="cardSm"
                imageProps={{ sizes: imageSizes, resize: 'fill' }}
                imageClassName="size-full! object-cover"
                status={showStatus ? listStatus(node.content) : undefined}
                statusSize="sm"
                containerClassName={cn(
                    'rounded-(--node-radius)',
                    NODE_RING_CLASS[
                        isCurrent || isSelected ? 'ringed' : 'plain'
                    ],
                )}
            >
                {order !== null && (
                    <GraphOrderTile
                        order={order}
                        isCurrent={isCurrent}
                        className="absolute bottom-1 left-1 z-1"
                    />
                )}
            </PosterCard>
            {showLabel && (
                <span
                    className={cn(
                        'absolute top-[calc(100%+6px)] left-1/2 flex w-max -translate-x-1/2 items-start gap-1 rounded-md bg-card px-1.5 text-xs leading-5',
                        wideLabel
                            ? 'max-w-[calc(var(--cw)*1.8)]'
                            : 'max-w-[min(calc(var(--cw)-1rem),12rem)]',
                        isCurrent
                            ? 'font-semibold text-primary-foreground'
                            : isSelected
                              ? 'font-semibold text-foreground'
                              : cn(
                                    'font-medium',
                                    highlight
                                        ? 'text-foreground'
                                        : 'text-muted-foreground',
                                ),
                    )}
                >
                    {showMedia && (
                        <MediaIcon className="mt-1 size-3 shrink-0" />
                    )}
                    <span
                        className={
                            labelLines === 2
                                ? 'line-clamp-2 text-center'
                                : 'truncate'
                        }
                    >
                        {title}
                    </span>
                </span>
            )}
        </a>
    );
};

export default memo(GraphNode);
