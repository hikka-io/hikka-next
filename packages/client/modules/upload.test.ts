import { HikkaClient } from '../client';
import { UploadTypeEnum } from '../types/upload';

const blob = () => new Blob(['x'], { type: 'image/jpeg' });

describe('UploadModule.createImageUpload (fetch path)', () => {
    afterEach(() => jest.restoreAllMocks());

    it('returns the parsed response on success', async () => {
        const client = new HikkaClient({ baseUrl: 'https://api.test' });
        jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ url: 'https://cdn/img.jpg' }),
        } as Response);

        const res = await client.upload.createImageUpload(
            UploadTypeEnum.ATTACHMENT,
            blob(),
        );
        expect(res).toEqual({ url: 'https://cdn/img.jpg' });
    });

    it('throws HikkaApiError carrying backend code/status/message', async () => {
        const client = new HikkaClient({ baseUrl: 'https://api.test' });
        jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: false,
            status: 400,
            json: async () => ({
                message: 'Завеликий розмір зображення',
                code: 'upload:bad-size',
            }),
        } as Response);

        await expect(
            client.upload.createImageUpload(UploadTypeEnum.ATTACHMENT, blob()),
        ).rejects.toMatchObject({
            name: 'HikkaApiError',
            status: 400,
            code: 'upload:bad-size',
            message: 'Завеликий розмір зображення',
        });
    });
});

describe('UploadModule.createImageUpload (xhr path)', () => {
    class FakeXhr {
        upload = { onprogress: null as any };
        onload: any = null;
        onerror: any = null;
        onabort: any = null;
        status = 0;
        responseText = '';
        open() {}
        setRequestHeader() {}
        abort() {
            this.onabort?.();
        }
        send() {
            this.upload.onprogress?.({
                lengthComputable: true,
                loaded: 5,
                total: 10,
            });
            this.status = 200;
            this.responseText = JSON.stringify({ url: 'https://cdn/a.jpg' });
            this.onload?.();
        }
    }

    it('reports progress and resolves', async () => {
        (global as any).XMLHttpRequest = FakeXhr;
        const client = new HikkaClient({ baseUrl: 'https://api.test' });
        const progress: number[] = [];

        const res = await client.upload.createImageUpload(
            UploadTypeEnum.ATTACHMENT,
            blob(),
            { onUploadProgress: (p) => progress.push(p) },
        );

        expect(res).toEqual({ url: 'https://cdn/a.jpg' });
        expect(progress).toContain(50);
    });
});
