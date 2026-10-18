import { act, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ArticleProvider, { useArticleStoreApi } from './article-provider';
import type { ArticleState } from './article-store';
import {
    type ArticleSave,
    readCreatedArticle,
    selectUnsavedBlocking,
    useArticleSave,
} from './use-article-save';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const api = vi.hoisted(() => ({
    create: vi.fn(),
    update: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
}));

vi.mock('@hikka/api', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hikka/api')>()),
    createArticleMutation: () => ({ mutationFn: api.create }),
    updateArticleMutation: () => ({ mutationFn: api.update }),
}));

vi.mock('@/utils/navigation', () => ({
    useRouter: () => ({ push: api.push, replace: api.replace }),
}));

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const DOCUMENT = [{ type: 'p', children: [{ text: 'Текст статті' }] }];

type Handle = {
    save: ArticleSave;
    store: ReturnType<typeof useArticleStoreApi>;
};

type HarnessProps = {
    onRender: (handle: Handle) => void;
    /** Reported from a child effect, like the real editor does. */
    editorValue?: ArticleState['document'];
};

function EditorStub({ value }: { value: ArticleState['document'] }) {
    const store = useArticleStoreApi();

    useEffect(() => {
        if (value) store.getState().setEditorDocument(value);
    }, [store, value]);

    return null;
}

function Harness({ onRender, editorValue }: HarnessProps) {
    onRender({ save: useArticleSave(), store: useArticleStoreApi() });
    return <EditorStub value={editorValue} />;
}

const teardown: (() => void)[] = [];

async function mount(
    initialState: Partial<ArticleState> = {},
    editorValue?: ArticleState['document'],
) {
    const handle = {} as Handle;
    const root = createRoot(document.createElement('div'));
    teardown.push(() => root.unmount());

    await act(async () => {
        root.render(
            <QueryClientProvider client={new QueryClient()}>
                <ArticleProvider initialState={initialState}>
                    <Harness
                        onRender={(next) => Object.assign(handle, next)}
                        editorValue={editorValue}
                    />
                </ArticleProvider>
            </QueryClientProvider>,
        );
    });

    return handle;
}

const edit = (handle: Handle, change: Partial<ArticleState>) =>
    act(async () => handle.store.setState(change));

const settle = () =>
    act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
    });

const save = (handle: Handle) => act(async () => handle.save.save());

const saveState = (handle: Handle) => handle.store.getState().save;

beforeEach(() => {
    vi.useFakeTimers();
    api.create.mockImplementation(async () => ({
        slug: 'new-1',
        draft: true,
        updated: 1,
    }));
    api.update.mockImplementation(async ({ path, body }) => ({
        slug: path.slug,
        draft: body.draft,
        updated: 2,
    }));
});

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
    vi.useRealTimers();
    vi.clearAllMocks();
});

