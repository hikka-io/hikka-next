import {
    type CSSProperties,
    type FC,
    type MouseEvent,
    type ReactNode,
    type Ref,
    useEffect,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';

import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import Card from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsDesktop } from '@/services/hooks/use-media-query';
import { useSession, useTitle } from '@/services/session';
import { cn } from '@/utils/cn';
import { CONTENT_TYPES } from '@/utils/labels';

import {
    type FranchiseModel,
    type FranchiseNode,
    type GraphEdgeType,
    isTracked,
    RELATION_TYPE_GROUPS,
    sourceTypes,
} from '../franchise-model';
import {
    EDGE_TYPES,
    mediaListLabel,
    RELATION_GROUP_STYLES,
} from '../relation-groups';
import GraphDetails, { type DetailsVariant } from './graph-details';
import { useGraphFiltersStore } from './graph-filters-store';
import {
    DESKTOP_BUDGET,
    type GraphLayout,
    layoutGraph,
    PHONE_BUDGET,
    transposeLayout,
} from './graph-layout';
import GraphNode, { type NodeState } from './graph-node';
import GraphToolbar, {
    type EdgeFilter,
    type MediaFilter,
} from './graph-toolbar';
import {
    CELL,
    computeGraphView,
    defaultHiddenTypes,
    edgeStyle,
    resolveHiddenTypes,
    withoutMedia,
    withoutUnlinked,
} from './graph-view';
import GraphZoomControls from './graph-zoom-controls';
import { useGraphZoom } from './use-graph-zoom';

type Props = {
    model: FranchiseModel;
};

// `image` is the poster's width in px at 100%, for the `sizes` attribute, which cannot read CSS variables.
type Sizes = { cw: string; rh: string; gp: string; gx: string; image: number };

const SIZES: Record<'desktop' | 'phone', Record<'card' | 'full', Sizes>> = {
    desktop: {
        card: {
            cw: 'max(76px, calc((100cqw - 56px) / var(--cols)))',
            rh: '136px',
            gp: '60px',
            gx: '16px',
            image: 60,
        },
        full: {
            cw: 'clamp(76px, calc((100cqw - 72px) / var(--cols)), 320px)',
            rh: '164px',
            gp: 'min(76px, calc(var(--cw0) * 0.78))',
            gx: '16px',
            image: 76,
        },
    },
    phone: {
        card: {
            cw: 'max(64px, calc((100cqw - 32px) / var(--cols)))',
            rh: '120px',
            gp: '52px',
            gx: '12px',
            image: 52,
        },
        full: {
            cw: 'max(72px, calc((100cqw - 24px) / var(--cols)))',
            rh: '128px',
            gp: '56px',
            gx: '12px',
            image: 56,
        },
    },
};

// Horizontal steps are fixed: years run off to the right instead of filling the card's width.
// A year step leaves about a poster's width of air; a lane fits a poster, its media label and a gap.
const SIZES_HORIZONTAL: typeof SIZES = {
    desktop: {
        card: { cw: '132px', rh: '148px', gp: '60px', gx: '16px', image: 60 },
        full: { cw: '168px', rh: '176px', gp: '76px', gx: '16px', image: 76 },
    },
    phone: {
        card: { cw: '100px', rh: '128px', gp: '52px', gx: '12px', image: 52 },
        full: { cw: '108px', rh: '136px', gp: '56px', gx: '12px', image: 56 },
    },
};

const CARD_CLASS = 'gap-0 overflow-hidden p-0';
const GRAPH_HEIGHT = 'h-165 max-md:h-130';
const GUTTER_CLASS = 'flex w-max min-w-full pr-8 pl-(--gx) max-md:pr-5';
// Room for the details card, so whatever it covers can be scrolled out from under it.
const PANEL_ROOM = 'pr-[calc(20rem+1.5rem)]';
// Only the room closing animates, so the scroll clamps smoothly; opening stays instant for the scroll into view.
const ROOM_CLOSING =
    'transition-[padding] duration-300 ease-out motion-reduce:transition-none';
const CONTAINER_CLASS = '@container [scrollbar-gutter:stable]';

const AXIS = 48;
const GRAPH_WIDTH = 'calc(var(--cols) * var(--cw))';

