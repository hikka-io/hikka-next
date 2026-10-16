import {
    FranchiseRelationTypeEnum,
    type MainContentTypeEnum,
} from '@hikka/api';

import { CONTENT_TYPES } from '@/utils/labels';

import type { GraphEdgeType, RelationGroupEnum } from './franchise-model';

type GroupStyle = {
    label: string;
    text: string;
    tile: string;
    solid: string;
    chip: string;
    stroke: string;
};

export const RELATION_GROUP_STYLES = {
    sequel: {
        label: 'Основна історія',
        text: 'text-relation-sequel',
        tile: 'bg-relation-sequel/10 text-relation-sequel',
        solid: 'bg-relation-sequel',
        chip: 'border-relation-sequel/40 bg-relation-sequel/15 text-relation-sequel',
        stroke: 'var(--relation-sequel)',
    },
    side: {
        label: 'Побічні історії',
        text: 'text-relation-side',
        tile: 'bg-relation-side/10 text-relation-side',
        solid: 'bg-relation-side',
        chip: 'border-relation-side/40 bg-relation-side/15 text-relation-side',
        stroke: 'var(--relation-side)',
    },
    alternative: {
        label: 'Альтернативні версії',
        text: 'text-relation-alternative',
        tile: 'bg-relation-alternative/10 text-relation-alternative',
        solid: 'bg-relation-alternative',
        chip: 'border-relation-alternative/40 bg-relation-alternative/15 text-relation-alternative',
        stroke: 'var(--relation-alternative)',
    },
    summary: {
        label: 'Рекапи',
        text: 'text-relation-summary',
        tile: 'bg-relation-summary/10 text-relation-summary',
        solid: 'bg-relation-summary',
        chip: 'border-relation-summary/40 bg-relation-summary/15 text-relation-summary',
        stroke: 'var(--relation-summary)',
    },
    spin_off: {
        label: 'Спінофи',
        text: 'text-relation-spin-off',
        tile: 'bg-relation-spin-off/10 text-relation-spin-off',
        solid: 'bg-relation-spin-off',
        chip: 'border-relation-spin-off/40 bg-relation-spin-off/15 text-relation-spin-off',
        stroke: 'var(--relation-spin-off)',
    },
    source: {
        label: 'Інші медіа',
        text: 'text-relation-source',
        tile: 'bg-relation-source/10 text-relation-source',
        solid: 'bg-relation-source',
        chip: 'border-relation-source/40 bg-relation-source/15 text-relation-source',
        stroke: 'var(--relation-source)',
    },
} as const satisfies Record<RelationGroupEnum, GroupStyle>;

export const EDGE_TYPES: {
    type: GraphEdgeType;
    label: string;
    longLabel: string;
}[] = [
    {
        type: FranchiseRelationTypeEnum.SEQUEL,
        label: 'Сиквели',
        longLabel: 'Сиквели й приквели',
    },
    {
        type: FranchiseRelationTypeEnum.SIDE_STORY,
        label: 'Побічні',
        longLabel: 'Побічні історії',
    },
    {
        type: FranchiseRelationTypeEnum.ALTERNATIVE_VERSION,
        label: 'Альтернативні',
        longLabel: 'Альтернативні версії',
    },
    {
        type: FranchiseRelationTypeEnum.SUMMARY,
        label: 'Рекапи',
        longLabel: 'Рекапи',
    },
    {
        type: FranchiseRelationTypeEnum.SPIN_OFF,
        label: 'Спінофи',
        longLabel: 'Спінофи',
    },
    {
        type: FranchiseRelationTypeEnum.ADAPTATION,
        label: 'Адаптації',
        longLabel: 'Адаптації',
    },
];

export function mediaListLabel(types: MainContentTypeEnum[]): string {
    return types
        .map((type, index) =>
            index
                ? CONTENT_TYPES[type].title_ua.toLowerCase()
                : CONTENT_TYPES[type].title_ua,
        )
        .join(' й ');
}
