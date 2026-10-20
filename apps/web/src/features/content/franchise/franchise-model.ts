import {
    type AnimeResponseWithWatch,
    ContentStatusEnum,
    ContentTypeEnum,
    type FranchiseRelationResponse,
    FranchiseRelationTypeEnum,
    type FranchiseResponse,
    type MainContentTypeEnum,
    type MangaResponseWithRead,
    type NovelResponseWithRead,
} from '@hikka/api';

import type { CardStatus } from '@/components/content-card/content-status';
import type { HistoryFact, HistoryFactPart } from '@/components/list-items';
import {
    CONTENT_TYPES,
    getMediaTypeLabel,
    RELEASE_STATUS,
    SEASON,
} from '@/utils/labels';

export type FranchiseContent =
    | AnimeResponseWithWatch
    | MangaResponseWithRead
    | NovelResponseWithRead;

export const RelationGroupEnum = {
    SEQUEL: 'sequel',
    SIDE: 'side',
    ALTERNATIVE: 'alternative',
    SUMMARY: 'summary',
    SPIN_OFF: 'spin_off',
    SOURCE: 'source',
} as const;
export type RelationGroupEnum =
    (typeof RelationGroupEnum)[keyof typeof RelationGroupEnum];

const RELATION_GROUP_ORDER: RelationGroupEnum[] = [
    RelationGroupEnum.SEQUEL,
    RelationGroupEnum.SIDE,
    RelationGroupEnum.ALTERNATIVE,
    RelationGroupEnum.SUMMARY,
    RelationGroupEnum.SPIN_OFF,
    RelationGroupEnum.SOURCE,
];

type FranchiseLane = 'main' | 'source' | 'right';

export type NodeRelation = {
    label: string;
    targetId: string | null;
    targetKind: string | null;
};

export type FranchiseNode = {
    id: string;
    content: FranchiseContent;
    contentType: MainContentTypeEnum;
    lane: FranchiseLane;
    group: RelationGroupEnum;
    chainIndex: number | null;
    relation: NodeRelation | null;
    when: number;
};

export type DirectRelation = {
    node: FranchiseNode;
    label: string;
    group: RelationGroupEnum;
};

export type GraphEdgeType = Exclude<
    FranchiseRelationTypeEnum,
    typeof FranchiseRelationTypeEnum.ALTERNATIVE_SETTING
>;

export type GraphEdge = { a: string; b: string; type: GraphEdgeType };

export type FranchiseModel = {
    current: FranchiseNode;
    nodes: FranchiseNode[];
    byId: Map<string, FranchiseNode>;
    chain: FranchiseNode[];
    direct: DirectRelation[];
    /** Every title's direct relations, labelled from the other title's side. */
    relations: Map<string, DirectRelation[]>;
    edges: GraphEdge[];
};

type Relation = FranchiseRelationResponse;

const FORWARD_LABELS: Record<FranchiseRelationTypeEnum, string> = {
    sequel: 'Сиквел',
    side_story: 'Побічна історія',
    summary: 'Рекап',
    spin_off: 'Спіноф',
    alternative_version: 'Альтернативна версія',
    alternative_setting: 'Альтернативний сетинг',
    adaptation: 'Адаптація',
};

const REVERSE_LABELS: Record<FranchiseRelationTypeEnum, string> = {
    sequel: 'Приквел',
    side_story: 'Основна історія',
    summary: 'Повна історія',
    spin_off: 'Оригінал',
    alternative_version: 'Альтернативна версія',
    alternative_setting: 'Альтернативний сетинг',
    adaptation: 'Адаптація',
};

const SOURCE_LABEL = 'Першоджерело';

export const RELATION_TYPE_GROUPS: Record<
    FranchiseRelationTypeEnum,
    RelationGroupEnum