const ZoneLabel: FC<{
    types: FranchiseModel['current']['contentType'][];
    label: string;
    count: number;
    compact?: boolean;
}> = ({ types, label, count, compact }) => (
    <span
        className={cn(
            'inline-flex min-w-0 items-center',
            compact ? 'gap-1' : 'gap-1.5',
        )}
    >
        {types.map((type) => {
            const Icon = CONTENT_TYPE_ICONS[type];
            return <Icon key={type} className="size-3.5 shrink-0" />;
        })}
        {!compact && <span className="truncate">{label}</span>}
        <span className="tabular-nums opacity-60">{count}</span>
    </span>
);

function zoneCounts(model: FranchiseModel) {
    const types = sourceTypes(model);
    const left = model.nodes.filter((node) => node.lane === 'source').length;

    return { types, left, right: model.nodes.length - left };
}

const TopAxis: FC<{
    ref: Ref<HTMLDivElement>;
    className?: string;
    children: ReactNode;
}> = ({ ref, className, children }) => (
    <div className="flex border-b">
        <span className="w-(--axis) shrink-0 border-r" />
        <div
            ref={ref}
            className={cn(CONTAINER_CLASS, 'min-w-0 flex-1 overflow-hidden')}
        >
            <div className={cn(GUTTER_CLASS, className)}>
                <div
                    className="relative mx-auto flex h-10 whitespace-nowrap font-medium text-muted-foreground text-xs leading-4"
                    style={{ width: GRAPH_WIDTH }}
                >
                    {children}
                </div>
            </div>
        </div>
    </div>
);

const ZoneLabels: FC<{
    model: FranchiseModel;
    layout: GraphLayout;
    isDesktop: boolean;
}> = ({ model, layout, isDesktop }) => {
    const zones = zoneCounts(model);

    return (
        <>
            <span
                className="flex min-w-0 shrink-0 items-center justify-center overflow-hidden"
                style={{
                    width: `calc(var(--cw) * ${layout.sourceColumns})`,
                }}
            >
                <ZoneLabel
                    types={zones.types}
                    label={mediaListLabel(zones.types)}
                    count={zones.left}
                    compact={!isDesktop}
                />
            </span>
            <span className="flex min-w-0 flex-1 items-center justify-center overflow-hidden">
                <ZoneLabel
                    types={[model.current.contentType]}
                    label={CONTENT_TYPES[model.current.contentType].title_ua}
                    count={zones.right}
                />
            </span>
        </>
    );
};

const RailZone: FC<{
    types: FranchiseModel['current']['contentType'][];
    count: number;
    style: CSSProperties;
}> = ({ types, count, style }) => (
    <div
        className="absolute inset-x-0 flex flex-col items-center justify-center gap-1 font-medium text-muted-foreground text-xs leading-4"
        style={style}
    >
        {types.map((type) => {
            const Icon = CONTENT_TYPE_ICONS[type];
            return <Icon key={type} className="size-3.5 shrink-0" />;
        })}
        <span className="tabular-nums opacity-60">{count}</span>
    </div>
);

const RailZones: FC<{ model: FranchiseModel; layout: GraphLayout }> = ({
    model,
    layout,
}) => {
    const zones = zoneCounts(model);

    return (
        <>
            <RailZone
                types={zones.types}
                count={zones.left}
                style={{
                    top: 0,
                    height: `calc(var(--rh) * ${layout.sourceColumns})`,
                }}
            />
            <RailZone
                types={[model.current.contentType]}
                count={zones.right}
                style={{
                    top: `calc(var(--rh) * ${layout.sourceColumns})`,
                    bottom: 0,
                }}
            />
        </>
    );
};

