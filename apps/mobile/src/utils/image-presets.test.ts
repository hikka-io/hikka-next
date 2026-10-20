import { describe, expect, it, vi } from 'vitest';

import { presetForWidth, presetImageUrl, sizedImageUrl } from './image-presets';

const pixelRatio = vi.hoisted(() => ({ value: 3 }));

vi.mock('react-native', () => ({
    PixelRatio: { get: () => pixelRatio.value },
}));

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

describe('presetForWidth', () => {
    it('picks the smallest preset covering the box at the screen density', () => {
        pixelRatio.value = 3;
        expect(presetForWidth(32)).toBe('cardXs');
        expect(presetForWidth(64)).toBe('cardSm');
        expect(presetForWidth(112)).toBe('card');
        expect(presetForWidth(128)).toBe('card');
        expect(presetForWidth(150)).toBe('cardLg');
        expect(presetForWidth(192)).toBe('cardLg');
    });

    it('needs smaller presets on 2x screens and caps the density at 3x', () => {
        pixelRatio.value = 2;
        expect(presetForWidth(112)).toBe('cardSm');
        pixelRatio.value = 4;
        expect(presetForWidth(64)).toBe('cardSm');
        pixelRatio.value = 3;
    });
});

describe('sizedImageUrl', () => {
    it('fills a square box at the screen density', () => {
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
