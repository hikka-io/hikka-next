import {
    type FC,
    type MouseEvent,
    type MouseEventHandler,
    type ReactNode,
    type Ref,
    useCallback,
    useState,
} from 'react';

import { cva } from 'class-variance-authority';
import { Eye } from 'lucide-react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/utils/cn';
import type { ImagePreset } from '@/utils/constants/image-presets';
import { IMAGE_PRESETS } from '@/utils/constants/image-presets';
import { Link } from '@/utils/navigation';

import CardImage, { type CardImageProps } from './card-image';
import CardMeta from './card-meta';
import ContentStatus, { type CardStatus } from './content-status';
import { useImagePreset } from './image-preset-context';
import { TooltipSuppressProvider } from './tooltips/tooltip-suppress-context';

const posterCardVariants = cva('group relative flex w-full flex-col gap-2', {
    variants: {
        interactive: {
            true: 'cursor-pointer',
            false: '',
        },
    },
    defaultVariants: {
        interactive: false,
    },
});

// `interactive` is derived from `onClick`, so the variant's own prop is
// deliberately not part of the public surface — it would be ignored and would
// leak onto the DOM node through the rest spread.
export type PosterCardProps = {
    ref?: Ref<HTMLDivElement>;
    target?: string;
    title?: string | null;
    description?: string | null;
    leftSubtitle?: string | null;
    rightSubtitle?: string | null;
    image?: string | ReactNode;
    href?: string;
    to?: string;
    containerRatio?: number;
    imageClassName?: string;
    containerClassName?: string;
    titleClassName?: string;
    className?: string;
    /** Rendered over the poster, inside the link. */
    children?: ReactNode;
    /** Rendered over the poster but outside the link, so it stays clickable. */
    overlay?: ReactNode;
    onClick?: MouseEventHandler<HTMLDivElement>;
    status?: CardStatus;
    statusSize?: 'default' | 'sm';
    imageProps?: CardImageProps;
    imagePreset?: ImagePreset;
    linkProps?: Record<string, unknown>;
    imageBlur?: boolean;
    titleBlur?: boolean;
    /**
     * Wraps the finished card in a hover target. It is a callback rather than an
     * element so the tooltip mounts *inside* the suppression provider below,
     * which is what lets an unrevealed sensitive card keep it closed.
     */
    renderTooltip?: (trigger: ReactNode) => ReactNode;
    tooltipDisabled?: boolean;
};

export const DEFAULT_CONTAINER_RATIO = 0.7;

const CardLink: FC<{
    to?: string;
    target?: string;
    linkProps?: Record<string, unknown>;
    className?: string;
    onClick?: MouseEventHandler<HTMLElement>;
    children: ReactNode;
}> = ({ to, target, linkProps, className, onClick, children }) => {
    // Without `to` there is no navigation to intercept, so the reveal click
    // (onClick) only applies to the linked variant.
    if (!to) return <div className={className}>{children}</div>;
    return (
        <Link
            to={to}
            target={target}
            className={className}
            onClick={onClick}
            {...linkProps}
        >
            {children}
        </Link>
    );
};

/**
 * The presentational card: a poster in a fixed ratio box, optionally linked,
 * with a title block under it. It knows nothing about what it depicts —
 * `EntityCard` binds it to a subject.
 */
const PosterCard: FC<PosterCardProps> = ({
    ref,
    image,
    title,
    description,
    leftSubtitle,
    rightSubtitle,
    imageClassName,
    containerClassName,
    containerRatio = DEFAULT_CONTAINER_RATIO,
    titleClassName,
    className,
    children,
    overlay,
    href,
    to,
    onClick,
    status,
    statusSize,
    imageProps,
    imagePreset,
    linkProps,
    target,
    imageBlur,
    titleBlur,
    renderTooltip,
    tooltipDisabled,
    ...props
}) => {
    const contextPreset = useImagePreset();
    const effectivePreset = imagePreset ?? contextPreset;
    const resolvedHref = to ?? href;
    const hasMeta = Boolean(title || description);
    const resolvedImageProps = effectivePreset
        ? { ...IMAGE_PRESETS[effectivePreset], ...imageProps }
        : imageProps;

    // Sensitive (NSFW/spoiler) cards stay hidden until the first click, which
    // reveals them (loads full-res, unblurs) instead of navigating; the next
    // click navigates as usual.
    const [revealed, setRevealed] = useState(false);
    const hidden = Boolean(imageBlur || titleBlur) && !revealed;
    const handleReveal = useCallback((e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setRevealed(true);
    }, []);
    const revealClick = hidden ? handleReveal : undefined;

    const card = (
        /* biome-ignore lint/a11y/noStaticElementInteractions: click is a supplementary shortcut; primary navigation is the inner link. */
        /* biome-ignore lint/a11y/useKeyWithClickEvents: click is a supplementary shortcut; primary navigation is the inner link. */
        <div
            ref={ref}
            className={cn(
                posterCardVariants({ interactive: !!onClick }),
                className,
            )}
            onClick={onClick}
            {...props}
        >
            <AspectRatio
                ratio={containerRatio}
                className={cn(
                    'relative w-full overflow-hidden rounded-md bg-muted',
                    containerClassName,
                )}
            >
                <CardLink
                    to={resolvedHref}
                    target={target}
                    linkProps={linkProps}
                    onClick={revealClick}
                    className="@container absolute top-0 left-0 flex size-full items-center justify-center bg-secondary/20"
                >
                    <CardImage
                        image={image}
                        className={imageClassName}
                        imageProps={resolvedImageProps}
                        containerRatio={containerRatio}
                        blurred={imageBlur && hidden}
                    />
                    {imageBlur && hidden && (
                        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                            {/* Scales the reveal hint with the rendered card width (clamped), so it stays proportional on tiny covers and large previews alike. */}
                            <div className="flex size-[clamp(1rem,28cqw,2rem)] items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
                                <Eye className="size-[clamp(0.625rem,14cqw,1rem)]" />
                            </div>
                        </div>
                    )}
                    {children}
                    {status && (
                        <ContentStatus status={status} size={statusSize} />
                    )}
                </CardLink>
                {overlay}
            </AspectRatio>
            {hasMeta && (
                <CardLink
                    to={resolvedHref}
                    target={target}
                    linkProps={linkProps}
                    onClick={revealClick}
                    className={cn(
                        'mt-1',
                        (leftSubtitle || rightSubtitle) && 'truncate',
                    )}
                >
                    <CardMeta
                        title={title}
                        description={description}
                        leftSubtitle={leftSubtitle}
                        rightSubtitle={rightSubtitle}
                        titleClassName={cn(
                            titleClassName,
                            titleBlur && hidden && 'spoiler-blur-sm',
                        )}
                    />
                </CardLink>
            )}
        </div>
    );

    if (!renderTooltip) {
        return card;
    }

    return (
        <TooltipSuppressProvider value={hidden || Boolean(tooltipDisabled)}>
            {renderTooltip(card)}
        </TooltipSuppressProvider>
    );
};

export default PosterCard;
