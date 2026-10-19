import { type FC, type MouseEvent, memo } from 'react';

import { contentPath } from '@hikka/core';

import PosterCard from '@/components/content-card/poster-card';
import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import { useTitle } from '@/services/session';
import { cn } from '@/utils/cn';

import { type FranchiseNode, listStatus } from '../franchise-model';

export type NodeState = 'default' | 'isolated' | 'far';

// The inner ring marks the current or selected title; keyboard focus adds an outer one.
const RING_CLASS = {
    plain: 'shadow-[0_0_0_3px_var(--card)] group-focus-visible/node:shadow-[0_0_0_3px_var(--card),0_0_0_5px_var(--foreground)]',
    ringed: 'shadow-[0_0_0_2px_var(--node-ring),0_0_0_5px_var(--card)] group-focus-visible/node:shadow-[0_0_0_2px_var(--node-ring),0_0_0_4px_var(--card),0_0_0_6px_var(--foreground)]',
};

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
                isCurrent
                    ? '[--node-ring:var(--primary-foreground)]'
                    : '[--node-ring:var(--foreground)]',
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
                    RING_CLASS[isCurrent || isSelected ? 'ringed' : 'plain'],
                )}
            >
                {order !== null && (
                    <span
                        className={cn(
                            'absolute bottom-1 left-1 z-1 h-4 min-w-4 rounded-sm border px-0.75 text-center font-bold text-[10px] tabular-nums leading-3.5',
                            isCurrent
                                ? 'border-primary-foreground bg-primary-foreground text-primary'
                                : 'border-primary-border bg-primary text-primary-foreground',
                        )}
                    >
                        {order}
                    </span>
                )}
            </PosterCard>
            {showLabel && (
                <span
                    className={cn(
                        'absolute top-[calc(100%+6px)] left-1/2 flex w-max -translate-x-1/2 bg-card text-xs leading-5',
                        // A two-line pill cannot be fully round without cutting into its text.
                        labelLines === 2
                            ? 'rounded-[min(var(--radius-md),0.5rem)] px-2'
                            : 'rounded-md px-1.5',
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
                    <span
                        className={
                            labelLines === 2
                                ? 'line-clamp-2 text-center'
                                : 'truncate'
                        }
                    >
                        {showMedia && (
                            <MediaIcon className="mr-1 inline size-3 align-[-2px]" />
                        )}
                        {title}
                    </span>
                </span>
            )}
        </a>
    );
};

export default memo(GraphNode);