> = {
    sequel: RelationGroupEnum.SEQUEL,
    side_story: RelationGroupEnum.SIDE,
    summary: RelationGroupEnum.SUMMARY,
    spin_off: RelationGroupEnum.SPIN_OFF,
    alternative_version: RelationGroupEnum.ALTERNATIVE,
    alternative_setting: RelationGroupEnum.ALTERNATIVE,
    adaptation: RelationGroupEnum.SOURCE,
};

const TYPE_PRIORITY: FranchiseRelationTypeEnum[] = [
    FranchiseRelationTypeEnum.SEQUEL,
    FranchiseRelationTypeEnum.SIDE_STORY,
    FranchiseRelationTypeEnum.SUMMARY,
    FranchiseRelationTypeEnum.ALTERNATIVE_VERSION,
    FranchiseRelationTypeEnum.ALTERNATIVE_SETTING,
    FranchiseRelationTypeEnum.SPIN_OFF,
    FranchiseRelationTypeEnum.ADAPTATION,
];

const DIRECT_ORDER = [
    'Приквел',
    'Сиквел',
    SOURCE_LABEL,
    'Адаптація',
    'Побічна історія',
    'Основна історія',
    'Спіноф',
    'Оригінал',
    'Альтернативна версія',
    'Альтернативний сетинг',
    'Рекап',
    'Повна історія',
];

const SECONDS_PER_YEAR = 31557600;
const UNKNOWN_WHEN = Number.MAX_SAFE_INTEGER;

export const nodeId = (contentType: string, slug: string) =>
    `${contentType}:${slug}`;

const whenOf = (content: FranchiseContent) =>
    content.start_date ??
    (content.year ? (content.year - 1970) * SECONDS_PER_YEAR : UNKNOWN_WHEN);

const byWhen = (a: FranchiseNode, b: FranchiseNode) => a.when - b.when;

/**
 * The backend gives adaptations in either direction, so the source is the
 * earlier year, and in a tie the manga or novel.
 */
function relationLabel(
    relation: Relation,
    me: FranchiseNode,
    other: FranchiseNode,
): string {
    const type = relation.relation_type;

    if (type === FranchiseRelationTypeEnum.ADAPTATION) {
        const mine = me.content.year ?? Number.POSITIVE_INFINITY;
        const theirs = other.content.year ?? Number.POSITIVE_INFINITY;
        const isSource =
            mine < theirs ||
            (mine === theirs &&
                me.contentType !== ContentTypeEnum.ANIME &&
                other.contentType === ContentTypeEnum.ANIME);

        return isSource ? SOURCE_LABEL : FORWARD_LABELS[type];
    }

    const isParent =
        relation.slug === me.content.slug &&
        relation.content_type === me.contentType;

    return isParent ? REVERSE_LABELS[type] : FORWARD_LABELS[type];
}

function sequelComponent(start: string, sequels: GraphEdge[]): Set<string> {
    const component = new Set([start]);
    let grew = true;

    while (grew) {
        grew = false;
        for (const edge of sequels) {
            if (component.has(edge.a) !== component.has(edge.b)) {
                component.add(edge.a);
                component.add(edge.b);
                grew = true;
            }
        }
    }

    return component;
}

function orderChain(
    component: Set<string>,
    sequels: GraphEdge[],
    byId: Map<string, FranchiseNode>,
): FranchiseNode[] {
    const inner = sequels.filter(
        (edge) => component.has(edge.a) && component.has(edge.b),
    );
    const indegree = new Map([...component].map((id) => [id, 0]));
    for (const edge of inner) {
        indegree.set(edge.b, (indegree.get(edge.b) ?? 0) + 1);
    }

    const nodes = [...component].map((id) => byId.get(id) as FranchiseNode);
    const ready = nodes.filter((node) => indegree.get(node.id) === 0);
    const order: FranchiseNode[] = [];

    while (ready.length) {
        ready.sort(byWhen);
        const node = ready.shift() as FranchiseNode;
        order.push(node);

        for (const edge of inner) {
            if (edge.a !== node.id) continue;
            const left = (indegree.get(edge.b) ?? 0) - 1;
            indegree.set(edge.b, left);
            if (left === 0) ready.push(byId.get(edge.b) as FranchiseNode);
        }
    }

    const rest = nodes.filter((node) => !order.includes(node)).sort(byWhen);

    return [...order, ...rest];
}

