import {
    type CSSProperties,
    type FC,
    type MouseEvent,
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
import GraphDetails from './graph-details';
import {
    DESKTOP_BUDGET,
    type GraphLayout,
    layoutGraph,
    PHONE_BUDGET,
} from './graph-layout';
import GraphNode, { type NodeState } from './graph-node';
import GraphToolbar, { type EdgeFilter } from './graph-toolbar';
import {
    CELL,
    computeGraphView,
    defaultHiddenTypes,
    edgeStyle,
} from './graph-view';

type Props = {
    model: FranchiseModel;
};

type Sizes = { cw: string; rh: string; gp: string; gx: string };

const SIZES: Record<'desktop' | 'phone', Record<'card' | 'full', Sizes>> = {
    desktop: {
        card: {
            cw: 'max(76px, calc((100cqw - 104px) / var(--cols)))',
            rh: '116px',
            gp: '60px',
            gx: '16px',
        },
        full: {
            cw: 'clamp(96px, calc((100cqw - 120px) / var(--cols)), 320px)',
            rh: '140px',
            gp: '76px',
            gx: '16px',
        },
    },
    phone: {
        card: {
            cw: 'max(64px, calc((100cqw - 80px) / var(--cols)))',
            rh: '104px',
            gp: '52px',
            gx: '12px',
        },
        full: {
            cw: 'max(72px, calc((100cqw - 72px) / var(--cols)))',
            rh: '112px',
            gp: '56px',
            gx: '12px',
        },
    },
};

const CARD_CLASS = 'gap-0 overflow-hidden p-0';
const SCROLL_HEIGHT = 'h-155 max-md:h-120';
const GUTTER_CLASS = 'pr-8 pl-(--gx) max-md:pr-5';
const CONTAINER_CLASS = '@container [scrollbar-gutter:stable]';

const GRAPH_WIDTH = 'calc(var(--axis) + var(--cols) * var(--cw))';

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

const ZoneHeader: FC<{
    model: FranchiseModel;
    layout: GraphLayout;
    isDesktop: boolean;
}> = ({ model, layout, isDesktop }) => {
    const left = sourceTypes(model);
    const leftCount = model.nodes.filter(
        (node) => node.lane === 'source',
    ).length;

    return (
        <div className={cn(CONTAINER_CLASS, 'overflow-hidden border-b')}>
            <div className={GUTTER_CLASS}>
                <div
                    className="mx-auto flex whitespace-nowrap py-3 pl-(--axis) font-medium text-muted-foreground text-xs leading-4"
                    style={{ width: GRAPH_WIDTH }}
                >
                    <span
                        className="flex min-w-0 shrink-0 justify-center overflow-hidden"
                        style={{
                            width: `calc(var(--cw) * ${layout.sourceColumns})`,
                        }}
                    >
                        <ZoneLabel
                            types={left}
                            label={mediaListLabel(left)}
                            count={leftCount}
                            compact={!isDesktop}
                        />
                    </span>
                    <span className="flex min-w-0 flex-1 justify-center overflow-hidden">
                        <ZoneLabel
                            types={[model.current.contentType]}
                            label={
                                CONTENT_TYPES[model.current.contentType]
                                    .title_ua
                            }
                            count={model.nodes.length - leftCount}
                        />
                    </span>
                </div>
            </div>
        </div>
    );
};

const YearAxis: FC<{ layout: GraphLayout }> = ({ layout }) =>
    layout.bands.map((band) => (
        <div
            key={band.label}
            className="pointer-events-none absolute left-0 flex w-9 flex-col items-start font-semibold text-muted-foreground text-xs tabular-nums leading-[18px]"
            style={{
                top: `calc(var(--rh) * ${band.top})`,
                height: `calc(var(--rh) * ${band.height})`,
                paddingTop: 'calc(var(--rh) / 2 - 9px)',
            }}
        >
            <span>{band.label}</span>
            {band.height > 1 && (
                <span
                    className="absolute left-[13px] w-px bg-border dark:bg-border/50"
                    style={{
                        top: 'calc(var(--rh) / 2 + 14px)',
                        bottom: 'calc(var(--rh) / 2)',
                    }}
                />
            )}
        </div>
    ));

function popoverStyle(
    [column, row]: [number, number],
    layout: GraphLayout,
): CSSProperties {
    const x = `var(--axis) + var(--cw) * ${column + 0.5}`;
    const y = `var(--rh) * ${row + 0.5}`;
    const flip = column >= layout.columns / 2;
    const low = row >= layout.rows - 2;

    return {
        left: flip
            ? `calc(${x} - var(--gp) / 2 - 12px - 20rem)`
            : `calc(${x} + var(--gp) / 2 + 12px)`,
        top: low
            ? `calc(${y} + var(--gp) / 1.4)`
            : `calc(${y} - var(--gp) / 1.4)`,
        transform: low ? 'translateY(-100%)' : undefined,
    };
}

const findNode = (container: HTMLElement, id: string) =>
    container.querySelector(`[data-node="${CSS.escape(id)}"]`);

function scrollToNode(
    container: HTMLElement | null,
    id: string,
    behavior: ScrollBehavior,
) {
    const node = container && findNode(container, id);
    if (!container || !node) return;

    const offset =
        node.getBoundingClientRect().top -
        container.getBoundingClientRect().top;

    container.scrollTo({
        top: container.scrollTop + offset - container.clientHeight / 3,
        behavior,
    });
}

export const FranchiseGraphSkeleton: FC = () => (
    <Card className={CARD_CLASS}>
        <div className="border-b px-4 py-3 max-md:px-3 max-md:py-2.5">
            <Skeleton className="h-8 w-full" />
        </div>
        <Skeleton className={cn(SCROLL_HEIGHT, 'rounded-none')} />
    </Card>
);

const FranchiseGraph: FC<Props> = ({ model }) => {
    const { user } = useSession();
    const isDesktop = useIsDesktop();
    const scrollRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);

    const [hidden, setHidden] = useState<ReadonlySet<GraphEdgeType>>(() =>
        defaultHiddenTypes(model),
    );
    const [mine, setMine] = useState(false);
    const [focus, setFocus] = useState<string | null>(null);
    const [fullscreen, setFullscreen] = useState(false);

    const name = useTitle(model.chain[0]?.content);
    const layout = layoutGraph(
        model,
        isDesktop ? DESKTOP_BUDGET : PHONE_BUDGET,
    );
    const view = computeGraphView(model, layout, hidden, focus);
    const sizes =
        SIZES[isDesktop ? 'desktop' : 'phone'][fullscreen ? 'full' : 'card'];
    const hasZone = layout.sourceColumns > 0;
    const compactDetails = !isDesktop && !fullscreen;

    const filters: EdgeFilter[] = EDGE_TYPES.map((edgeType) => ({
        ...edgeType,
        count: model.edges.filter((edge) => edge.type === edgeType.type).length,
        on: !hidden.has(edgeType.type),
    })).filter((filter) => filter.count > 0);

    const focusNode = focus ? model.byId.get(focus) : undefined;
    const focusPosition = focus ? layout.positions.get(focus) : undefined;
    const focusLinks = focus
        ? view.edges.filter((edge) => edge.a === focus || edge.b === focus)
              .length
        : 0;

    // biome-ignore lint/correctness/useExhaustiveDependencies: a new budget or node size moves the current title, so re-centre it.
    useEffect(() => {
        scrollToNode(scrollRef.current, model.current.id, 'instant');
    }, [model.current.id, isDesktop, fullscreen]);

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
        const bar = barRef.current;
        const container = scrollRef.current;
        if (!compactDetails || !focus || !bar || !container) return;

        bar.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

        const node = findNode(container, focus);
        const hiddenBy = node
            ? node.getBoundingClientRect().bottom -
              bar.getBoundingClientRect().top
            : 0;
        if (hiddenBy > 0) {
            container.scrollBy({ top: hiddenBy + 16, behavior: 'smooth' });
        }
    }, [compactDetails, focus]);

    const toggleType = (type: GraphEdgeType) => {
        const next = new Set(hidden);
        if (next.has(type)) next.delete(type);
        else next.add(type);
        setHidden(next);
    };

    const select = (id: string) => setFocus(focus === id ? null : id);

    const jumpTo = (id: string) => {
        setFocus(id);
        scrollToNode(scrollRef.current, id, 'smooth');
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

    const details = (compact: boolean) =>
        focusNode && (
            <GraphDetails
                model={model}
                node={focusNode}
                links={focusLinks}
                compact={compact}
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
                onToggle={toggleType}
                mine={user ? mine : null}
                onToggleMine={() => setMine(!mine)}
                fullscreen={fullscreen}
                onToggleFullscreen={() => setFullscreen(!fullscreen)}
                title={name}
                isDesktop={isDesktop}
            />
            <div
                className={cn(
                    'relative flex min-h-0 flex-col',
                    fullscreen && 'flex-1',
                )}
                style={
                    {
                        '--axis': '48px',
                        '--cols': layout.columns,
                        '--cw': sizes.cw,
                        '--rh': sizes.rh,
                        '--gp': sizes.gp,
                        '--gx': sizes.gx,
                    } as CSSProperties
                }
            >
                {hasZone && (
                    <ZoneHeader
                        model={model}
                        layout={layout}
                        isDesktop={isDesktop}
                    />
                )}
                {/* biome-ignore lint/a11y/noStaticElementInteractions: clicking empty space deselects; Escape does the same from the keyboard. */}
                {/* biome-ignore lint/a11y/useKeyWithClickEvents: Escape is the keyboard path, handled on window. */}
                <div
                    ref={scrollRef}
                    onClick={deselect}
                    className={cn(
                        CONTAINER_CLASS,
                        'overflow-auto overscroll-contain',
                        fullscreen ? 'flex-1' : SCROLL_HEIGHT,
                    )}
                >
                    <div
                        className={cn(
                            'w-max min-w-full pb-6 max-md:pb-5',
                            GUTTER_CLASS,
                            hasZone ? 'pt-2' : 'pt-5',
                            compactDetails && focusNode && 'pb-28 max-md:pb-28',
                        )}
                    >
                        <div
                            className="relative mx-auto"
                            style={{
                                width: GRAPH_WIDTH,
                                height: `calc(var(--rh) * ${layout.rows})`,
                            }}
                        >
                            <YearAxis layout={layout} />
                            {hasZone && (
                                <div
                                    className="absolute top-0 bottom-0 left-(--axis) rounded-(--base-radius) bg-secondary/20"
                                    style={{
                                        width: `calc(var(--cw) * ${layout.sourceColumns})`,
                                    }}
                                />
                            )}
                            {layout.bands
                                .filter((band) => band.top > 0)
                                .map((band) => (
                                    <div
                                        key={band.label}
                                        className="absolute left-(--axis) h-px bg-border dark:bg-border/50"
                                        style={{
                                            top: `calc(var(--rh) * ${band.top})`,
                                            width: 'calc(var(--cols) * var(--cw))',
                                        }}
                                    />
                                ))}
                            <svg
                                className="pointer-events-none absolute top-0 left-(--axis) overflow-visible"
                                style={{
                                    width: 'calc(var(--cols) * var(--cw))',
                                    height: `calc(var(--rh) * ${layout.rows})`,
                                }}
                                viewBox={`0 0 ${layout.columns * CELL} ${layout.rows * CELL}`}
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
                                                style.dashed ? '4 4' : undefined
                                            }
                                            opacity={style.opacity}
                                            vectorEffect="non-scaling-stroke"
                                            className="transition-opacity"
                                        />
                                    );
                                })}
                            </svg>
                            {model.nodes.map((node) => {
                                const position = layout.positions.get(node.id);
                                if (!position) return null;

                                return (
                                    <GraphNode
                                        key={node.id}
                                        node={node}
                                        position={position}
                                        isCurrent={node === model.current}
                                        isSelected={node.id === focus}
                                        state={nodeState(node)}
                                        showMedia={
                                            node.contentType !==
                                            model.current.contentType
                                        }
                                        compactMedia={!isDesktop}
                                        imageSizes={sizes.gp}
                                        largeImage={fullscreen}
                                        onSelect={select}
                                    />
                                );
                            })}
                            {isDesktop && focusPosition && focusNode && (
                                <div
                                    role="dialog"
                                    aria-label="Деталі тайтлу"
                                    className="absolute z-6 flex w-80 flex-col gap-4 rounded-md border bg-popover p-4 text-popover-foreground shadow-md"
                                    style={popoverStyle(focusPosition, layout)}
                                >
                                    {details(false)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {compactDetails && focusNode && (
                    <div
                        ref={barRef}
                        role="dialog"
                        aria-label="Деталі тайтлу"
                        className="absolute inset-x-0 bottom-0 z-8 scroll-mb-20 border-t bg-popover p-3 text-popover-foreground"
                    >
                        {details(true)}
                    </div>
                )}
            </div>
            {fullscreen && !isDesktop && focusNode && (
                <div
                    role="dialog"
                    aria-label="Деталі тайтлу"
                    className="relative flex flex-col gap-4 border-t bg-popover p-4 text-popover-foreground"
                >
                    {details(false)}
                </div>
            )}
        </Card>
    );

    return fullscreen ? createPortal(card, document.body) : card;
};

export default FranchiseGraph;
