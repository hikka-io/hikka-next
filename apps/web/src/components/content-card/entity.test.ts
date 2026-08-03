import { describe, expect, it } from 'vitest';

import type { CardEntity } from './entity';
import { contentEntity, resolveEntity } from './entity';

const tracked = { status: 'watching' };

const animeEntity = (extra: Record<string, unknown>) =>
    ({
        type: 'anime',
        data: { data_type: 'anime', slug: 'frieren', image: null },
        ...extra,
    }) as unknown as CardEntity;

// The three tracking states read alike at a glance but drive different UI, so
// pin them: only `undefined` may reach the tooltip as "go and fetch it".
describe('resolveEntity tracking', () => {
    it('prefers the entry supplied alongside the content', () => {
        expect(resolveEntity(animeEntity({ watch: tracked })).watch).toBe(
            tracked,
        );
    });

    it('keeps a supplied null as known-untracked', () => {
        expect(resolveEntity(animeEntity({ watch: null })).watch).toBeNull();
    });

    it('reads an embedded array when nothing was supplied', () => {
        const entity = animeEntity({
            data: {
                data_type: 'anime',
                slug: 'frieren',
                image: null,
                watch: [tracked],
            },
        });

        expect(resolveEntity(entity).watch).toBe(tracked);
    });

    it('treats an empty embedded array as known-untracked', () => {
        const entity = animeEntity({
            data: {
                data_type: 'anime',
                slug: 'frieren',
                image: null,
                watch: [],
            },
        });

        expect(resolveEntity(entity).watch).toBeNull();
    });

    it('leaves the status unknown when the content carries no array', () => {
        expect(resolveEntity(animeEntity({})).watch).toBeUndefined();
    });
});

describe('resolveEntity identity', () => {
    it('derives the link from the content type', () => {
        const resolved = resolveEntity({
            type: 'manga',
            data: { data_type: 'manga', slug: 'berserk', image: null },
        } as unknown as CardEntity);

        expect(resolved.href).toBe('/manga/berserk');
        expect(resolved.content_type).toBe('manga');
    });

    it('exposes no tooltip payload for entities without one', () => {
        const resolved = resolveEntity({
            type: 'character',
            data: { data_type: 'character', slug: 'guts', image: null },
        } as unknown as CardEntity);

        expect(resolved.tooltipItem).toBeUndefined();
        expect(resolved.href).toBe('/characters/guts');
    });
});

describe('contentEntity', () => {
    it('maps each response to its own arm', () => {
        expect(
            contentEntity({ data_type: 'anime', slug: 'x' } as never).type,
        ).toBe('anime');
        expect(
            contentEntity({ data_type: 'person', slug: 'x' } as never).type,
        ).toBe('person');
    });
});