/**
 * The main story is the sequel chain of the current title. A title outside
 * every chain (a lone movie or OVA) falls back to the longest chain of its own
 * medium, so the spine is never a single side story.
 */
function mainStory(
    current: FranchiseNode,
    nodes: FranchiseNode[],
    sequels: GraphEdge[],
): Set<string> {
    const own = sequelComponent(current.id, sequels);
    if (own.size > 1) return own;

    let best = own;
    let bestStart = UNKNOWN_WHEN;
    const seen = new Set<string>();

    for (const node of [...nodes].sort(byWhen)) {
        if (node.contentType !== current.contentType || seen.has(node.id)) {
            continue;
        }

        const component = sequelComponent(node.id, sequels);
        for (const id of component) seen.add(id);

        if (
            component.size > best.size ||
            (component.size === best.size &&
                best !== own &&
                node.when < bestStart)
        ) {
            best = component;
            bestStart = node.when;
        }
    }

    return best;
}

export function buildFranchiseModel(
    data: FranchiseResponse,
    contentType: MainContentTypeEnum,
    slug: string,
): FranchiseModel | null {
    const contents: FranchiseContent[] = [
        ...data.anime,
        ...data.manga,
        ...data.novel,
    ];
    const byId = new Map<string, FranchiseNode>();

    for (const content of contents) {
        const id = nodeId(content.data_type, content.slug);
        byId.set(id, {
            id,
            content,
            contentType: content.data_type,
            lane: 'right',
            group: RelationGroupEnum.ALTERNATIVE,
            chainIndex: null,
            relation: null,
            when: whenOf(content),
        });
    }

    const current = byId.get(nodeId(contentType, slug));
    if (!current) return null;

    const relations = data.relations.filter(
        (relation) =>
            byId.has(nodeId(relation.content_type, relation.slug)) &&
            byId.has(
                nodeId(relation.related_content_type, relation.related_slug),
            ),
    );
    const edges: GraphEdge[] = relations.map((relation) => ({
        a: nodeId(relation.content_type, relation.slug),
        b: nodeId(relation.related_content_type, relation.related_slug),
        type:
            relation.relation_type ===
            FranchiseRelationTypeEnum.ALTERNATIVE_SETTING
                ? FranchiseRelationTypeEnum.ALTERNATIVE_VERSION
                : relation.relation_type,
    }));
    const sequels = edges.filter(
        (edge) => edge.type === FranchiseRelationTypeEnum.SEQUEL,
    );

    const neighbours = new Map<
        string,
        { relation: Relation; other: FranchiseNode }[]
    >([...byId.keys()].map((id) => [id, []]));
    relations.forEach((relation, index) => {
        const { a, b } = edges[index];
        neighbours
            .get(a)
            ?.push({ relation, other: byId.get(b) as FranchiseNode });
        neighbours
            .get(b)
            ?.push({ relation, other: byId.get(a) as FranchiseNode });
    });

    const nodes = [...byId.values()].sort(byWhen);
    const chain = orderChain(mainStory(current, nodes, sequels), sequels, byId);
    chain.forEach((node, index) => {
        node.lane = 'main';
        node.group = RelationGroupEnum.SEQUEL;
        node.chainIndex = index;
    });

    const distance = new Map(chain.map((node) => [node.id, 0]));
    const queue = chain.map((node) => node.id);
    for (let head = 0; head < queue.length; head++) {
        const id = queue[head];
        for (const { other } of neighbours.get(id) ?? []) {
            if (distance.has(other.id)) continue;
            distance.set(other.id, (distance.get(id) ?? 0) + 1);
            queue.push(other.id);
        }
    }

    const far = Number.MAX_SAFE_INTEGER;
    const offChain = nodes
        .filter((node) => node.chainIndex === null)
        .sort(
            (a, b) => (distance.get(a.id) ?? far) - (distance.get(b.id) ?? far),
        );

    for (const node of offChain) {
        const isSource = node.contentType !== current.contentType;
        node.lane = isSource ? 'source' : 'right';
        node.group = isSource
            ? RelationGroupEnum.SOURCE
            : RelationGroupEnum.ALTERNATIVE;

        const links = neighbours.get(node.id) ?? [];
        if (!links.length) continue;

        const best = [...links].sort(
            (x, y) =>
                (distance.get(x.other.id) ?? far) -
                    (distance.get(y.other.id) ?? far) ||
                TYPE_PRIORITY.indexOf(x.relation.relation_type) -
                    TYPE_PRIORITY.indexOf(y.relation.relation_type) ||
                x.other.when - y.other.when,
        )[0];

        node.relation = {
            label: relationLabel(best.relation, node, best.other),
            targetId: best.other.id,
            targetKind:
                best.other.contentType === current.contentType
                    ? null
                    : (CONTENT_TYPES[best.other.contentType].genitive ?? null),
        };

        if (isSource) continue;

        const type = best.relation.relation_type;
        if (type === FranchiseRelationTypeEnum.SEQUEL) {
            if (best.other.lane === 'right') node.group = best.other.group;
        } else if (type !== FranchiseRelationTypeEnum.ADAPTATION) {
            node.group = RELATION_TYPE_GROUPS[type];
        }
    }

    const directById = new Map(
        nodes.map((node) => [
            node.id,
            (neighbours.get(node.id) ?? [])
                .map(
                    ({ relation, other }): DirectRelation => ({
                        node: other,
                        label: relationLabel(relation, other, node),
                        group: RELATION_TYPE_GROUPS[relation.relation_type],
                    }),
                )
                .sort(
                    (a, b) =>
                        (DIRECT_ORDER.indexOf(a.label) + 1 || 99) -
                            (DIRECT_ORDER.indexOf(b.label) + 1 || 99) ||
                        a.node.when - b.node.when,
                )
                .filter(
                    (entry, index, list) =>
                        list.findIndex((other) => other.node === entry.node) ===
                        index,
                ),
        ]),
    );
    const direct = directById.get(current.id) ?? [];

    return {
        current,
        nodes,
        byId,
        chain,
        direct,
        relations: directById,
        edges,
    };
}

