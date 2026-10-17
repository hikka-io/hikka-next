import {
    type CSSProperties,
    type FC,
    type MouseEvent,
    type ReactNode,
    type Ref,
    useEffect,
    useEffectEvent,
    useMemo,
    useRef,
    useState,
} from 'react';

import { DEFAULT_CONTAINER_RATIO } from '@/components/content-card/image-presets';
import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import { SearchModal } from '@/features/search';
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
    relatedNodes,
    relationPath,
    sourceTypes,
} from '../franchise-model';
import {
    EDGE_TYPES,
    mediaListLabel,
    RELATION_GROUP_STYLES,
} from '../relation-groups';
import GraphDetails from './graph-details';
import GraphDrawer from './graph-drawer';
import { type GraphLabels, useGraphFiltersStore } from './graph-filters-store';
import GraphHelp from './graph-help';
import GraphHint from './graph-hint';
import {
    DESKTOP_BUDGET,
    type GraphLayout,
    layoutGraph,
    PHONE_BUDGET,
    transposeLayout,
} from './graph-layout';
import GraphNode, { type NodeState } from './graph-node';
import GraphSearch from './graph-search';
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
    searchNodes,
    withoutMedia,
    withoutUnlinked,
} from './graph-view';
import GraphZoomControls from './graph-zoom-controls';
import { useGraphKeys } from './use-graph-keys';
import { useGraphZoom, type VisibleBox } from './use-graph-zoom';

type Props = {
    model: FranchiseModel;
    selected: string | null;
    onSelectedChange: (id: string | null) => void;
    expanded: boolean;
    onExpandedChange: (expanded: boolean) => void;
    fullscreen: boolean;
    onToggleFullscreen: () => void;
};

type Device = 'desktop' | 'phone';

// `rh` is the row height in px at 100%; `image` is the poster's width in px at 100%, for the
// `sizes` attribute, which cannot read CSS variables.
type Sizes = { cw: string; rh: number; gp: string; gx: string; image: number };

const SIZES: Record<Device, Sizes> = {
    desktop: {
        cw: 'clamp(76px, calc((100cqw - 72px) / var(--cols)), 320px)',
        rh: 164,
        gp: 'min(76px, calc(var(--cw0) * 0.78))',
        gx: '16px',
        image: 76,
    },
    phone: {
        cw: 'max(72px, calc((100cqw - 24px) / var(--cols)))',
        rh: 128,
        gp: '56px',
        gx: '12px',
        image: 56,
    },
};

// Horizontal steps are fixed: years run off to the right instead of filling the card's width.
// A year step leaves about a poster's width of air; a lane fits a poster, its media label and room
// for the lines that run between lanes.
const YEAR_WIDTH: Record<Device, number> = { desktop: 168, phone: 108 };
const SIZES_HORIZONTAL: typeof SIZES = {
    desktop: {
        cw: `${YEAR_WIDTH.desktop}px`,
        rh: 204,
        gp: '76px',
        gx: '16px',
        image: 76,
    },
    phone: {
        cw: `${YEAR_WIDTH.phone}px`,
        rh: 160,
        gp: '56px',
        gx: '12px',
        image: 56,
    },
};

const GUTTER_CLASS = 'flex w-max min-w-full pr-8 pl-(--gx) max-md:pr-5';
// Room for the details card, so whatever it covers can be scrolled out from under it.
const PANEL_ROOM = 'pr-[calc(var(--panel-w)+1.5rem)]';
const PANEL_WIDTH = '21.5rem';
// Only the room closing animates, so the scroll clamps smoothly; opening stays instant for the scroll into view.
const ROOM_CLOSING =
    'transition-[padding] duration-300 ease-out motion-reduce:transition-none';
const CONTAINER_CLASS = '@container [scrollbar-gutter:stable]';

const AXIS = 48;

// Below this a poster has no room for its label, order tile or list status.
const DETAIL_MIN_ZOOM = 0.5;
// The gap under a poster that fits a two-line label and its offset.
const TWO_LINE_LABEL_ROOM = 52;
// Year labels closer than this, along the year axis, would overlap.
const YEAR_GAP = { vertical: 24, horizontal: 44 };
const GRAPH_WIDTH = 'calc(var(--cols) * var(--cw))';

