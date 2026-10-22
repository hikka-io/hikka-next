import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { afterEach, describe, expect, it, vi } from 'vitest';

import CollectionProvider, { useCollectionStore } from '../collection-provider';
import type { CollectionState, Item } from '../collection-store';
import PublishCard from './publish-card';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/utils/navigation', () => ({
    Link: ({ to, ...props }: { to: string }) => <a href={to} {...props} />,
}));

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

type Store = ReturnType<typeof useCollectionStore>;

const StoreProbe = ({ onStore }: { onStore: (store: Store) => void }) => {
    onStore(useCollectionStore());
    return null;
};

const teardown: (() => void)[] = [];

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
    document.body.innerHTML = '';
});

async function render(initialState: Partial<CollectionState>) {
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);
    teardown.push(() => root.unmount());
    const save = vi.fn();
    let store = {} as Store;

    await act(async () => {
        root.render(
            <CollectionProvider initialState={initialState}>
                <StoreProbe onStore={(next) => (store = next)} />
                <PublishCard save={{ save }} />
            </CollectionProvider>,
        );
    });

    const button = (name: string) =>
        [...container.querySelectorAll<HTMLButtonElement>('button')].find(
            (element) => element.textContent?.trim() === name,
        );
    const radio = (name: string) =>
        [...container.querySelectorAll<HTMLElement>('label')]
            .find((label) => label.textContent?.includes(name))
            ?.querySelector<HTMLElement>('[role="radio"]');

    return { container, save, store: () => store, button, radio };
}

const typeTrigger = (container: HTMLElement) => {
    const labelId = [...container.querySelectorAll('label')].find(
        (element) => element.textContent === 'Тип',
    )?.id;

    return container.querySelector<HTMLElement>(
        `[aria-labelledby="${labelId}"]`,
    );
};

describe('PublishCard', () => {
    it('lets a new, empty collection pick its content type from a list', async () => {
        const { container, store } = await render({
            ...VALID,
            groups: [{ id: 'default', title: null, items: [] }],
        });
        const trigger = typeTrigger(container);

        expect(trigger?.textContent).toBe('Аніме');

        await act(async () => trigger?.click());
        const options = [
            ...document.querySelectorAll<HTMLElement>('[cmdk-item]'),
        ];
        expect(options.map((option) => option.textContent)).toEqual([
            'Аніме',
            'Манґа',
            'Ранобе',
            'Персонаж',
            'Людина',
        ]);

        await act(async () =>
            options.find((option) => option.textContent === 'Ранобе')?.click(),
        );
        expect(store().getState().content_type).toBe('novel');
        expect(typeTrigger(container)?.textContent).toBe('Ранобе');
    });

    it.each([
        ['once titles are added', VALID, 'Приберіть тайтли, щоб змінити тип'],
        [
            'once the collection exists',
            { ...VALID, reference: REFERENCE },
            'Не змінюється після створення',
        ],
    ])('locks the content type %s', async (_, state, hint) => {
        const { container } = await render(state);

        expect(container.textContent).toContain(hint);
        expect(typeTrigger(container)).toBeNull();
    });

    it('offers visibility from the widest to the narrowest', async () => {
        const { container, store, radio } = await render(VALID);

        expect(container.textContent).toContain(
            'Видно всім, є в каталозі колекцій',
        );

        await act(async () => radio('Лише у профілі')?.click());
        expect(store().getState().visibility).toBe('unlisted');
    });

    it('toggles the spoiler and 18+ flags', async () => {
        const { container, store } = await render(VALID);
        const [spoiler, nsfw] =
            container.querySelectorAll<HTMLElement>('[role="switch"]');

        await act(async () => spoiler.click());
        await act(async () => nsfw.click());

        expect(store().getState()).toMatchObject({ spoiler: true, nsfw: true });
    });

    it('creates a valid new collection on request', async () => {
        const { button, save } = await render(VALID);

        expect(button('Створити')?.disabled).toBe(false);

        await act(async () => button('Створити')?.click());
        expect(save).toHaveBeenCalledTimes(1);
    });

    it('waits for an edit before updating an existing collection', async () => {
        const { button, store } = await render({
            ...VALID,
            reference: REFERENCE,
        });

        expect(button('Оновити')?.disabled).toBe(true);

        await act(async () => store().getState().setSaveState({ dirty: true }));
        expect(button('Оновити')?.disabled).toBe(false);
    });

    it('links the preview to the saved collection only', async () => {
        const created = await render({ ...VALID, reference: REFERENCE });
        expect(
            created.container.querySelector('a[aria-label="Переглянути"]'),
        ).toHaveProperty('href', expect.stringContaining(REFERENCE));

        const fresh = await render(VALID);
        expect(
            fresh.container.querySelector<HTMLButtonElement>(
                'button[aria-label="Переглянути"]',
            )?.disabled,
        ).toBe(true);
    });
});
