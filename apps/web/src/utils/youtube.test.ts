import { describe, expect, it } from 'vitest';

import {
    extractYouTubeVideoId,
    isYouTubeVideoUrl,
    normalizeYouTubeVideoUrl,
} from './youtube';

const ID = 'dQw4w9WgXcQ';
const WATCH = `https://www.youtube.com/watch?v=${ID}`;

describe('youtube video urls', () => {
    it.each([
        [`https://www.youtube.com/watch?v=${ID}`, WATCH],
        [`https://youtube.com/watch?v=${ID}`, WATCH],
        [`https://m.youtube.com/watch?v=${ID}`, WATCH],
        [`http://www.youtube.com/watch?v=${ID}`, WATCH],
        [`https://WWW.YouTube.com/watch?v=${ID}`, WATCH],
        [`  https://www.youtube.com/watch?v=${ID}  `, WATCH],
        [`https://www.youtube.com/watch?feature=shared&v=${ID}`, WATCH],
        [`https://www.youtube.com/watch?v=${ID}&list=PL123&index=2`, WATCH],
        [`https://youtu.be/${ID}`, WATCH],
        [`https://youtu.be/${ID}?si=AbCdEf`, WATCH],
        [`https://www.youtube.com/embed/${ID}`, WATCH],
        [`https://www.youtube.com/embed/${ID}?si=AbCdEf`, WATCH],
        [`https://m.youtube.com/embed/${ID}`, WATCH],
        [`//www.youtube.com/embed/${ID}`, WATCH],
        [`//www.youtube.com/embed/${ID}?si=AbCdEf`, WATCH],
        [`  //youtube.com/embed/${ID}  `, WATCH],
        [
            `https://www.youtube.com/watch?v=a-b_c-d_e-f`,
            `https://www.youtube.com/watch?v=a-b_c-d_e-f`,
        ],
    ])('accepts %j as %j', (url, normalized) => {
        expect(isYouTubeVideoUrl(url)).toBe(true);
        expect(normalizeYouTubeVideoUrl(url)).toBe(normalized);
    });

    it.each([
        [`https://www.youtube.com/watch?v=${ID}&t=42`, `${WATCH}&t=42`],
        [`https://www.youtube.com/watch?v=${ID}&t=1m5s`, `${WATCH}&t=1m5s`],
        [`https://youtu.be/${ID}?t=90s`, `${WATCH}&t=90s`],
        [`https://youtu.be/${ID}?si=AbCdEf&t=1h2m3s`, `${WATCH}&t=1h2m3s`],
        [`https://www.youtube.com/embed/${ID}?start=42`, `${WATCH}&t=42`],
        [`//www.youtube.com/embed/${ID}?start=42`, `${WATCH}&t=42`],
    ])('keeps the start time of %j', (url, normalized) => {
        expect(normalizeYouTubeVideoUrl(url)).toBe(normalized);
    });

    it.each([
        [`https://www.youtube.com/watch?v=${ID}&t=`],
        [`https://www.youtube.com/watch?v=${ID}&t=abc`],
        [`https://www.youtube.com/watch?v=${ID}&t=42%26x%3D1`],
        [`https://youtu.be/${ID}?t=-5`],
    ])('drops a start time that is not a time in %j', (url) => {
        expect(normalizeYouTubeVideoUrl(url)).toBe(WATCH);
    });

    it.each([
        ['a look-alike host', `https://notyoutube.com/watch?v=${ID}`],
        [
            'a host that only starts like youtube',
            `https://youtube.com.evil.com/watch?v=${ID}`,
        ],
        [
            'a host that only ends like youtube',
            `https://evil-youtube.com/watch?v=${ID}`,
        ],
        [
            'another youtube subdomain',
            `https://music.youtube.com/watch?v=${ID}`,
        ],
        [
            'the privacy-enhanced embed host',
            `https://www.youtube-nocookie.com/embed/${ID}`,
        ],
        ['a youtu.be look-alike', `https://youtu.be.evil.com/${ID}`],
        [
            'a youtube url inside another url',
            `https://evil.com/?u=https://www.youtube.com/watch?v=${ID}`,
        ],
        ['shorts', `https://www.youtube.com/shorts/${ID}`],
        ['a channel handle', 'https://m.youtube.com/@channel'],
        [
            'a channel id',
            'https://www.youtube.com/channel/UC1234567890abcdefghijkl',
        ],
        ['a playlist', 'https://www.youtube.com/playlist?list=PL1234567890'],
        [
            'a watch url without a video',
            'https://www.youtube.com/watch?list=PL1234567890',
        ],
        ['a watch url with an empty video', 'https://www.youtube.com/watch?v='],
        ['a short video id', 'https://www.youtube.com/watch?v=dQw4w9WgXc'],
        ['a long video id', 'https://www.youtube.com/watch?v=dQw4w9WgXcQQ'],
        [
            'a video id with other characters',
            'https://www.youtube.com/watch?v=dQw4w9WgX.Q',
        ],
        ['a youtu.be url without a video', 'https://youtu.be/'],
        ['a youtu.be url with a deeper path', `https://youtu.be/${ID}/extra`],
        ['an embed url without a video', 'https://www.youtube.com/embed/'],
        ['a missing scheme', `www.youtube.com/watch?v=${ID}`],
        ['a protocol-relative look-alike', `//notyoutube.com/embed/${ID}`],
        [
            'a protocol-relative privacy-enhanced embed',
            `//www.youtube-nocookie.com/embed/${ID}`,
        ],
        [
            'a protocol-relative youtube url inside another url',
            `//evil.com/?u=https://www.youtube.com/embed/${ID}`,
        ],
        ['a protocol-relative shorts url', `//www.youtube.com/shorts/${ID}`],
        ['a single leading slash', `/www.youtube.com/embed/${ID}`],
        ['another scheme', `ftp://www.youtube.com/watch?v=${ID}`],
        ['the youtube home page', 'https://www.youtube.com/'],
        ['plain text', 'youtube'],
        ['an empty string', ''],
    ])('rejects %s', (_, url) => {
        expect(isYouTubeVideoUrl(url)).toBe(false);
        expect(normalizeYouTubeVideoUrl(url)).toBeNull();
    });
});

describe('extractYouTubeVideoId', () => {
    it.each([
        [`https://www.youtube.com/watch?v=${ID}&t=42`],
        [`https://youtu.be/${ID}`],
        [`https://www.youtube.com/embed/${ID}?si=AbCdEf`],
        [`youtube.com/watch?v=${ID}`],
    ])('still reads the video of a saved %j', (url) => {
        expect(extractYouTubeVideoId(url)).toBe(ID);
    });
});
