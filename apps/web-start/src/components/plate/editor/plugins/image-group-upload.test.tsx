import { createPlateEditor } from 'platejs/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('sonner', () => ({
    toast: { error: vi.fn(), success: vi.fn() },
}));

import { toast } from 'sonner';

import { ImageGroupKit, ImageGroupPlugin } from './image-group-kit';

const jpeg = (name = 'a.jpg') => new File(['x'], name, { type: 'image/jpeg' });

const nodesOfType = (editor: any, type: string) => [
    ...editor.api.nodes({ at: [], match: (n: any) => n.type === type }),
];

function makeEditor(uploadImage: (file: File) => Promise<{ url: string }>) {
    const editor = createPlateEditor({
        plugins: ImageGroupKit,
        value: [{ type: 'p', children: [{ text: '' }] }],
    });
    editor.tf.select([0, 0]);
    editor.setOption(ImageGroupPlugin, 'uploadImage', uploadImage);
    return editor;
}

describe('image group upload pipeline (headless)', () => {
    beforeEach(() => vi.clearAllMocks());

    it('constructs the kit without throwing (import cycle is safe)', () => {
        expect(() => makeEditor(async () => ({ url: 'x' }))).not.toThrow();
    });

    it('inserts a placeholder then replaces it with an image on success', async () => {
        const editor = makeEditor(async () => ({
            url: 'https://cdn/x.jpg',
        }));

        await editor
            .getTransforms(ImageGroupPlugin)
            .imageGroup.upload({ files: [jpeg()] });

        expect(nodesOfType(editor, 'image_group')).toHaveLength(1);
        const images = nodesOfType(editor, 'image');
        expect(images).toHaveLength(1);
        expect((images[0][0] as any).url).toBe('https://cdn/x.jpg');
        expect(nodesOfType(editor, 'image_placeholder')).toHaveLength(0);
    });

    it('marks the placeholder as error (with backend message) on failure', async () => {
        const editor = makeEditor(async () => {
            throw Object.assign(new Error('Завеликий розмір зображення'), {
                code: 'upload:bad-size',
            });
        });

        await editor
            .getTransforms(ImageGroupPlugin)
            .imageGroup.upload({ files: [jpeg()] });

        const placeholders = nodesOfType(editor, 'image_placeholder');
        expect(placeholders).toHaveLength(1);
        expect((placeholders[0][0] as any).status).toBe('error');
        expect((placeholders[0][0] as any).error.message).toBe(
            'Завеликий розмір зображення',
        );
        expect(nodesOfType(editor, 'image')).toHaveLength(0);

        // The backend reason is also surfaced as a toast.
        expect(toast.error).toHaveBeenCalledTimes(1);
        expect(vi.mocked(toast.error).mock.lastCall?.[0]).toBe(
            'Завеликий розмір зображення',
        );
    });

    it('rejects svg before inserting any placeholder', async () => {
        const upload = vi.fn(async () => ({ url: 'x' }));
        const editor = makeEditor(upload);

        await editor.getTransforms(ImageGroupPlugin).imageGroup.upload({
            files: [new File(['x'], 'a.svg', { type: 'image/svg+xml' })],
        });

        expect(upload).not.toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalled();
        expect(nodesOfType(editor, 'image_placeholder')).toHaveLength(0);
    });

    it('caps a batch at MAX_IMAGE_COUNT and warns', async () => {
        const editor = makeEditor(async () => ({
            url: 'https://cdn/x.jpg',
        }));

        await editor.getTransforms(ImageGroupPlugin).imageGroup.upload({
            files: [jpeg('1'), jpeg('2'), jpeg('3'), jpeg('4'), jpeg('5')],
        });

        expect(nodesOfType(editor, 'image')).toHaveLength(4);
        expect(toast.error).toHaveBeenCalled();
    });
});
