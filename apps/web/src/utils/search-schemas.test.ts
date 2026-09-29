import { defaultParseSearch } from '@tanstack/react-router';
import { describe, expect, it } from 'vitest';

import {
    favoritesSearchSchema,
    historySearchSchema,
    loginSearchSchema,
} from './search-schemas';

const parse = <T>(schema: { parse: (input: unknown) => T }, search: string) =>
    schema.parse(defaultParseSearch(search));

describe('loginSearchSchema', () => {
    it('keeps a path callbackUrl', () => {
        expect(parse(loginSearchSchema, '?callbackUrl=%2Fanime')).toEqual({
            callbackUrl: '/anime',
        });
        expect(
            parse(loginSearchSchema, '?callbackUrl=%2Fanime%3Fpage%3D2'),
        ).toEqual({ callbackUrl: '/anime?page=2' });
    });

    it('drops a callbackUrl the search parser turned into JSON', () => {
        expect(parse(loginSearchSchema, '?callbackUrl=123').callbackUrl).toBe(
            undefined,
        );
        expect(
            parse(loginSearchSchema, '?callbackUrl=%5B1%5D').callbackUrl,
        ).toBe(undefined);
        expect(
            parse(loginSearchSchema, '?callbackUrl=%7B%22a%22%3A1%7D')
                .callbackUrl,
        ).toBe(undefined);
        expect(parse(loginSearchSchema, '?callbackUrl=null').callbackUrl).toBe(
            undefined,
        );
    });

    it('leaves a missing callbackUrl undefined', () => {
        expect(parse(loginSearchSchema, '')).toEqual({});
    });
});

describe('historySearchSchema', () => {
    it('keeps any string type, known or not', () => {
        expect(parse(historySearchSchema, '?type=following')).toEqual({
            type: 'following',
        });
        expect(parse(historySearchSchema, '?type=user')).toEqual({
            type: 'user',
        });
        expect(parse(historySearchSchema, '?type=garbage')).toEqual({
            type: 'garbage',
        });
        expect(parse(historySearchSchema, '?type=')).toEqual({ type: '' });
    });

    it('drops a non-string type instead of failing the route', () => {
        expect(parse(historySearchSchema, '?type=123').type).toBe(undefined);
        expect(parse(historySearchSchema, '?type=null').type).toBe(undefined);
        expect(parse(historySearchSchema, '?type=true').type).toBe(undefined);
    });

    it('leaves a missing type undefined', () => {
        expect(parse(historySearchSchema, '')).toEqual({});
    });
});

describe('favoritesSearchSchema', () => {
    it('keeps a known type and drops an unknown one', () => {
        expect(parse(favoritesSearchSchema, '?type=person')).toEqual({
            type: 'person',
        });
        expect(parse(favoritesSearchSchema, '?type=garbage').type).toBe(
            undefined,
        );
    });
});