/** The titles one relation away, in the franchise card's order. */
export function relatedNodes(
    model: FranchiseModel,
    id: string,
): FranchiseNode[] {
    return (model.relations.get(id) ?? []).map((relation) => relation.node);
}

/** The shortest chain of relations from one title to another, both ends included; empty when none links them. */
export function relationPath(
    model: FranchiseModel,
    from: string,
    to: string,
): FranchiseNode[] {
    const previous = new Map<string, string | null>([[from, null]]);
    const queue = [from];

    for (let head = 0; head < queue.length && !previous.has(to); head++) {
        const id = queue[head];
        for (const edge of model.edges) {
            const next = edge.a === id ? edge.b : edge.b === id ? edge.a : null;
            if (next === null || previous.has(next)) continue;
            previous.set(next, id);
            queue.push(next);
        }
    }

    if (!previous.has(to)) return [];

    const path: FranchiseNode[] = [];
    for (
        let id: string | null = to;
        id !== null;
        id = previous.get(id) ?? null
    ) {
        path.unshift(model.byId.get(id) as FranchiseNode);
    }

    return path;
}

export type CompositionEntry = {
    group: RelationGroupEnum;
    contentType?: MainContentTypeEnum;
    count: number;
};

/** Relation groups of the page's medium, then each other medium on its own. */
export function compositionCounts(model: FranchiseModel): CompositionEntry[] {
    const groups = RELATION_GROUP_ORDER.filter(
        (group) => group !== RelationGroupEnum.SOURCE,
    ).map((group) => ({
        group,
        count: model.nodes.filter((node) => node.group === group).length,
    }));
    const media = sourceTypes(model).map((contentType) => ({
        group: RelationGroupEnum.SOURCE,
        contentType,
        count: model.nodes.filter(
            (node) =>
                node.lane === 'source' && node.contentType === contentType,
        ).length,
    }));

    return [...groups, ...media].filter((entry) => entry.count > 0);
}