const YearAxis: FC<{ layout: GraphLayout; horizontal: boolean }> = ({
    layout,
    horizontal,
}) =>
    layout.bands.map((band) =>
        horizontal ? (
            <div
                key={band.label}
                className="pointer-events-none absolute inset-y-0 font-semibold text-muted-foreground text-xs tabular-nums leading-[18px]"
                style={{
                    left: `calc(var(--cw) * ${band.top})`,
                    width: `calc(var(--cw) * ${band.height})`,
                }}
            >
                <span className="absolute top-1/2 left-[calc(var(--cw)/2)] -translate-x-1/2 -translate-y-1/2">
                    {band.label}
                </span>
                {band.height > 1 && (
                    <span
                        className="absolute top-1/2 h-px bg-border dark:bg-border/50"
                        style={{
                            left: 'calc(var(--cw) / 2 + 24px)',
                            right: 'calc(var(--cw) / 2)',
                        }}
                    />
                )}
            </div>
        ) : (
            <div
                key={band.label}
                className="pointer-events-none absolute inset-x-0 flex flex-col items-center font-semibold text-muted-foreground text-xs tabular-nums leading-[18px]"
                style={{
                    top: `calc(var(--rh) * ${band.top})`,
                    height: `calc(var(--rh) * ${band.height})`,
                    paddingTop: 'calc(var(--rh) / 2 - 9px)',
                }}
            >
                <span>{band.label}</span>
                {band.height > 1 && (
                    <span
                        className="absolute left-1/2 w-px bg-border dark:bg-border/50"
                        style={{
                            top: 'calc(var(--rh) / 2 + 14px)',
                            bottom: 'calc(var(--rh) / 2)',
                        }}
                    />
                )}
            </div>
        ),
    );

const findNode = (container: HTMLElement, id: string) =>
    container.querySelector(`[data-node="${CSS.escape(id)}"]`);

function scrollToNode(
    container: HTMLElement | null,
    id: string,
    behavior: ScrollBehavior,
    horizontal: boolean,
) {
    const node = container && findNode(container, id);
    if (!container || !node) return;

    const rect = node.getBoundingClientRect();
    const box = container.getBoundingClientRect();

    container.scrollTo({
        top:
            container.scrollTop +
            rect.top -
            box.top -
            container.clientHeight / (horizontal ? 2 : 3),
        left: horizontal
            ? container.scrollLeft +
              rect.left -
              box.left -
              container.clientWidth / 3
            : container.scrollLeft,
        behavior,
    });
}

export const FranchiseGraphSkeleton: FC = () => (
    <Card className={CARD_CLASS}>
        <div className="border-b px-4 py-3 max-md:px-3 max-md:py-2.5">
            <Skeleton className="h-8 w-full" />
        </div>
        <Skeleton className={cn(GRAPH_HEIGHT, 'rounded-none')} />
    </Card>
);

