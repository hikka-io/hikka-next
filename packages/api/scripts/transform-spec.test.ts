import { recoverOperationId, transformSpec } from './transform-spec';

describe('recoverOperationId', () => {
    it('strips the FastAPI default path+method suffix to recover the route name', () => {
        expect(
            recoverOperationId(
                'character_info_characters__slug__get',
                '/characters/{slug}',
                'get',
            ),
        ).toBe('character_info');
        expect(
            recoverOperationId(
                'mal_content_integrations_mal__content_type___mal_id__get',
                '/integrations/mal/{content_type}/{mal_id}',
                'get',
            ),
        ).toBe('mal_content');
    });

    it('is idempotent on already-clean ids', () => {
        expect(
            recoverOperationId('character_info', '/characters/{slug}', 'get'),
        ).toBe('character_info');
    });
});

describe('transformSpec', () => {
    it('rewrites every operationId in place and leaves other fields intact', () => {
        const spec = {
            paths: {
                '/characters/{slug}': {
                    get: {
                        operationId: 'character_info_characters__slug__get',
                        summary: 'Character Info',
                    },
                },
            },
        };
        const out = transformSpec(spec);
        expect(out.paths['/characters/{slug}'].get.operationId).toBe(
            'character_info',
        );
        expect(out.paths['/characters/{slug}'].get.summary).toBe(
            'Character Info',
        );
    });

    it('narrows data_type to a const literal per mapped schema', () => {
        const spec = {
            paths: {},
            components: {
                schemas: {
                    AnimeResponse: {
                        properties: {
                            data_type: { type: 'string', title: 'Data Type' },
                            slug: { type: 'string' },
                        },
                    },
                    ArticleMangaNovelContentResponse: {
                        properties: {
                            data_type: { type: 'string', title: 'Data Type' },
                        },
                    },
                    SomeOtherSchema: {
                        properties: { name: { type: 'string' } },
                    },
                },
            },
        };
        const out = transformSpec(spec);
        const schemas = out.components.schemas;
        expect(schemas.AnimeResponse.properties.data_type).toEqual({
            type: 'string',
            const: 'anime',
        });
        expect(
            schemas.ArticleMangaNovelContentResponse.properties.data_type,
        ).toEqual({ type: 'string', enum: ['manga', 'novel'] });
        // untouched: schema without data_type
        expect(schemas.SomeOtherSchema.properties.name).toEqual({
            type: 'string',
        });
    });
});