export function groupByYear(nodes: FranchiseNode[]) {
    const years = new Map<number | null, FranchiseNode[]>();
    for (const node of nodes) {
        const year = node.content.year || null;
        years.set(year, [...(years.get(year) ?? []), node]);
    }

    return [...years.entries()]
        .sort(
            ([a], [b]) =>
                (a ?? Number.POSITIVE_INFINITY) -
                (b ?? Number.POSITIVE_INFINITY),
        )
        .map(([year, items]) => ({
            label: year ? String(year) : 'Анонс',
            nodes: items,
        }));
}

function presentTypes(nodes: FranchiseNode[]): MainContentTypeEnum[] {
    const present = new Set(nodes.map((node) => node.contentType));

    return [
        ContentTypeEnum.ANIME,
        ContentTypeEnum.MANGA,
        ContentTypeEnum.NOVEL,
    ].filter((type) => present.has(type));
}

export function sourceTypes(model: FranchiseModel): MainContentTypeEnum[] {
    return presentTypes(model.nodes.filter((node) => node.lane === 'source'));
}

export function franchiseTypes(model: FranchiseModel): MainContentTypeEnum[] {
    return presentTypes(model.nodes);
}

export function isTracked(content: FranchiseContent): boolean {
    return content.data_type === ContentTypeEnum.ANIME
        ? content.watch.length > 0
        : content.read.length > 0;
}

export function listStatus(content: FranchiseContent): CardStatus | undefined {
    const entry =
        content.data_type === ContentTypeEnum.ANIME
            ? content.watch[0]
            : content.read[0];

    return entry
        ? {
              value: entry.status,
              kind:
                  content.data_type === ContentTypeEnum.ANIME
                      ? 'watch'
                      : 'read',
          }
        : undefined;
}

export function relationText(model: FranchiseModel, node: FranchiseNode) {
    if (node.chainIndex !== null) {
        return model.chain.length > 1
            ? `Основна історія, ${node.chainIndex + 1} з ${model.chain.length}`
            : 'Основна історія';
    }

    return node.relation?.label ?? CONTENT_TYPES[node.contentType].title_ua;
}

const fact = (text: string, type: HistoryFactPart['type'] = 'text') => [
    { type, text },
];

export function basicFacts(content: FranchiseContent): string[] {
    return [
        content.year ? String(content.year) : null,
        getMediaTypeLabel(content.media_type) ?? null,
    ].filter((text) => text !== null);
}

export function basicMeta(content: FranchiseContent): HistoryFact[] {
    return basicFacts(content).map((text) => fact(text));
}

export function chronologyMeta(content: FranchiseContent): HistoryFact[] {
    const facts: HistoryFact[] = [];
    const season =
        content.data_type === ContentTypeEnum.ANIME && content.season
            ? SEASON[content.season as keyof typeof SEASON]?.title_ua
            : undefined;
    const mediaType = getMediaTypeLabel(content.media_type);

    if (season) facts.push(fact(season));
    if (mediaType) facts.push(fact(mediaType));

    if (
        content.status === ContentStatusEnum.ONGOING ||
        content.status === ContentStatusEnum.ANNOUNCED
    ) {
        facts.push(fact(RELEASE_STATUS[content.status].title_ua, 'status'));
    } else if (content.data_type === ContentTypeEnum.ANIME) {
        if (content.episodes_total && content.episodes_total > 1) {
            facts.push(fact(`${content.episodes_total} еп.`));
        }
    } else if (content.chapters) {
        facts.push(fact(`${content.chapters} розд.`));
    }

    return facts;
}