describe('useArticleSave', () => {
    it('saves nothing until asked', async () => {
        const handle = await mount();

        await edit(handle, { title: 'Стаття', document: DOCUMENT });
        await settle();

        expect(api.create).not.toHaveBeenCalled();
        expect(saveState(handle).dirty).toBe(true);
        expect(selectUnsavedBlocking(handle.store.getState())).toBe(true);
    });

    it('creates a new draft once, then updates it', async () => {
        const handle = await mount();

        await edit(handle, { title: 'Стаття про аніме', document: DOCUMENT });
        await save(handle);

        expect(api.create).toHaveBeenCalledTimes(1);
        expect(api.create.mock.calls[0][0].body).toMatchObject({
            title: 'Стаття про аніме',
            draft: true,
        });

        await edit(handle, { tags: ['огляд'] });
        await save(handle);

        expect(api.create).toHaveBeenCalledTimes(1);
        expect(api.update).toHaveBeenCalledWith(
            expect.objectContaining({
                path: { slug: 'new-1' },
                body: expect.objectContaining({ tags: ['огляд'], draft: true }),
            }),
            expect.anything(),
        );
        expect(saveState(handle)).toMatchObject({
            dirty: false,
            status: 'saved',
        });
    });

    it('masks the route after the first save instead of leaving it', async () => {
        const handle = await mount();

        await edit(handle, { title: 'Стаття', document: DOCUMENT });
        await save(handle);

        expect(api.replace).toHaveBeenCalledWith(
            '.',
            expect.objectContaining({
                mask: { to: '/articles/new-1/update', unmaskOnReload: true },
                resetScroll: false,
                ignoreBlocker: true,
            }),
        );

        const { state } = api.replace.mock.calls[0][1];
        expect(readCreatedArticle(state({ key: 'k' }))).toBe('new-1');
        expect(readCreatedArticle({ key: 'k' })).toBeUndefined();
    });

    it('does not create twice when saves overlap', async () => {
        let resolveCreate: (value: unknown) => void = () => {};
        api.create.mockImplementationOnce(
            () => new Promise((resolve) => (resolveCreate = resolve)),
        );
        const handle = await mount();

        await edit(handle, { title: 'Стаття', document: DOCUMENT });
        const first = handle.save.save();
        await edit(handle, { title: 'Стаття 2' });
        const second = handle.save.save();

        await act(async () => {
            resolveCreate({ slug: 'new-1', draft: true, updated: 1 });
            await Promise.all([first, second]);
        });

        expect(api.create).toHaveBeenCalledTimes(1);
        expect(api.update).toHaveBeenCalledTimes(1);
        expect(api.update.mock.calls[0][0].body.title).toBe('Стаття 2');
    });

    it('saves on Ctrl+S on any layout, but only a valid changed article', async () => {
        const handle = await mount({
            slug: 'draft-1',
            title: 'Стаття',
            document: DOCUMENT,
        });
        const press = () =>
            act(async () => {
                window.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: 'ы',
                        code: 'KeyS',
                        ctrlKey: true,
                    }),
                );
            });

        await press();
        expect(api.update).not.toHaveBeenCalled();

        await edit(handle, { title: 'Ст' });
        await press();
        expect(api.update).not.toHaveBeenCalled();

        await edit(handle, { title: 'Стаття 2' });
        await press();
        expect(api.update).toHaveBeenCalledTimes(1);
    });

    it('counts an edit that is undone as clean', async () => {
        const handle = await mount({
            slug: 'live-1',
            title: 'Стаття',
            document: DOCUMENT,
            draft: false,
        });

        await edit(handle, { title: 'Стаття, виправлена' });
        expect(saveState(handle).dirty).toBe(true);

        await edit(handle, { title: 'Стаття' });
        await settle();

        expect(saveState(handle).dirty).toBe(false);
    });

    it('takes the normalized value the editor reports before the hook subscribes', async () => {
        const raw = [{ type: 'p', children: [{ text: 'Текст', bold: false }] }];
        const handle = await mount(
            { slug: 'draft-1', title: 'Стаття', document: raw },
            DOCUMENT,
        );

        await edit(handle, { title: 'Стаття 2' });
        await edit(handle, { title: 'Стаття' });
        await settle();

        expect(saveState(handle).dirty).toBe(false);
    });

    it('takes the normalized editor value as the saved version', async () => {
        const handle = await mount({
            slug: 'draft-1',
            title: 'Стаття',
            document: DOCUMENT,
        });

        await act(async () =>
            handle.store
                .getState()
                .setEditorDocument([
                    ...DOCUMENT,
                    { type: 'p', children: [{ text: '' }] },
                ]),
        );
        await settle();

        expect(saveState(handle).dirty).toBe(false);
    });

    it('clears a failed save once the content is back to the saved version', async () => {
        api.update.mockRejectedValueOnce(new Error('offline'));
        const handle = await mount({
            slug: 'draft-1',
            title: 'Стаття',
            document: DOCUMENT,
        });

        await edit(handle, { title: 'Стаття 2' });
        await save(handle);

        expect(saveState(handle).status).toBe('error');
        expect(selectUnsavedBlocking(handle.store.getState())).toBe(true);

        await edit(handle, { title: 'Стаття' });
        await settle();

        expect(saveState(handle)).toMatchObject({
            status: 'saved',
            dirty: false,
        });
    });

    it('updates a published article in place', async () => {
        const handle = await mount({
            slug: 'live-1',
            title: 'Стаття',
            document: DOCUMENT,
            draft: false,
        });

        await edit(handle, { title: 'Стаття, виправлена' });
        await save(handle);

        expect(api.update.mock.calls[0][0].body).toMatchObject({
            title: 'Стаття, виправлена',
            draft: false,
        });
        expect(api.push).not.toHaveBeenCalled();
    });

    it('opens the article after publishing a draft', async () => {
        const handle = await mount({
            slug: 'draft-1',
            title: 'Стаття',
            document: DOCUMENT,
        });

        await act(async () => handle.save.publish());

        expect(api.update.mock.calls[0][0].body.draft).toBe(false);
        expect(api.push).toHaveBeenCalledWith('/articles/draft-1', {
            ignoreBlocker: true,
        });
    });
});
