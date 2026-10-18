import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { prepareAttachmentFile } from './upload-image';

const image = vi.hoisted(() => ({ width: 800, height: 600 }));
const encode = vi.hoisted(() => vi.fn());

vi.mock('@/utils/image', () => ({ convertPngToJpeg: encode }));

class FakeImage {
    src = '';
    get naturalWidth() {
        return image.width;
    }
    get naturalHeight() {
        return image.height;
    }
    decode() {
        return Promise.resolve();
    }
}

const MB = 1024 * 1024;

const file = (type: string, size = 1000) =>
    new File([new Uint8Array(size)], 'image', { type });

const blob = (size: number) => new Blob([new Uint8Array(size)]);

beforeEach(() => {
    vi.stubGlobal('Image', FakeImage);
    URL.createObjectURL = vi.fn(() => 'blob:image');
    URL.revokeObjectURL = vi.fn();
    encode.mockImplementation(async () => ({ blob: blob(1000) }));
    Object.assign(image, { width: 800, height: 600 });
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
});

describe('prepareAttachmentFile', () => {
    it('passes a fitting jpeg through untouched', async () => {
        const jpeg = file('image/jpeg');

        expect(await prepareAttachmentFile(jpeg)).toBe(jpeg);
        expect(encode).not.toHaveBeenCalled();
    });

    it('rejects an image below the minimum side', async () => {
        image.height = 150;

        await expect(prepareAttachmentFile(file('image/jpeg'))).rejects.toThrow(
            'щонайменше 200×200',
        );
    });

    it('scales an oversized image down to the maximum side', async () => {
        Object.assign(image, { width: 4000, height: 3000 });

        await prepareAttachmentFile(file('image/webp'));

        expect(encode).toHaveBeenCalledWith(
            expect.objectContaining({ maxWidth: 2000, maxHeight: 2000 }),
        );
    });

    it('compresses harder until the file fits 2 MB', async () => {
        encode
            .mockResolvedValueOnce({ blob: blob(3 * MB) })
            .mockResolvedValueOnce({ blob: blob(MB) });

        const prepared = await prepareAttachmentFile(
            file('image/jpeg', 3 * MB),
        );

        expect(prepared.size).toBe(MB);
        expect(encode.mock.calls.map(([options]) => options.quality)).toEqual([
            0.9, 0.8,
        ]);
    });

    it('converts other formats to jpeg', async () => {
        await prepareAttachmentFile(file('image/png'));

        expect(encode).toHaveBeenCalledTimes(1);
    });

    it('keeps an animated webp animated, so an oversized one is rejected', async () => {
        image.width = 2400;
        const header = new Uint8Array(32);
        header.set(new TextEncoder().encode('RIFF'), 0);
        header.set(new TextEncoder().encode('WEBPVP8X'), 8);
        header[20] = 0x02;
        const animated = new File([header], 'image', { type: 'image/webp' });

        await expect(prepareAttachmentFile(animated)).rejects.toThrow(
            'Анімація завелика',
        );
        expect(encode).not.toHaveBeenCalled();
    });

    it('rejects an image too elongated to fit both side limits', async () => {
        Object.assign(image, { width: 6000, height: 400 });

        await expect(prepareAttachmentFile(file('image/jpeg'))).rejects.toThrow(
            'надто видовжене',
        );
    });

    it('keeps a gif animated, so an oversized one is rejected', async () => {
        image.width = 2400;

        await expect(prepareAttachmentFile(file('image/gif'))).rejects.toThrow(
            'Анімація завелика',
        );
        expect(encode).not.toHaveBeenCalled();
    });
});