const ZoneLabel: FC<{
    types: FranchiseModel['current']['contentType'][];
    label?: string;
    count: number;
    vertical?: boolean;
    className?: string;
}> = ({ types, label, count, vertical, className }) => (
    <span
        className={cn(
            'inline-flex items-center',
            label ? 'min-w-0 gap-1.5' : 'shrink-0 gap-1',
            vertical && 'flex-col',
            className,
        )}
    >
        {types.map((type) => {
            const Icon = CONTENT_TYPE_ICONS[type];
            return <Icon key={type} className="size-3.5 shrink-0" />;
        })}
        {label && <span className="truncate">{label}</span>}
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

// Auto margins centre a label in its zone; when it is wider they drop to zero and the label hangs
// off the border between the zones outwards, so the two never overlap.
const ZoneLabels: FC<{
    model: FranchiseModel;
    layout: GraphLayout;
    withText: boolean;
}> = ({ model, layout, withText }) => {
    const zones = zoneCounts(model);

    return (
        <>
            <span
                className="flex shrink-0 items-center justify-end pr-1.5"
                style={{
                    width: `calc(var(--cw) * ${layout.sourceColumns})`,
                }}
            >
                <ZoneLabel
                    types={zones.types}
                    label={withText ? mediaListLabel(zones.types) : undefined}
                    count={zones.left}
                    className="mx-auto"
                />
            </span>
            <span className="flex min-w-0 flex-1 items-center pl-1.5">
                <ZoneLabel
                    types={[model.current.contentType]}
                    label={
                        withText
                            ? CONTENT_TYPES[model.current.contentType].title_ua
                            : undefined
                    }
                    count={zones.right}
                    className="mx-auto"
                />
            </span>
        </>
    );
};

// A label taller than its zone sits against the graph's outer edge, so the two only meet when the
// whole graph is shorter than both.
const RailZone: FC<{
    types: FranchiseModel['current']['contentType'][];
    count: number;
    edge: 'top' | 'bottom';
    style: CSSProperties;
}> = ({ types, count, edge, style }) => (
    <div
        className={cn(
            'absolute inset-x-0 flex flex-col items-center font-medium text-muted-foreground text-xs leading-4',
            edge === 'top' ? 'justify-start' : 'justify-end',
        )}
        style={style}
    >
        <ZoneLabel types={types} count={count} vertical className="my-auto" />
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
                edge="top"
                style={{
                    top: 0,
                    height: `calc(var(--rh) * ${layout.sourceColumns})`,
                }}
            />
            <RailZone
                types={[model.current.contentType]}
                count={zones.right}
                edge="bottom"
                style={{
                    top: `calc(var(--rh) * ${layout.sourceColumns})`,
                    bottom: 0,
                }}
            />
        </>
    );
};

/** The bands whose year labels keep their distance, `step` pixels apart per row or column. */
function spacedBands(layout: GraphLayout, step: number, gap: number) {
    let last = Number.NEGATIVE_INFINITY;

    return layout.bands.filter((band) => {
        const at = (band.top + 0.5) * step;
        if (at - last < gap) return false;
        last = at;
        return true;
    });
}

