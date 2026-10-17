import type { FC, MouseEvent } from 'react';

import type { CardStatus } from '@/components/content-card/content-status';
import PosterCard from '@/components/content-card/poster-card';
import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTitle } from '@/services/session';
import { cn } from '@/utils/cn';
import { contentPath } from '@/utils/content-paths';
import { CONTENT_TYPES, getMediaTypeLabel } from '@/utils/labels';

import type { FranchiseNode } from '../franchise-model';

export type NodeState = 'default' | 'isolated' | 'far';

// Opaque stand-ins for 30% opacity over the card (a see-through poster would show the edges
// beneath it). The filter order is explicit: contrast then brightness fades towards white.
const FADED_CLASS: Record<Exclude<NodeState, 'default'>, string> = {
    far: '[filter:contrast(0.18)_brightness(1.7)] dark:[filter:brightness(0.3)]',
    isolated:
        '[filter:grayscale(1)_contrast(0.18)_brightness(1.7)] dark:[filter:grayscale(1)_brightness(0.3)]',
};

const RING_CLASS = {
    plain: 'shadow-[0_0_0_3px_var(--card)] group-focus-visible/node:shadow-[0_0_0_3px_var(--card),0_0_0_5px_var(--foreground)]',
    ringed: 'shadow-[0_0_0_2px_var(--node-ring),0_0_0_5px_var(--card)] group-focus-visible/node:shadow-[0_0_0_2px_var(--node-ring),0_0_0_4px_var(--card),0_0_0_6px_var(--foreground)]',
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
    showMedia: boolean;
    imageSizes: string;
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
    order,
    showLabel,
    wideLabel,
    showMedia,
    imageSizes,
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

    // A plain click selects; modified and middle clicks keep the link's own behaviour (new tab).
    const handleClick = (event: MouseEvent) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }
        event.preventDefault();
        onSelect(node.id);
    };

    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <a
                        href={contentPath(node.contentType, node.content.slug)}
                        data-node={node.id}
                        aria-label={title}
                        aria-current={isSelected || undefined}
                        onClick={handleClick}
                        className={cn(
                            'group/node absolute z-1 -mt-[calc(var(--gp)/1.4)] -ml-[calc(var(--gp)/2)] block w-(--gp) cursor-pointer rounded-(--base-radius) outline-none transition-[filter,scale] duration-150 [--node-ring:var(--foreground)] motion-reduce:transition-none',
                            isCurrent &&
                                'z-2 [--node-ring:var(--primary-foreground)]',
                            isSelected && 'z-5 scale-125 max-md:scale-120',
                            state !== 'default' && FADED_CLASS[state],
                        )}
                        style={{
                            left: `calc(var(--cw) * ${column + 0.5})`,
                            top: `calc(var(--rh) * ${row + 0.5})`,
                        }}
                    />
                }
            >
                <PosterCard
                    image={node.content.image}
                    imagePreset="cardSm"
                    imageProps={{ sizes: imageSizes, resize: 'fill' }}
                    imageClassName="size-full! object-cover"
                    status={statusOf(node)}
                    statusSize="sm"
                    containerClassName={cn(
                        'rounded-(--base-radius)',
                        RING_CLASS[
                            isCurrent || isSelected ? 'ringed' : 'plain'
                        ],
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
                            'absolute top-[calc(100%+6px)] left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-md bg-card px-1.5 text-xs leading-5',
                            wideLabel
                                ? 'max-w-[calc(var(--cw)*1.8)]'
                                : 'max-w-[min(calc(var(--cw)-1rem),12rem)]',
                            isCurrent
                                ? 'font-semibold text-primary-foreground'
                                : isSelected
                                  ? 'font-semibold text-foreground'
                                  : 'font-medium text-muted-foreground',
                        )}
                    >
                        {showMedia && <MediaIcon className="size-3 shrink-0" />}
                        <span className="truncate">{title}</span>
                    </span>
                )}
            </TooltipTrigger>
            <TooltipContent className="flex max-w-64 flex-col">
                <span className="font-medium">{title}</span>
                <span className="text-tooltip-foreground/70 text-xs">
                    {details}
                </span>
            </TooltipContent>
        </Tooltip>
    );
};

export default GraphNode;
