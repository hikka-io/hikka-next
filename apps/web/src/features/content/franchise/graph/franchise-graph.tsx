import {
    type CSSProperties,
    type FC,
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
    type GraphEdgeType,
    isTracked,
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
import { CELL, computeGraphView, edgeStyle } from './graph-view';

type Props = {
    model: FranchiseModel;
};

type Sizes = { cw: string; rh: string; gp: string; gx: string };

const SIZES: Record<'desktop' | 'phone', Record<'card' | 'full', Sizes>> = {
    desktop: {
        card: {
            cw: 'clamp(76px, calc((100cqw - 104px) / var(--cols)), 140px)',
            rh: '116px',
            gp: '60px',
            gx: '16px',
        },
        full: {
            cw: 'clamp(96px, calc((100cqw - 120px) / var(--cols)), 210px)',
            rh: '140px',
            gp: '76px',
            gx: '16px',
        },
    },
    phone: {
        card: {
            cw: 'clamp(64px, calc((100cqw - 80px) / var(--cols)), 140px)',
            rh: '104px',
            gp: '52px',
            gx: '12px',
        },
        full: {
            cw: 'clamp(72px, calc((100cqw - 72px) / var(--cols)), 140px)',
            rh: '112px',
            gp: '56px',
            gx: '12px',
        },
    },
};

const CARD_CLASS = 'gap-0 overflow-hidden bg-card p-0';
const SCROLL_HEIGHT = 'h-155 max-md:h-120';

const GRAPH_WIDTH = 'calc(var(--axis) + var(--cols) * var(--cw))';
const AXIS_FADE =
    'linear-gradient(90deg, var(--card) calc(100% - 12px), transparent)';
const DEFAULT_HIDDEN: GraphEdgeType[] = ['adaptation'];

const ZoneLabel: FC<{
    types: FranchiseModel['current']['contentType'][];
    label: string;
    count: number;
    compact?: boolean;
}> = ({ types, label, count, compact }) => (
    <span
        className={cn(
            'sticky inline-flex min-w-0 max-w-full items-center',
            compact ? 'gap-1 pl-1' : 'gap-1.5 pl-2',
        )}
        style={{ left: 'calc(var(--axis) + var(--gx) + 8px)' }}
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
        <div
            className="sticky top-0 z-7 mx-auto mb-1 flex whitespace-nowrap border-b bg-card pt-3 pb-2.5 font-medium text-muted-foreground text-xs leading-4"
            style={{ width: GRAPH_WIDTH }}
        >
            <span
                className="sticky left-0 z-1 -mt-3 -mb-2.5 shrink-0"
                style={{
                    width: 'calc(var(--axis) + var(--gx))',
                    marginLeft: 'calc(var(--gx) * -1)',
                    background: AXIS_FADE,
                }}
            />
            <span
                className="flex min-w-0 shrink-0 items-center overflow-hidden"
                style={{ width: `calc(var(--cw) * ${layout.sourceColumns})` }}
            >
                <ZoneLabel
                    types={left}
                    label={mediaListLabel(left)}
                    count={leftCount}
                    compact={!isDesktop}
                />
            </span>
            <span className="flex min-w-0 flex-1 items-center overflow-hidden">
                <ZoneLabel
                    types={[model.current.contentType]}
                    label={CONTENT_TYPES[model.current.contentType].title_ua}
                    count={model.nodes.length - leftCount}
                />
            </span>
        </div>
    );
};

