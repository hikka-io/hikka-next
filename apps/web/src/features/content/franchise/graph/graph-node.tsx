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

type Props = {
    node: FranchiseNode;
    position: [number, number];
    isCurrent: boolean;
    isSelected: boolean;
    state: NodeState;
    showMedia: boolean;
    compactMedia: boolean;
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
    showMedia,
    compactMedia,
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
                            'absolute z-1 -mt-[calc(var(--gp)/1.4)] -ml-[calc(var(--gp)/2)] block w-(--gp) cursor-pointer rounded-(--base-radius) transition-[filter,scale] duration-150 motion-reduce:transition-none',
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
                        'rounded-(--base-radius) shadow-[0_0_0_3px_var(--card)]',
                        isCurrent &&
                            'shadow-[0_0_0_2px_var(--primary-foreground),0_0_0_5px_var(--card)]',
                        isSelected &&
                            'shadow-[0_0_0_2px_var(--foreground),0_0_0_5px_var(--card)]',
                    )}
                />
                {showMedia && (
                    <span className="absolute top-[calc(100%+6px)] left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-md bg-card px-1.5 py-0.5 font-medium text-muted-foreground text-xs leading-4">
                        <MediaIcon className="size-3 shrink-0" />
                        {!compactMedia && media}
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
