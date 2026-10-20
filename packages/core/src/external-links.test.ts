import { describe, expect, it } from 'vitest';

import { type ExternalResponse, ExternalTypeEnum } from '@hikka/api';

import { groupExternalLinks } from './external-links';

const link = (url: string, type: ExternalTypeEnum): ExternalResponse => ({
    url,
    text: url,
    type,
});

const EXTERNAL = [
    link('https://a.example', ExternalTypeEnum.GENERAL),
    link('https://a.example', ExternalTypeEnum.GENERAL),
    link('https://watch.example', ExternalTypeEnum.WATCH),
    link('https://read.example', ExternalTypeEnum.READ),
    link('https://watch.example', ExternalTypeEnum.WATCH),
];

describe('groupExternalLinks', () => {
    it('dedupes by url and keeps watch/read links for signed-in viewers', () => {
        const { general, watch } = groupExternalLinks(EXTERNAL, {
            withWatch: true,
        });

        expect(general.map((l) => l.url)).toEqual(['https://a.example']);
        expect(watch.map((l) => l.url)).toEqual([
            'https://watch.example',
            'https://read.example',
        ]);
    });

    it('drops watch/read links for anonymous viewers', () => {
        expect(
            groupExternalLinks(EXTERNAL, { withWatch: false }).watch,
        ).toEqual([]);
    });
});
