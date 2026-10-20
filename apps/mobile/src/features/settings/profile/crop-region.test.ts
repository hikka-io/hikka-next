import { describe, expect, it } from 'vitest';

import { centredCrop } from './crop-region';

describe('centredCrop', () => {
    it('cuts a landscape photo to the 3:1 cover band', () => {
        expect(centredCrop(4000, 3000, 3)).toEqual({
            originX: 0,
            originY: 833,
            width: 4000,
            height: 1333,
        });
    });

    it('limits a portrait photo by its width for the cover', () => {
        expect(centredCrop(3000, 4000, 3)).toEqual({
            originX: 0,
            originY: 1500,
            width: 3000,
            height: 1000,
        });
    });

    it('cuts a square from a landscape and a portrait photo', () => {
        expect(centredCrop(4000, 3000, 1)).toEqual({
            originX: 500,
            originY: 0,
            width: 3000,
            height: 3000,
        });
        expect(centredCrop(3000, 4000, 1)).toEqual({
            originX: 0,
            originY: 500,
            width: 3000,
            height: 3000,
        });
    });

    it('keeps the region inside the image', () => {
        for (const [w, h, ratio] of [
            [1001, 333, 3],
            [999, 1000, 3],
            [7, 5, 1],
        ] as const) {
            const crop = centredCrop(w, h, ratio);

            expect(crop.originX).toBeGreaterThanOrEqual(0);
            expect(crop.originY).toBeGreaterThanOrEqual(0);
            expect(crop.originX + crop.width).toBeLessThanOrEqual(w);
            expect(crop.originY + crop.height).toBeLessThanOrEqual(h);
        }
    });
});
