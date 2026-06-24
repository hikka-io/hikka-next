import {
    ATTACHMENT_MAX_BYTES,
    classifyAttachmentType,
    isWithinAttachmentSize,
} from './upload';

describe('classifyAttachmentType', () => {
    it('passes through backend-supported mimes', () => {
        expect(classifyAttachmentType('image/jpeg')).toBe('passthrough');
        expect(classifyAttachmentType('image/webp')).toBe('passthrough');
        expect(classifyAttachmentType('image/gif')).toBe('passthrough');
    });

    it('converts other raster images', () => {
        expect(classifyAttachmentType('image/png')).toBe('convert');
        expect(classifyAttachmentType('image/bmp')).toBe('convert');
    });

    it('rejects svg and non-images', () => {
        expect(classifyAttachmentType('image/svg+xml')).toBe('reject');
        expect(classifyAttachmentType('application/pdf')).toBe('reject');
        expect(classifyAttachmentType('')).toBe('reject');
    });
});

describe('isWithinAttachmentSize', () => {
    it('accepts files up to the 2MB limit', () => {
        expect(isWithinAttachmentSize(ATTACHMENT_MAX_BYTES)).toBe(true);
        expect(isWithinAttachmentSize(0)).toBe(true);
    });

    it('rejects files over the limit', () => {
        expect(isWithinAttachmentSize(ATTACHMENT_MAX_BYTES + 1)).toBe(false);
    });
});
