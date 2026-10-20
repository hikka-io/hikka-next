import { describe, expect, it } from 'vitest';

import { buildImgproxyUrl } from './imgproxy';

const BASE = 'https://img.hikka.io';
const CDN = 'https://cdn.hikka.io/content/anime/x.jpg';

describe('buildImgproxyUrl', () => {
    it('resizes Hikka CDN images', () => {
        expect(buildImgproxyUrl(BASE, CDN, { width: 480, height: 686 })).toBe(
            `${BASE}/insecure/rs:fit:480:686:0:0/plain/${CDN}`,
        );
        expect(buildImgproxyUrl(BASE, CDN, { width: 112.4 }, 'fill')).toBe(
            `${BASE}/insecure/rs:fill:112:0:0:0/plain/${CDN}`,
        );
        expect(buildImgproxyUrl(BASE, CDN, {})).toBe(
            `${BASE}/insecure/plain/${CDN}`,
        );
    });

    it('leaves other sources and a missing proxy alone', () => {
        expect(
            buildImgproxyUrl(BASE, 'https://example.com/x.jpg', { width: 1 }),
        ).toBe('https://example.com/x.jpg');
        expect(buildImgproxyUrl(undefined, CDN, { width: 1 })).toBe(CDN);
    });
});
