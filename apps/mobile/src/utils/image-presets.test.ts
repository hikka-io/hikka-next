import { describe, expect, it } from 'vitest';

import { presetImageUrl, sizedImageUrl } from './image-presets';

const CDN = 'https://cdn.hikka.io/content/anime/a/poster.jpg';

describe('presetImageUrl', () => {
    it('resizes CDN images to the preset', () => {
        expect(presetImageUrl(CDN, 'cardSm')).toBe(
            `https://img.hikka.io/insecure/rs:fit:320:458:0:0/plain/${CDN}`,
        );
    });

    it('passes other hosts through and drops empty sources', () => {
        expect(presetImageUrl('https://hikka.io/logo.png', 'cardXs')).toBe(
            'https://hikka.io/logo.png',
        );
        expect(presetImageUrl(null, 'cardSm')).toBeUndefined();
    });
});

describe('sizedImageUrl', () => {
    it('fills a square box at 3x', () => {
        expect(sizedImageUrl(CDN, 96, 96)).toBe(
            `https://img.hikka.io/insecure/rs:fill:288:288:0:0/plain/${CDN}`,
        );
    });

    it('fits a width-only box', () => {
        expect(sizedImageUrl(CDN, 440)).toBe(
            `https://img.hikka.io/insecure/rs:fit:1320:0:0:0/plain/${CDN}`,
        );
    });
});