const FranchiseGraph: FC<Props> = ({ model: franchise }) => {
    const { user } = useSession();
    const isDesktop = useIsDesktop();
    const scrollRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const railRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<HTMLDivElement>(null);

    const saved = useGraphFiltersStore();
    const [restored, setRestored] = useState(false);
    const initialHidden = defaultHiddenTypes(franchise);
    const hidden = resolveHiddenTypes(franchise, saved.relations);
    const otherMedia = sourceTypes(franchise);
    const hiddenMedia = new Set(
        saved.hiddenMedia.filter((type) => otherMedia.includes(type)),
    );
    const mine = Boolean(user) && saved.mine;
    const { hideUnlinked, horizontal } = saved;
    const {
        zoom,
        dragging,
        canZoomIn,
        canZoomOut,
        zoomIn,
        zoomOut,
        resetZoom,
        panHandlers,
    } = useGraphZoom(scrollRef, graphRef);
    const [selected, setFocus] = useState<string | null>(null);
    const [fullscreen, setFullscreen] = useState(false);

    const shown = withoutMedia(franchise, hiddenMedia);
    const model = hideUnlinked ? withoutUnlinked(shown, hidden) : shown;
    const focus = model.nodes.some((node) => node.id === selected)
        ? selected
        : null;
    const name = useTitle(
        model.chain.reduce((first, node) =>
            node.when < first.when ? node : first,
        ).content,
    );
    const layout = layoutGraph(
        model,
        isDesktop ? DESKTOP_BUDGET : PHONE_BUDGET,
    );
    const screen = horizontal ? transposeLayout(layout) : layout;
    const view = computeGraphView(model, screen, hidden, focus, horizontal);
    const sizes = (horizontal ? SIZES_HORIZONTAL : SIZES)[
        isDesktop ? 'desktop' : 'phone'
    ][fullscreen ? 'full' : 'card'];
    const hasZone = layout.sourceColumns > 0;
    const compactDetails = !isDesktop;

    const filters: EdgeFilter[] = EDGE_TYPES.map((edgeType) => ({
        ...edgeType,
        count: shown.edges.filter((edge) => edge.type === edgeType.type).length,
        on: !hidden.has(edgeType.type),
    })).filter((filter) => filter.count > 0);

    const media: MediaFilter[] = otherMedia.map((type) => ({
        type,
        count: franchise.nodes.filter((node) => node.contentType === type)
            .length,
        on: !hiddenMedia.has(type),
    }));

    const focusNode = focus ? model.byId.get(focus) : undefined;
    const panelRoom = isDesktop && focusNode ? PANEL_ROOM : ROOM_CLOSING;
    const focusLinks = focus
        ? view.edges.filter((edge) => edge.a === focus || edge.b === focus)
              .length
        : 0;

    useEffect(() => {
        Promise.resolve(useGraphFiltersStore.persist.rehydrate()).then(() =>
            setRestored(true),
        );
    }, []);

    // biome-ignore lint/correctness/useExhaustiveDependencies: a new budget, node size or restored filters move the current title, so re-centre it.
    useEffect(() => {
        scrollToNode(
            scrollRef.current,
            model.current.id,
            'instant',
            horizontal,
        );
    }, [model.current.id, isDesktop, fullscreen, restored, horizontal]);

    useEffect(() => {
        if (!fullscreen) return;

        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = overflow;
        };
    }, [fullscreen]);

    useEffect(() => {
        if (!focus && !fullscreen) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            if (focus) setFocus(null);
            else setFullscreen(false);
        };
        window.addEventListener('keydown', onKeyDown);

        return () => window.removeEventListener('keydown', onKeyDown);
    }, [focus, fullscreen]);

    useEffect(() => {
        const container = scrollRef.current;
        const node = focus && container ? findNode(container, focus) : null;
        if (!container || !node) return;

        const bar = barRef.current;
        bar?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

        const rect = node.getBoundingClientRect();
        const visibleBottom = (bar ?? container).getBoundingClientRect()[
            bar ? 'top' : 'bottom'
        ];
        const box = container.getBoundingClientRect();
        const visibleRight = panelRef.current
            ? panelRef.current.getBoundingClientRect().left
            : box.right;
        const hiddenBelow = rect.bottom - visibleBottom;
        const hiddenRight = rect.right - visibleRight;
        const hiddenLeft = box.left - rect.left;
        const left =
            hiddenRight > 0
                ? hiddenRight + 16
                : hiddenLeft > 0
                  ? -(hiddenLeft + 16)
                  : 0;

        container.scrollBy({
            top: hiddenBelow > 0 ? hiddenBelow + 16 : 0,
            left,
            behavior: 'smooth',
        });
    }, [focus]);

    const toggleType = (type: GraphEdgeType) =>
        saved.setRelation(type, hidden.has(type), !initialHidden.has(type));

    const select = (id: string) => setFocus(focus === id ? null : id);

    const jumpTo = (id: string) => {
        setFocus(id);
        scrollToNode(scrollRef.current, id, 'smooth', horizontal);
    };

    const deselect = (event: MouseEvent) => {
        const target = event.target as Element;
        if (!target.closest('[data-node], [role="dialog"]')) setFocus(null);
    };

    const nodeState = (node: FranchiseNode): NodeState => {
        if (node.id === focus) return 'default';
        if (
            node !== model.current &&
            model.edges.length > 0 &&
            !view.linked.has(node.id)
        ) {
            return 'isolated';
        }
        if (
            (focus && !view.near.has(node.id)) ||
            (mine && !isTracked(node.content))
        ) {
            return 'far';
        }

        return 'default';
    };

    const padding = cn(
        'pb-6 max-md:pb-5',
        hasZone || horizontal ? 'pt-2' : 'pt-5',
        compactDetails && focusNode ? 'pb-28 max-md:pb-28' : ROOM_CLOSING,
    );

    const details = (variant: DetailsVariant) =>
        focusNode && (
            <GraphDetails
                model={model}
                node={focusNode}
                links={focusLinks}
                variant={variant}
                onSelect={jumpTo}
                onClose={() => setFocus(null)}
            />
        );

    const card = (
        <Card
            className={cn(
                CARD_CLASS,
                fullscreen &&
                    'fixed inset-0 z-50 rounded-none border-0 bg-background',
            )}
        >
            <GraphToolbar
                filters={filters}
                changed={
                    filters.filter(
                        (filter) =>
                            filter.on === initialHidden.has(filter.type),
                    ).length +
                    hiddenMedia.size +
                    Number(mine) +
                    Number(hideUnlinked)
                }
                onToggle={toggleType}
                media={media}
                onToggleMedia={saved.toggleMedia}
                mine={user ? mine : null}
                onToggleMine={saved.toggleMine}
                hideUnlinked={hideUnlinked}
                onToggleHideUnlinked={saved.toggleHideUnlinked}
                horizontal={horizontal}
                onToggleHorizontal={saved.toggleHorizontal}
                onReset={saved.reset}
                fullscreen={fullscreen}
                onToggleFullscreen={() => setFullscreen(!fullscreen)}
                title={name}
                isDesktop={isDesktop}
            />
            <div
                className={cn(
                    'relative flex min-h-0 flex-col',
                    fullscreen ? 'flex-1' : GRAPH_HEIGHT,
                )}
                style={
                    {
                        '--axis': `${AXIS}px`,
                        '--cols': screen.columns,
                        '--zoom': zoom,
                        '--cw0': sizes.cw,
                        '--cw': 'calc(var(--cw0) * var(--zoom))',
                        '--rh': `calc(${sizes.rh} * var(--zoom))`,
                        '--gp': `calc(${sizes.gp} * var(--zoom))`,
                        '--gx': sizes.gx,
                    } as CSSProperties
                }
            >
                {(hasZone || horizontal) && (
                    <TopAxis ref={headerRef} className={panelRoom}>
                        {horizontal ? (
                            <YearAxis layout={layout} horizontal />
                        ) : (
                            <ZoneLabels
                                model={model}
                                layout={layout}
                                isDesktop={isDesktop}
                            />
                        )}
                    </TopAxis>
                )}
                <div className="relative flex min-h-0 flex-1">
                    <div
                        ref={railRef}
                        aria-hidden="true"
                        onWheel={(event) =>
                            scrollRef.current?.scrollBy(
                                event.deltaX,
                                event.deltaY,
                            )
                        }
                        className="w-(--axis) shrink-0 overflow-hidden border-r"
                    >
                        <div className={padding}>
                            <div
                                className="relative"
                                style={{
                                    height: `calc(var(--rh) * ${screen.rows})`,
                                }}
                            >
                                {!horizontal ? (
                                    <YearAxis
                                        layout={layout}
                                        horizontal={false}
                                    />
                                ) : (
                                    hasZone && (
                                        <RailZones
                                            model={model}
                                            layout={layout}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                        {/* Room for the scroller's horizontal scrollbar, so both reach the same bottom. */}
                        <div className="h-4" />
                    </div>
                    {/* biome-ignore lint/a11y/noStaticElementInteractions: clicking empty space deselects; Escape does the same from the keyboard. */}
                    {/* biome-ignore lint/a11y/useKeyWithClickEvents: Escape is the keyboard path, handled on window. */}
                    <div
                        ref={scrollRef}
                        onClick={deselect}
                        {...panHandlers}
                        onScroll={(event) => {
                            const { scrollLeft, scrollTop } =
                                event.currentTarget;
                            if (headerRef.current) {
                                headerRef.current.scrollLeft = scrollLeft;
                            }
                            if (railRef.current) {
                                railRef.current.scrollTop = scrollTop;
                            }
                        }}
                        className={cn(
                            CONTAINER_CLASS,
                            'min-h-0 min-w-0 flex-1 cursor-grab touch-pan-x touch-pan-y select-none overflow-auto overscroll-contain',
                            dragging && 'cursor-grabbing *:cursor-grabbing',
                        )}
                    >
                        <div
                            className={cn(
                                'min-h-full',
                                GUTTER_CLASS,
                                panelRoom,
                            )}
                        >
                            <div className={cn('mx-auto', padding)}>
                                <div
                                    ref={graphRef}
                                    className="relative"
                                    style={{
                                        width: GRAPH_WIDTH,
                                        height: `calc(var(--rh) * ${screen.rows})`,
                                    }}
                                >
                                    {hasZone && (
                                        <div
                                            className={cn(
                                                'absolute top-0 left-0 rounded-(--base-radius) bg-secondary/20',
                                                horizontal
                                                    ? 'right-0'
                                                    : 'bottom-0',
                                            )}
                                            style={
                                                horizontal
                                                    ? {
                                                          height: `calc(var(--rh) * ${layout.sourceColumns})`,
                                                      }
                                                    : {
                                                          width: `calc(var(--cw) * ${layout.sourceColumns})`,
                                                      }
                                            }
                                        />
                                    )}
                                    {layout.bands
                                        .filter((band) => band.top > 0)
                                        .map((band) => (
                                            <div
                                                key={band.label}
                                                className={cn(
                                                    'absolute bg-border dark:bg-border/50',
                                                    horizontal
                                                        ? 'inset-y-0 w-px'
                                                        : 'left-0 h-px',
                                                )}
                                                style={
                                                    horizontal
                                                        ? {
                                                              left: `calc(var(--cw) * ${band.top})`,
                                                          }
                                                        : {
                                                              top: `calc(var(--rh) * ${band.top})`,
                                                              width: GRAPH_WIDTH,
                                                          }
                                                }
                                            />
                                        ))}
                                    <svg
                                        className="pointer-events-none absolute top-0 left-0 overflow-visible"
                                        style={{
                                            width: GRAPH_WIDTH,
                                            height: `calc(var(--rh) * ${screen.rows})`,
                                        }}
                                        viewBox={`0 0 ${screen.columns * CELL} ${screen.rows * CELL}`}
                                        preserveAspectRatio="none"
                                        aria-hidden="true"
                                    >
                                        {view.edges.map((edge) => {
                                            const style = edgeStyle(
                                                edge,
                                                view.dense,
                                                focus !== null,
                                            );

                                            return (
                                                <path
                                                    key={edge.key}
                                                    d={edge.path}
                                                    fill="none"
                                                    stroke={
                                                        RELATION_GROUP_STYLES[
                                                            RELATION_TYPE_GROUPS[
                                                                edge.type
                                                            ]
                                                        ].stroke
                                                    }
                                                    strokeWidth={style.width}
                                                    strokeDasharray={
                                                        style.dashed
                                                            ? '4 4'
                                                            : undefined
                                                    }
                                                    opacity={style.opacity}
                                                    vectorEffect="non-scaling-stroke"
                                                    className="transition-opacity"
                                                />
                                            );
                                        })}
                                    </svg>
                                    {model.nodes.map((node) => {
                                        const position = screen.positions.get(
                                            node.id,
                                        );
                                        if (!position) return null;

                                        return (
                                            <GraphNode
                                                key={node.id}
                                                node={node}
                                                position={position}
                                                isCurrent={
                                                    node === model.current
                                                }
                                                isSelected={node.id === focus}
                                                state={nodeState(node)}
                                                showMedia={
                                                    node.contentType !==
                                                    model.current.contentType
                                                }
                                                compactMedia={!isDesktop}
                                                imageSizes={`${Math.round(sizes.image * zoom)}px`}
                                                largeImage={
                                                    fullscreen || zoom > 1
                                                }
                                                onSelect={select}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    {!(compactDetails && focusNode) && (
                        <GraphZoomControls
                            zoom={zoom}
                            canZoomIn={canZoomIn}
                            canZoomOut={canZoomOut}
                            onZoomIn={zoomIn}
                            onZoomOut={zoomOut}
                            onReset={resetZoom}
                            className="bottom-3 left-[calc(var(--axis)+--spacing(3))]"
                        />
                    )}
                    {isDesktop && focusNode && (
                        <div
                            ref={panelRef}
                            role="dialog"
                            aria-label="Деталі тайтлу"
                            className="absolute top-3 right-3 z-8 flex max-h-[calc(100%-1.5rem)] w-80 flex-col gap-4 overflow-y-auto rounded-md border bg-popover p-4 text-popover-foreground shadow-md"
                        >
                            {details('panel')}
                        </div>
                    )}
                </div>
                {compactDetails && focusNode && (
                    <div
                        ref={barRef}
                        role="dialog"
                        aria-label="Деталі тайтлу"
                        className={cn(
                            'absolute inset-x-0 bottom-0 z-8 scroll-mb-20 border-t bg-popover p-3 text-popover-foreground',
                            fullscreen &&
                                'pb-[calc(--spacing(3)+var(--safe-area-bottom))]',
                        )}
                    >
                        {details('row')}
                    </div>
                )}
            </div>
        </Card>
    );

    return fullscreen ? createPortal(card, document.body) : card;
};

export default FranchiseGraph;