const YearAxis: FC<{
    layout: GraphLayout;
    horizontal: boolean;
    step: number;
}> = ({ layout, horizontal, step }) =>
    spacedBands(
        layout,
        step,
        YEAR_GAP[horizontal ? 'horizontal' : 'vertical'],
    ).map((band) =>
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
                className="pointer-events-none absolute inset-x-0 font-semibold text-muted-foreground text-xs tabular-nums leading-[18px]"
                style={{
                    top: `calc(var(--rh) * ${band.top})`,
                    height: `calc(var(--rh) * ${band.height})`,
                }}
            >
                <span className="absolute top-[calc(var(--rh)/2)] left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {band.label}
                </span>
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

// A node's label hangs below its box, so it is measured with its children.
const nodeParts = (container: HTMLElement, id: string) => {
    const node = findNode(container, id);
    return node ? [node, ...node.children] : [];
};

function visibleBox(
    container: HTMLElement,
    panel: HTMLElement | null,
    bar: HTMLElement | null,
): VisibleBox {
    const box = container.getBoundingClientRect();

    return {
        left: box.left,
        top: box.top,
        right:
            panel?.getBoundingClientRect().left ??
            box.left + container.clientWidth,
        bottom:
            bar?.getBoundingClientRect().top ??
            box.top + container.clientHeight,
    };
}

function boundingRect(elements: Element[]): DOMRect | null {
    const rects = elements.map((element) => element.getBoundingClientRect());
    if (!rects.length) return null;

    const left = Math.min(...rects.map((rect) => rect.left));
    const top = Math.min(...rects.map((rect) => rect.top));
    const right = Math.max(...rects.map((rect) => rect.right));
    const bottom = Math.max(...rects.map((rect) => rect.bottom));

    return new DOMRect(left, top, right - left, bottom - top);
}

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

const FranchiseGraph: FC<Props> = ({
    model: franchise,
    selected,
    onSelectedChange: setFocus,
    expanded,
    onExpandedChange: setExpanded,
    fullscreen,
    onToggleFullscreen,
}) => {
    const { user } = useSession();
    const isDesktop = useIsDesktop();
    const scrollRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const railRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const pendingRef = useRef<{ id: string; zoom: boolean } | null>(null);

    const saved = useGraphFiltersStore();
    const [restored, setRestored] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);
    const [peek, setPeek] = useState(0);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [siteQuery, setSiteQuery] = useState<string | null>(null);
    const initialHidden = defaultHiddenTypes(franchise);
    // Memoised by hand: the compiler rebuilds these on every zoom step, and the edge routing below is costly.
    const hidden = useMemo(
        () => resolveHiddenTypes(franchise, saved.relations),
        [franchise, saved.relations],
    );
    const otherMedia = useMemo(() => sourceTypes(franchise), [franchise]);
    const hiddenMedia = useMemo(
        () =>
            new Set(
                saved.hiddenMedia.filter((type) => otherMedia.includes(type)),
            ),
        [saved.hiddenMedia, otherMedia],
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
        frame,
        panHandlers,
    } = useGraphZoom(scrollRef, graphRef, (container) =>
        visibleBox(container, panelRef.current, barRef.current),
    );

    const shown = useMemo(
        () => withoutMedia(franchise, hiddenMedia),
        [franchise, hiddenMedia],
    );
    const model = useMemo(
        () => (hideUnlinked ? withoutUnlinked(shown, hidden) : shown),
        [hideUnlinked, shown, hidden],
    );
    const focus = model.nodes.some((node) => node.id === selected)
        ? selected
        : null;
    const name = useTitle(
        model.chain.reduce((first, node) =>
            node.when < first.when ? node : first,
        ).content,
    );
    const layout = useMemo(
        () => layoutGraph(model, isDesktop ? DESKTOP_BUDGET : PHONE_BUDGET),
        [model, isDesktop],
    );
    const screen = useMemo(
        () => (horizontal ? transposeLayout(layout) : layout),
        [horizontal, layout],
    );
    const view = useMemo(
        () => computeGraphView(model, screen, hidden, focus, horizontal),
        [model, screen, hidden, focus, horizontal],
    );
    const device: Device = isDesktop ? 'desktop' : 'phone';
    const sizes = (horizontal ? SIZES_HORIZONTAL : SIZES)[device];
    const hasZone = layout.sourceColumns > 0;
    const defaultLabels: GraphLabels = isDesktop ? 'all' : 'focus';
    const chosenLabels = saved.labels ?? defaultLabels;
    const detailed = zoom >= DETAIL_MIN_ZOOM;
    const labels = detailed ? chosenLabels : 'none';
    const labelLines =
        (sizes.rh - sizes.image / DEFAULT_CONTAINER_RATIO) * zoom >=
        TWO_LINE_LABEL_ROOM
            ? 2
            : 1;
    const yearStep = (horizontal ? YEAR_WIDTH[device] : sizes.rh) * zoom;
    const hasOrder = model.chain.length > 1;
    // Stepped, so zooming does not hand every poster a new `sizes`.
    const imageSizes = `${sizes.image * Math.max(1, Math.ceil(zoom))}px`;

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

    const results = searchNodes(model, query);
    const matches =
        searchOpen && query.trim()
            ? new Set(results.map((node) => node.id))
            : null;
    const focusNode = focus ? model.byId.get(focus) : undefined;
    const path = useMemo(
        () =>
            new Set(
                focus
                    ? relationPath(model, focus, model.current.id).map(
                          (node) => node.id,
                      )
                    : [],
            ),
        [model, focus],
    );
    const sheetExpanded = expanded && focusNode !== undefined;
    const panelRoom = isDesktop && focusNode ? PANEL_ROOM : ROOM_CLOSING;

    useEffect(() => {
        Promise.resolve(useGraphFiltersStore.persist.rehydrate()).then(() =>
            setRestored(true),
        );
    }, []);

    // biome-ignore lint/correctness/useExhaustiveDependencies: a new budget, node size or restored filters move the titles, so re-centre the selected or current one.
    useEffect(() => {
        scrollToNode(
            scrollRef.current,
            focus ?? model.current.id,
            'instant',
            horizontal,
        );
    }, [model.current.id, isDesktop, fullscreen, restored, horizontal]);

    const toggleType = (type: GraphEdgeType) =>
        saved.setRelation(type, hidden.has(type), !initialHidden.has(type));

    const deselectAll = () => {
        setFocus(null);
        setExpanded(false);
    };

    const select = (id: string) =>
        focus === id ? deselectAll() : setFocus(id);

    const jumpTo = (id: string, zoom = false) => {
        if (id === focus) {
            frameTitle(id, zoom);
            return;
        }
        pendingRef.current = { id, zoom };
        setFocus(id);
    };

    const frameNodes = (ids: Iterable<string>, cap: number | null) => {
        const container = scrollRef.current;
        const rect =
            container &&
            boundingRect([...ids].flatMap((id) => nodeParts(container, id)));
        if (rect) frame(rect, cap);
    };

    const showOnGraph = (id: string) => {
        setExpanded(false);
        jumpTo(id);
    };

    const frameTitle = (id: string, zoom: boolean) =>
        zoom
            ? frameNodes(
                  [id, ...relatedNodes(model, id).map((node) => node.id)],
                  1,
              )
            : frameNodes([id], null);

    const fitAll = () => {
        const graph = graphRef.current;
        if (graph) frame(graph.getBoundingClientRect(), 1);
    };

    // A jump frames the title after its panel or sheet renders; a click only reveals it.
    const reveal = useEffectEvent((id: string) => {
        const container = scrollRef.current;
        const pending = pendingRef.current;
        if (pending?.id === id) {
            pendingRef.current = null;
            frameTitle(id, pending.zoom);
            return;
        }

        const rect = container && boundingRect(nodeParts(container, id));
        if (!container || !rect) return;

        const box = visibleBox(container, panelRef.current, barRef.current);
        const hiddenBelow = rect.bottom - box.bottom;
        const hiddenAbove = box.top - rect.top;
        const hiddenRight = rect.right - box.right;
        const hiddenLeft = box.left - rect.left;
        const top =
            hiddenBelow > 0
                ? hiddenBelow + 16
                : hiddenAbove > 0
                  ? -(hiddenAbove + 16)
                  : 0;
        const left =
            hiddenRight > 0
                ? hiddenRight + 16
                : hiddenLeft > 0
                  ? -(hiddenLeft + 16)
                  : 0;

        if (top || left) container.scrollBy({ top, left, behavior: 'smooth' });
    });

    useEffect(() => {
        if (focus) reveal(focus);
    }, [focus]);

    const locate = () => jumpTo(model.current.id, true);

    const cursor = focus ?? model.current.id;

    useGraphKeys(rootRef, {
        Equal: zoomIn,
        'Shift+Equal': zoomIn,
        NumpadAdd: zoomIn,
        Minus: zoomOut,
        NumpadSubtract: zoomOut,
        Digit0: resetZoom,
        Numpad0: resetZoom,
        'Shift+Digit1': fitAll,
        'Shift+Digit2': () => (focus ? frameTitle(focus, true) : false),
        KeyC: locate,
        'Mod+KeyF': () => toggleSearch(true),
        '?': () => setHelpOpen(true),
        KeyF: () => (isDesktop ? onToggleFullscreen() : false),
    });

    // Clicks in portalled popups bubble here through React but sit outside the scroller in the DOM.
    const deselect = (event: MouseEvent) => {
        const target = event.target as Element;
        if (
            event.currentTarget.contains(target) &&
            !target.closest('[data-node]')
        ) {
            deselectAll();
        }
    };

    const orderOf = (node: FranchiseNode) =>
        hasOrder && saved.order && node.chainIndex !== null
            ? node.chainIndex + 1
            : null;

    const toggleSearch = (open: boolean) => {
        setSearchOpen(open);
        if (!open) setQuery('');
    };

    const pick = (id: string) => {
        toggleSearch(false);
        jumpTo(id);
    };

    const searchSite = (text: string) => {
        toggleSearch(false);
        setSiteQuery(text);
    };

    const nodeState = (node: FranchiseNode): NodeState => {
        if (node === model.current) return 'default';
        if (matches) return matches.has(node.id) ? 'default' : 'far';
        if (node.id === focus) return 'default';
        if (model.edges.length > 0 && !view.linked.has(node.id)) {
            return 'isolated';
        }
        if (
            (focus && !view.near.has(node.id) && !path.has(node.id)) ||
            (mine && !isTracked(node.content))
        ) {
            return 'far';
        }

        return 'default';
    };

    const padding = cn(
        'pb-6 max-md:pb-20',
        hasZone || horizontal ? 'pt-2' : 'pt-5',
        !isDesktop && focusNode ? 'max-md:pb-52' : ROOM_CLOSING,
    );

    const zoomControls = (className?: string) => (
        <GraphZoomControls
            zoom={zoom}
            canZoomIn={canZoomIn}
            canZoomOut={canZoomOut}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onFit={fitAll}
            onLocate={locate}
            size={isDesktop ? 'sm' : 'md'}
            className={className}
        />
    );

    return (
        <div ref={rootRef} className="contents">
            <GraphToolbar
                filters={filters}
                changed={
                    hiddenMedia.size +
                    Number(mine) +
                    Number(hideUnlinked) +
                    Number(saved.labels !== null) +
                    Number(hasOrder && !saved.order)
                }
                onToggle={toggleType}
                media={media}
                onToggleMedia={saved.toggleMedia}
                mine={user ? mine : null}
                onToggleMine={saved.toggleMine}
                hideUnlinked={hideUnlinked}
                onToggleHideUnlinked={saved.toggleHideUnlinked}
                labels={chosenLabels}
                onLabelsChange={(next) => saved.setLabels(next, defaultLabels)}
                order={hasOrder ? saved.order : null}
                onToggleOrder={saved.toggleOrder}
                horizontal={horizontal}
                onToggleHorizontal={saved.toggleHorizontal}
                onReset={saved.reset}
                fullscreen={fullscreen}
                onToggleFullscreen={onToggleFullscreen}
                title={name}
                isDesktop={isDesktop}
                onHelp={() => setHelpOpen(true)}
                search={(headerButtonClassName) => (
                    <GraphSearch
                        model={model}
                        isDesktop={isDesktop}
                        open={searchOpen}
                        onOpenChange={toggleSearch}
                        query={query}
                        onQueryChange={setQuery}
                        results={results}
                        onPick={pick}
                        onSearchSite={searchSite}
                        headerButtonClassName={headerButtonClassName}
                    />
                )}
            />
            <div
                className="relative flex min-h-0 flex-1 flex-col"
                style={
                    {
                        '--axis': `${AXIS}px`,
                        '--panel-w': PANEL_WIDTH,
                        '--cols': screen.columns,
                        '--zoom': zoom,
                        '--cw0': sizes.cw,
                        '--cw': 'calc(var(--cw0) * var(--zoom))',
                        '--rh': `calc(${sizes.rh}px * var(--zoom))`,
                        '--gp': `calc(${sizes.gp} * var(--zoom))`,
                        '--gx': sizes.gx,
                        '--node-radius':
                            'calc(var(--base-radius) * min(1, var(--zoom)))',
                    } as CSSProperties
                }
            >
                {(hasZone || horizontal) && (
                    <TopAxis ref={headerRef} className={panelRoom}>
                        {horizontal ? (
                            <YearAxis
                                layout={layout}
                                horizontal
                                step={yearStep}
                            />
                        ) : (
                            <ZoneLabels
                                model={model}
                                layout={layout}
                                withText={isDesktop && detailed}
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
                                        step={yearStep}
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
                                            const lit = matches
                                                ? matches.has(edge.a) &&
                                                  matches.has(edge.b)
                                                : edge.touched ||
                                                  (path.has(edge.a) &&
                                                      path.has(edge.b));
                                            const style = edgeStyle(
                                                { ...edge, touched: lit },
                                                view.dense,
                                                matches !== null ||
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
                                        const isCurrent =
                                            node === model.current;
                                        const isSelected = node.id === focus;
                                        const isMatch =
                                            matches?.has(node.id) ?? false;

                                        return (
                                            <GraphNode
                                                key={node.id}
                                                node={node}
                                                position={position}
                                                isCurrent={isCurrent}
                                                isSelected={isSelected}
                                                state={nodeState(node)}
                                                order={
                                                    detailed
                                                        ? orderOf(node)
                                                        : null
                                                }
                                                showStatus={detailed}
                                                labelLines={labelLines}
                                                showLabel={
                                                    labels === 'all' ||
                                                    (labels === 'focus' &&
                                                        (isCurrent ||
                                                            isSelected ||
                                                            isMatch))
                                                }
                                                highlight={isMatch}
                                                wideLabel={
                                                    !isDesktop &&
                                                    (isCurrent || isSelected)
                                                }
                                                showMedia={
                                                    node.contentType !==
                                                    model.current.contentType
                                                }
                                                tabbable={node.id === cursor}
                                                imageSizes={imageSizes}
                                                onSelect={select}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    {isDesktop &&
                        zoomControls(
                            'absolute bottom-3 left-[calc(var(--axis)+--spacing(3))] z-7',
                        )}
                    {isDesktop && focusNode && (
                        <section
                            ref={panelRef}
                            aria-label="Обраний тайтл"
                            className="absolute top-3 right-3 z-8 flex max-h-[calc(100%-1.5rem)] w-(--panel-w) flex-col gap-4 overflow-y-auto rounded-md border bg-popover p-4 text-popover-foreground shadow-md"
                        >
                            <GraphDetails
                                key={focusNode.id}
                                model={model}
                                node={focusNode}
                                variant="panel"
                                onSelect={jumpTo}
                                onShow={showOnGraph}
                                onClose={deselectAll}
                            />
                        </section>
                    )}
                </div>
                {!isDesktop && (
                    <div
                        ref={barRef}
                        className="pointer-events-none absolute inset-x-0 bottom-0 z-8 flex flex-col items-center transition-[padding] duration-450 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={
                            focusNode ? { paddingBottom: peek + 12 } : undefined
                        }
                    >
                        {restored && !saved.hintSeen && !focusNode ? (
                            <GraphHint onDismiss={saved.dismissHint} />
                        ) : (
                            !sheetExpanded &&
                            zoomControls(
                                cn(
                                    'pointer-events-auto',
                                    !focusNode &&
                                        'mb-[calc(--spacing(3)+var(--safe-area-bottom))]',
                                ),
                            )
                        )}
                    </div>
                )}
            </div>
            {!isDesktop && (
                <GraphDrawer
                    model={model}
                    node={focusNode}
                    expanded={sheetExpanded}
                    onExpandedChange={setExpanded}
                    onClose={deselectAll}
                    peek={peek}
                    onPeekChange={setPeek}
                    onSelect={jumpTo}
                    onShow={showOnGraph}
                />
            )}
            <GraphHelp open={helpOpen} onOpenChange={setHelpOpen} />
            {siteQuery !== null && (
                <SearchModal
                    open
                    onOpenChange={(open) => !open && setSiteQuery(null)}
                    initialQuery={siteQuery}
                    disableHotkey
                />
            )}
        </div>
    );
};

export default FranchiseGraph;
