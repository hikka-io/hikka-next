import { describe, expect, it } from 'vitest';

import { type ExternalResponse, ExternalTypeEnum } from '@hikka/api';

import { groupExternalLinks } from './external-links';

const link = (
    url: string,
    type: ExternalTypeEnum,
    text = url,
): ExternalResponse => ({
    url,
    text,
    type,
});

const EXTERNAL = [
    link('https://a.example/title', ExternalTypeEnum.GENERAL),
    link('https://a.example/title', ExternalTypeEnum.GENERAL),
    link('https://watch.example/title', ExternalTypeEnum.WATCH),
    link('https://read.example/title', ExternalTypeEnum.READ),
    link('https://watch.example/title', ExternalTypeEnum.WATCH),
];

describe('groupExternalLinks', () => {
    it('dedupes by url and keeps watch/read links for signed-in viewers', () => {
        const { general, watch } = groupExternalLinks(EXTERNAL, {
            withWatch: true,
        });

        expect(general.map((l) => l.url)).toEqual(['https://a.example/title']);
        expect(watch.map((l) => l.url)).toEqual([
            'https://watch.example/title',
            'https://read.example/title',
        ]);
    });

    it('drops watch/read links for anonymous viewers', () => {
        expect(
            groupExternalLinks(EXTERNAL, { withWatch: false }).watch,
        ).toEqual([]);
    });

    it('drops non-web urls and bare homepages, but keeps official sites', () => {
        const { general } = groupExternalLinks(
            [
                link('https://www.netflix.com', ExternalTypeEnum.GENERAL),
                link('https://www.netflix.com/', ExternalTypeEnum.GENERAL),
                link('not a url', ExternalTypeEnum.GENERAL),
                link('javascript:alert(1)', ExternalTypeEnum.GENERAL),
                link('data:text/html,<p>x</p>', ExternalTypeEnum.GENERAL),
                link(
                    'javascript:alert(1)',
                    ExternalTypeEnum.GENERAL,
                    'Official Site',
                ),
                link('https://example.jp/?id=1', ExternalTypeEnum.GENERAL),
                link('https://example.jp/#/title', ExternalTypeEnum.GENERAL),
                link(
                    'https://frieren-anime.jp/',
                    ExternalTypeEnum.GENERAL,
                    'Official Site',
                ),
                link(
                    'https://bleach-anime.com',
                    ExternalTypeEnum.GENERAL,
                    ' official website ',
                ),
            ],
            { withWatch: false },
        );

        expect(general.map((l) => l.url)).toEqual([
            'https://example.jp/?id=1',
            'https://example.jp/#/title',
            'https://frieren-anime.jp/',
            'https://bleach-anime.com',
        ]);
    });
});
