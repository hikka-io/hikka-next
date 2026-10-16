import { describe, expect, it } from 'vitest';

import type { FranchiseRelationTypeEnum, FranchiseResponse } from '@hikka/api';

import {
    buildFranchiseModel,
    compositionCounts,
    type FranchiseModel,
    type GraphEdgeType,
    nodeId,
    relationText,
} from './franchise-model';
import { useGraphFiltersStore } from './graph/graph-filters-store';
import { layoutGraph } from './graph/graph-layout';
import {
    computeGraphView,
    defaultHiddenTypes,
    resolveHiddenTypes,
    withoutMedia,
    withoutUnlinked,
} from './graph/graph-view';

type Kind = 'anime' | 'manga' | 'novel';

const item = (data_type: Kind, slug: string, year: number | null) =>
    ({
        data_type,
        slug,
        year,
        start_date: null,
        title_ua: slug,
        media_type: null,
        status: 'finished',
        ...(data_type === 'anime' ? { watch: [] } : { read: [] }),
    }) as unknown as FranchiseResponse['anime'][number];

const rel = (
    slug: string,
    related_slug: string,
    relation_type: FranchiseRelationTypeEnum,
    content_type: Kind = 'anime',
    related_content_type: Kind = 'anime',
) => ({
    slug,
    related_slug,
    relation_type,
    content_type,
    related_content_type,
});

const DATA = {
    anime: [
        item('anime', 'a1', 2010),
        item('anime', 'a2', 2011),
        item('anime', 'a3', 2012),
        item('anime', 's1', 2011),
        item('anime', 's2', 2013),
        item('anime', 'r1', 2014),
    ],
    manga: [item('manga', 'm1', 2008), item('manga', 'm2', 2011)],
    novel: [item('novel', 'n1', 2015)],
    relations: [
        rel('a1', 'a2', 'sequel'),
        rel('a2', 'a3', 'sequel'),
        rel('a1', 's1', 'side_story'),
        rel('s1', 's2', 'sequel'),
        rel('a1', 'm1', 'adaptation', 'anime', 'manga'),
        rel('m2', 'a2', 'adaptation', 'manga', 'anime'),
        rel('a2', 'r1', 'summary'),
    ],
} as unknown as FranchiseResponse;

const build = (slug: string) =>
    buildFranchiseModel(DATA, 'anime', slug) as FranchiseModel;

const node = (model: FranchiseModel, type: Kind, slug: string) =>
    model.byId.get(nodeId(type, slug));

describe('buildFranchiseModel', () => {
    it('orders the sequel chain of the current title', () => {
        const model = build('a2');

        expect(model.chain.map((entry) => entry.content.slug)).toEqual([
            'a1',
            'a2',
            'a3',
        ]);
        expect(relationText(model, model.current)).toBe(
            'Основна історія, 2 з 3',
        );
    });

    it('labels direct relations from the other title’s side', () => {
        const model = build('a2');

        expect(
            model.direct.map((entry) => [entry.label, entry.node.content.slug]),
        ).toEqual([
            ['Приквел', 'a1'],
            ['Сиквел', 'a3'],
            ['Першоджерело', 'm2'],
            ['Рекап', 'r1'],
        ]);
    });

    it('treats the earlier year, then the manga in a tie, as the source', () => {
        const model = build('a2');

        expect(node(model, 'manga', 'm1')?.relation).toEqual({
            label: 'Першоджерело',
            targetId: nodeId('anime', 'a1'),
            targetKind: null,
        });
        expect(node(model, 'manga', 'm2')?.relation?.label).toBe(
            'Першоджерело',
        );
    });

    it('lets a side story’s sequel inherit the side group', () => {
        const model = build('a2');
        const sequel = node(model, 'anime', 's2');

        expect(sequel?.group).toBe('side');
        expect(sequel?.relation?.label).toBe('Сиквел');
        expect(sequel?.relation?.targetId).toBe(nodeId('anime', 's1'));
    });

    it('falls back to the media type for a title without relations', () => {
        const model = build('a2');
        const lone = node(model, 'novel', 'n1') as FranchiseModel['current'];

        expect(lone.relation).toBeNull();
        expect(relationText(model, lone)).toBe('Ранобе');
    });

    it('uses the longest chain when the current title has no sequels', () => {
        const model = build('r1');

        expect(model.current.chainIndex).toBeNull();
        expect(model.chain.map((entry) => entry.content.slug)).toEqual([
            'a1',
            'a2',
            'a3',
        ]);
        expect(model.current.relation?.label).toBe('Рекап');
    });

    it('counts the composition by relation group and other medium', () => {
        expect(compositionCounts(build('a2'))).toEqual([
            { group: 'sequel', count: 3 },
            { group: 'side', count: 2 },
            { group: 'summary', count: 1 },
            { group: 'source', contentType: 'manga', count: 2 },
            { group: 'source', contentType: 'novel', count: 1 },
        ]);
    });
});

