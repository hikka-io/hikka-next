import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import CollectionProvider, { useCollectionStore } from './collection-provider';
import type { CollectionState, Item } from './collection-store';
import {
    type CollectionSave,
    describeSave,
    selectSaveDisabled,
    selectUnsavedBlocking,
    useCollectionSave,
} from './use-collection-save';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const api = vi.hoisted(() => ({
    create: vi.fn(),
    update: vi.fn(),
    replace: vi.fn(),
}));

vi.mock('@hikka/api', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hikka/api')>()),
    createCollectionMutation: () => ({ mutationFn: api.create }),
    updateCollectionMutation: () => ({ mutationFn: api.update }),
}));

vi.mock('@/utils/navigation', () => ({
    useRouter: () => ({ replace: api.replace }),
}));

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const REFERENCE = 'a1b2c3d4-0000-0000-0000-000000000000';

const item = (slug: string): Item => ({
    id: slug,
    content: { slug } as Item['content'],
});

const VALID: Partial<CollectionState> = {
    title: 'Колекція',
    description: 'Опис колекції',
    groups: [{ id: 'default', title: null, items: [item('a')] }],
};

type Handle = {
    save: CollectionSave;
    store: ReturnType<typeof useCollectionStore>;
};

function Harness({ onRender }: { onRender: (handle: Handle) => void }) {
    onRender({ save: useCollectionSave(), store: useCollectionStore() });
    return null;
}

const teardown: (() => void)[] = [];

async function mount(initialState: Partial<CollectionState> = VALID) {
    const handle = {} as Handle;
    const root = createRoot(document.createElement('div'));
    teardown.push(() => root.unmount());

    await act(async () => {
        root.render(
            <QueryClientProvider client={new QueryClient()}>
                <CollectionProvider initialState={initialState}>
                    <Harness onRender={(next) => Object.assign(handle, next)} />
                </CollectionProvider>
            </QueryClientProvider>,
        );
    });

    return handle;
}

const edit = (handle: Handle, change: Partial<CollectionState>) =>
    act(async () => handle.store.setState(change));

const settle = () =>
    act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
    });

const save = (handle: Handle) => act(async () => handle.save.save());

const state = (handle: Handle) => handle.store.getState();

const savedCollection = (body: { title: string }) => ({
    reference: REFERENCE,
    title: body.title,
    description: 'Опис колекції',
    content_type: 'anime',
    nsfw: false,
    spoiler: false,
    visibility: 'private',
    tags: [],
    labels_order: [],
    collection: [{ label: null, comment: null, content: { slug: 'a' } }],
});

beforeEach(() => {
    vi.useFakeTimers();
    api.create.mockImplementation(async ({ body }) => savedCollection(body));
    api.update.mockImplementation(async ({ body }) => savedCollection(body));
});

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
    vi.useRealTimers();
    vi.clearAllMocks();
});

describe('useCollectionSave', () => {
    it('saves nothing until asked and tracks unsaved edits', async () => {
        const handle = await mount({ ...VALID, reference: REFERENCE });

        await edit(handle, { title: 'Нова назва' });
        await settle();

        expect(api.update).not.toHaveBeenCalled();
        expect(selectUnsavedBlocking(state(handle))).toBe(true);

        await edit(handle, { title: VALID.title });
        await settle();

        expect(state(handle).save.dirty).toBe(false);
    });

    it('creates a new collection and opens its update page', async () => {
        const handle = await mount();

        await save(handle);

        expect(api.create).toHaveBeenCalledTimes(1);
        expect(api.create.mock.calls[0][0].body).toEqual(
            state(handle).getApiData(),
        );
        expect(api.replace).toHaveBeenCalledWith(
            `/collections/${REFERENCE}/update`,
            { ignoreBlocker: true },
        );
        expect(state(handle).save).toMatchObject({
            status: 'saved',
            dirty: false,
        });
        expect(toast.success).toHaveBeenCalledWith('Колекцію створено.');
    });

    it('updates an existing collection and stays on the page', async () => {
        const handle = await mount({ ...VALID, reference: REFERENCE });

        await edit(handle, { title: 'Нова назва' });
        await save(handle);

        expect(api.update.mock.calls[0][0]).toMatchObject({
            path: { reference: REFERENCE },
            body: { title: 'Нова назва' },
        });
        expect(api.replace).not.toHaveBeenCalled();
        expect(state(handle).save).toMatchObject({
            status: 'saved',
            dirty: false,
        });
        expect(toast.success).toHaveBeenCalledWith('Колекцію оновлено.');
    });

    it('keeps edits made while an update is in flight unsaved', async () => {
        let resolve: (value: unknown) => void = () => {};
        api.update.mockImplementation(
            ({ body }) =>
                new Promise((done) => {
                    resolve = () => done(savedCollection(body));
                }),
        );
        const handle = await mount({ ...VALID, reference: REFERENCE });

        await edit(handle, { title: 'Перша правка' });
        const pending = save(handle);
        await edit(handle, { title: 'Друга правка' });
        await act(async () => resolve(undefined));
        await pending;
        await settle();

        expect(state(handle).title).toBe('Друга правка');
        expect(state(handle).save.dirty).toBe(true);
    });

    it('reports a failed save and recovers once the edit is undone', async () => {
        api.update.mockRejectedValue(new Error('offline'));
        const handle = await mount({ ...VALID, reference: REFERENCE });

        await edit(handle, { title: 'Нова назва' });
        await save(handle);

        expect(state(handle).save).toMatchObject({
            status: 'error',
            dirty: true,
        });
        expect(toast.error).toHaveBeenCalled();

        await edit(handle, { title: VALID.title });
        await settle();

        expect(state(handle).save).toMatchObject({
            status: 'saved',
            dirty: false,
        });
    });

    it('saves on Ctrl/Cmd+S only while saving is allowed', async () => {
        const handle = await mount({ ...VALID, reference: REFERENCE });
        const press = () =>
            act(async () => {
                window.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        code: 'KeyS',
                        metaKey: true,
                    }),
                );
            });

        await press();
        expect(api.update).not.toHaveBeenCalled();

        await edit(handle, { title: 'Нова назва' });
        await press();
        expect(api.update).toHaveBeenCalledTimes(1);
    });
});

describe('selectSaveDisabled', () => {
    it('allows creating a valid collection before any edit', async () => {
        const handle = await mount();
        expect(selectSaveDisabled(state(handle))).toBe(false);
    });

    it('waits for an edit before updating', async () => {
        const handle = await mount({ ...VALID, reference: REFERENCE });
        expect(selectSaveDisabled(state(handle))).toBe(true);

        await edit(handle, { nsfw: true });
        expect(selectSaveDisabled(state(handle))).toBe(false);
    });

    it('blocks a collection the backend would reject', async () => {
        const handle = await mount({ ...VALID, title: '' });
        expect(selectSaveDisabled(state(handle))).toBe(true);
    });
});

describe('describeSave', () => {
    const save = { status: 'idle', dirty: false } as const;

    it.each([
        [{ save: { ...save, status: 'saving' } }, 'Зберігаю…'],
        [{ save: { ...save, status: 'error' } }, 'Не вдалося зберегти'],
        [{ save: { ...save, dirty: true } }, 'Незбережені зміни'],
        [{ save }, 'Нова колекція'],
        [{ save, reference: REFERENCE }, 'Збережено'],
    ] as const)('%j → %s', (source, label) => {
        expect(describeSave(source).label).toBe(label);
    });
});