const YearAxis: FC<{ layout: GraphLayout }> = ({ layout }) => (
    <div
        className="pointer-events-none sticky left-0 z-4 h-full"
        style={{
            width: 'calc(var(--axis) + var(--gx))',
            marginLeft: 'calc(var(--gx) * -1)',
            background: AXIS_FADE,
        }}
    >
        {layout.bands.map((band) => (
            <div
                key={band.label}
                className="absolute flex w-9 flex-col items-start font-semibold text-muted-foreground text-xs tabular-nums leading-[18px]"
                style={{
                    left: 'var(--gx)',
                    top: `calc(var(--rh) * ${band.top})`,
                    height: `calc(var(--rh) * ${band.height})`,
                    paddingTop: 'calc(var(--rh) / 2 - 9px)',
                }}
            >
                <span>{band.label}</span>
                {band.height > 1 && (
                    <span
                        className="absolute left-[13px] w-px bg-border"
                        style={{
                            top: 'calc(var(--rh) / 2 + 14px)',
                            bottom: 'calc(var(--rh) / 2)',
                        }}
                    />
                )}
            </div>
        ))}
    </div>
);

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

function scrollToNode(
    container: HTMLElement | null,
    id: string,
    behavior: ScrollBehavior,
) {
    const node = container?.querySelector(`[data-node="${CSS.escape(id)}"]`);
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
    <Card variant="plain" className={CARD_CLASS}>
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

    const [hidden, setHidden] = useState<ReadonlySet<GraphEdgeType>>(
        () => new Set(DEFAULT_HIDDEN),
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
    const hasZone =
        layout.sourceColumns > 0 &&
        model.nodes.some((node) => node.lane === 'source');

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
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setFullscreen(false);
        };
        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = overflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [fullscreen]);

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

    const nodeState = (id: string): NodeState => {
        if (id === focus) return 'default';
        if (model.edges.length > 0 && !view.linked.has(id)) return 'isolated';

        const node = model.byId.get(id);
        if (
            (focus && !view.near.has(id)) ||
            (mine && node && !isTracked(node.content))
        ) {
            return 'far';
        }

        return 'default';
    };

    const details = focusNode && (
        <GraphDetails
            model={model}
            node={focusNode}
            links={focusLinks}
            onSelect={jumpTo}
            onClose={() => setFocus(null)}
        />
    );

    const card = (
        <Card
            variant="plain"
            className={cn(
                CARD_CLASS,
                fullscreen && 'fixed inset-0 z-50 rounded-none border-0',
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
                ref={scrollRef}
                className={cn(
                    '@container overflow-auto overscroll-contain',
                    fullscreen ? 'flex-1' : SCROLL_HEIGHT,
                )}
            >
                <div
                    className="w-max min-w-full pr-8 pb-6 pl-(--gx) max-md:pr-5 max-md:pb-5"
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
                    {hasZone ? (
                        <ZoneHeader
                            model={model}
                            layout={layout}
                            isDesktop={isDesktop}
                        />
                    ) : (
                        <div className="h-5" />
                    )}
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
                                className="absolute top-0 bottom-0 left-(--axis) rounded-lg bg-secondary/20"
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
                                    className="absolute left-(--axis) h-px bg-border"
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
                                const group = EDGE_TYPES.find(
                                    (entry) => entry.type === edge.type,
                                )?.group;

                                return (
                                    <path
                                        key={edge.key}
                                        d={edge.path}
                                        fill="none"
                                        stroke={
                                            RELATION_GROUP_STYLES[
                                                group ?? 'alternative'
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
                                    state={nodeState(node.id)}
                                    showMedia={
                                        node.contentType !==
                                        model.current.contentType
                                    }
                                    compactMedia={!isDesktop}
                                    onSelect={select}
                                />
                            );
                        })}
                        {isDesktop && focusPosition && details && (
                            <div
                                role="dialog"
                                aria-label="Деталі тайтлу"
                                className="absolute z-6 flex w-80 flex-col gap-4 rounded-md border bg-popover p-4 text-popover-foreground shadow-md"
                                style={popoverStyle(focusPosition, layout)}
                            >
                                {details}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {!isDesktop && details && (
                <div className="relative flex flex-col gap-4 border-t bg-popover p-4 text-popover-foreground">
                    {details}
                </div>
            )}
        </Card>
    );

    return fullscreen ? createPortal(card, document.body) : card;
};

export default FranchiseGraph;