describe('layoutGraph', () => {
    it('wraps a crowded year into extra rows within the column budget', () => {
        const model = build('a2');
        const layout = layoutGraph(model, { left: 1, right: 1 });

        expect(layout.columns).toBe(3);
        expect(layout.sourceColumns).toBe(1);
        expect(
            [...layout.positions.values()].every(
                ([column]) => column >= 0 && column < 3,
            ),
        ).toBe(true);

        const band2011 = layout.bands.find((band) => band.label === '2011');
        expect(band2011?.height).toBe(1);
        expect(layout.positions.get(nodeId('anime', 'a2'))?.[0]).toBe(1);
        expect(layout.positions.get(nodeId('manga', 'm2'))?.[0]).toBe(0);
        expect(layout.positions.get(nodeId('anime', 's1'))?.[0]).toBe(2);
    });
});

describe('computeGraphView', () => {
    it('keeps the selected title’s hidden edges and dims the rest', () => {
        const model = build('a2');
        const layout = layoutGraph(model, { left: 2, right: 3 });
        const m1 = nodeId('manga', 'm1');
        const hidden = new Set(['adaptation'] as const);

        const plain = computeGraphView(model, layout, hidden, null);
        expect(plain.linked.has(m1)).toBe(false);
        expect(plain.edges.some((edge) => edge.type === 'adaptation')).toBe(
            false,
        );

        const focused = computeGraphView(model, layout, hidden, m1);
        expect(
            focused.edges.filter((edge) => edge.touched).map((e) => e.type),
        ).toEqual(['adaptation']);
        expect(focused.near.has(nodeId('anime', 'a1'))).toBe(true);

        const fromAnime = computeGraphView(
            model,
            layout,
            hidden,
            nodeId('anime', 'a1'),
        );
        expect(fromAnime.linked.has(m1)).toBe(true);
    });

    it('drops hidden media with every edge that touches them', () => {
        const model = build('a2');
        const animeOnly = withoutMedia(model, new Set(['manga', 'novel']));

        expect(animeOnly.nodes.every((n) => n.contentType === 'anime')).toBe(
            true,
        );
        expect(
            animeOnly.edges.some(
                (edge) =>
                    edge.a.startsWith('manga') || edge.b.startsWith('manga'),
            ),
        ).toBe(false);
        expect(
            layoutGraph(animeOnly, { left: 2, right: 3 }).sourceColumns,
        ).toBe(0);
    });

    it('drops exactly the titles the graph greys out', () => {
        const model = build('a2');
        const hidden = new Set<GraphEdgeType>(['adaptation', 'side_story']);
        const linked = withoutUnlinked(model, hidden);
        const { linked: drawn } = computeGraphView(
            model,
            layoutGraph(model, { left: 2, right: 3 }),
            hidden,
            null,
        );

        expect(linked.nodes.map((n) => n.content.slug).sort()).toEqual([
            'a1',
            'a2',
            'a3',
            'r1',
            's1',
            's2',
        ]);
        expect(
            model.nodes.every(
                (n) =>
                    linked.nodes.includes(n) ===
                    (n === model.current || drawn.has(n.id)),
            ),
        ).toBe(true);
    });

    it('keeps the current title even when nothing shown reaches it', () => {
        const model = build('r1');
        const linked = withoutUnlinked(model, new Set(['summary']));

        expect(linked.nodes).toContain(model.current);
        expect(
            model.nodes
                .filter(
                    (n) => !withoutUnlinked(model, new Set()).nodes.includes(n),
                )
                .map((n) => n.content.slug),
        ).toEqual(['n1']);
    });

    it('applies saved switches over each franchise’s own defaults', () => {
        const model = build('a2');

        expect([...resolveHiddenTypes(model, {})]).toEqual(['adaptation']);
        expect([
            ...resolveHiddenTypes(model, { adaptation: true, summary: false }),
        ]).toEqual(['summary']);
    });

    it('saves only the switches that differ from the default', () => {
        const { setRelation } = useGraphFiltersStore.getState();

        setRelation('adaptation', true, false);
        expect(useGraphFiltersStore.getState().relations).toEqual({
            adaptation: true,
        });

        setRelation('adaptation', false, false);
        expect(useGraphFiltersStore.getState().relations).toEqual({});
    });

    it('hides adaptations by default unless they are all there is', () => {
        expect([...defaultHiddenTypes(build('a2'))]).toEqual(['adaptation']);

        const onlyAdaptation = buildFranchiseModel(
            {
                anime: [item('anime', 'a1', 2021)],
                manga: [item('manga', 'm1', 2019)],
                novel: [],
                relations: [rel('a1', 'm1', 'adaptation', 'anime', 'manga')],
            } as unknown as FranchiseResponse,
            'anime',
            'a1',
        ) as FranchiseModel;
        expect(defaultHiddenTypes(onlyAdaptation).size).toBe(0);
    });
});
