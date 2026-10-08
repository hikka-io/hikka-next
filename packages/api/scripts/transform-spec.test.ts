import { describe, expect, it } from 'vitest';

import { addDiscriminators, hoistInlineEnums } from './transform-spec';

const kindEnum = () => ({ type: 'string', enum: ['a', 'b'] });

const makeSpec = () => ({
    paths: {
        '/items': {
            get: {
                operationId: 'list_items',
                parameters: [
                    {
                        name: 'kind',
                        in: 'query',
                        schema: { ...kindEnum(), default: 'a', title: 'Kind' },
                    },
                ],
            },
        },
    },
    components: {
        schemas: {
            Alpha: {
                properties: {
                    kind: {
                        anyOf: [
                            { items: kindEnum(), type: 'array' },
                            { type: 'null' },
                        ],
                        title: 'Kind',
                    },
                },
            },
            Zeta: {
                properties: {
                    kind: { anyOf: [kindEnum(), { type: 'null' }] },
                    other: { type: 'string' },
                },
            },
        },
    },
});

describe('hoistInlineEnums', () => {
    it('moves a repeated inline enum into a sorted named schema and references it', () => {
        const spec = hoistInlineEnums(makeSpec(), { kind: 'KindEnum' });
        const ref = { $ref: '#/components/schemas/KindEnum' };

        expect(Object.keys(spec.components.schemas)).toEqual([
            'Alpha',
            'KindEnum',
            'Zeta',
        ]);
        expect(spec.components.schemas).toMatchObject({
            KindEnum: { type: 'string', enum: ['a', 'b'], title: 'KindEnum' },
            Alpha: {
                properties: {
                    kind: {
                        anyOf: [
                            { items: ref, type: 'array' },
                            { type: 'null' },
                        ],
                        title: 'Kind',
                    },
                },
            },
            Zeta: {
                properties: {
                    kind: { anyOf: [ref, { type: 'null' }] },
                    other: { type: 'string' },
                },
            },
        });
        expect(spec.paths['/items'].get.parameters[0].schema).toEqual({
            ...ref,
            default: 'a',
            title: 'Kind',
        });
    });

    it('throws when the occurrences disagree', () => {
        const spec = makeSpec();
        spec.components.schemas.Zeta.properties.kind.anyOf[0] = {
            type: 'string',
            enum: ['a', 'b', 'c'],
        };

        expect(() => hoistInlineEnums(spec, { kind: 'KindEnum' })).toThrow(
            'kind enums differ',
        );
    });

    it('throws when the name is taken or nothing is left inline', () => {
        expect(() => hoistInlineEnums(makeSpec(), { kind: 'Alpha' })).toThrow(
            'Alpha already exists',
        );
        expect(() =>
            hoistInlineEnums(makeSpec(), { other: 'OtherEnum' }),
        ).toThrow('no inline enum for other');
    });

    it('throws when the spec has no component schemas', () => {
        const { paths } = makeSpec();

        expect(() => hoistInlineEnums({ paths }, { kind: 'KindEnum' })).toThrow(
            'spec has no components.schemas',
        );
    });
});

const typed = (value: string, required = ['kind']) => ({
    type: 'object',
    properties: { kind: { type: 'string', const: value } },
    required,
});

const refTo = (name: string) => ({ $ref: `#/components/schemas/${name}` });

const makeUnionSpec = () => ({
    paths: {
        '/things': {
            get: {
                responses: {
                    200: {
                        content: {
                            'application/json': {
                                schema: {
                                    items: { anyOf: [refTo('A'), refTo('B')] },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            A: typed('a'),
            B: typed('b'),
            Loose: typed('a', []),
            Twin: typed('a'),
            Holder: {
                properties: {
                    nullable: {
                        anyOf: [refTo('A'), refTo('B'), { type: 'null' }],
                    },
                    loose: { anyOf: [refTo('A'), refTo('Loose')] },
                    twin: { anyOf: [refTo('A'), refTo('Twin')] },
                    inline: { anyOf: [refTo('A'), typed('c')] },
                    single: { anyOf: [refTo('A'), { type: 'null' }] },
                    plain: { anyOf: [{ type: 'string' }, { type: 'integer' }] },
                },
            },
        },
    },
});

describe('addDiscriminators', () => {
    const mapping = { a: refTo('A').$ref, b: refTo('B').$ref };

    it('discriminates unions whose members all require a distinct const', () => {
        const spec = addDiscriminators(makeUnionSpec(), 'kind');
        const { properties } = spec.components.schemas.Holder;

        expect(properties.nullable).toEqual({
            anyOf: [refTo('A'), refTo('B'), { type: 'null' }],
            discriminator: { propertyName: 'kind', mapping },
        });
        expect(
            spec.paths['/things'].get.responses[200].content['application/json']
                .schema.items,
        ).toEqual({
            anyOf: [refTo('A'), refTo('B')],
            discriminator: { propertyName: 'kind', mapping },
        });
    });

    it('leaves optional, duplicate, inline, single and non-object unions alone', () => {
        const before = makeUnionSpec().components.schemas.Holder.properties;
        const { properties } = addDiscriminators(makeUnionSpec(), 'kind')
            .components.schemas.Holder;

        for (const key of [
            'loose',
            'twin',
            'inline',
            'single',
            'plain',
        ] as const) {
            expect(properties[key]).toEqual(before[key]);
        }
    });
});
