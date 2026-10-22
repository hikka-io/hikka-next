import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { toast } from 'sonner';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import CollectionProvider, { useCollectionStore } from '../collection-provider';
import type { CollectionState, Group, Item } from '../collection-store';
import CollectionEditGroups from './collection-groups';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const search = vi.hoisted(() => ({
    open: false,
    pick: (_content: unknown) => {},
}));

vi.mock('@/features/search', () => ({
    SearchModal: (props: {
        open: boolean;
        onClick: (content: unknown) => void;
    }) => {
        search.open = props.open;
        search.pick = props.onClick;
        return null;
    },
}));

vi.mock('@/services/session', () => ({
    useTitle: (content?: { slug: string }) => content?.slug,
}));

vi.mock('sonner', () => ({ toast: { info: vi.fn() } }));
vi.mock('@/services/hooks/use-back-close', () => ({
    useBackClose: () => {},
    hasOpenBackCloseModal: () => false,
}));

const item = (slug: string, comment?: string): Item => ({
    id: slug,
    content: { slug } as Item['content'],
    comment,
});

const group = (id: string, title: string | null, items: Item[]): Group => ({
    id,
    title,
    items,
});

type Store = ReturnType<typeof useCollectionStore>;

const StoreProbe = ({ onStore }: { onStore: (store: Store) => void }) => {
    onStore(useCollectionStore());
    return null;
};

const teardown: (() => void)[] = [];

beforeEach(() => {
    vi.stubGlobal('matchMedia', () => ({
        matches: true,
        addEventListener: () => {},
        removeEventListener: () => {},
    }));
});

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
    vi.clearAllMocks();
});

async function render(groups: Group[]) {
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);
    teardown.push(() => root.unmount());
    let store = {} as Store;

    await act(async () => {
        root.render(
            <CollectionProvider
                initialState={{ groups } as Partial<CollectionState>}
            >
                <StoreProbe onStore={(next) => (store = next)} />
                <CollectionEditGroups />
            </CollectionProvider>,
        );
    });

    return { container, store: () => store.getState() };
}

const byLabel = <T extends HTMLElement>(label: string) => [
    ...document.querySelectorAll<T>(`[aria-label="${label}"]`),
];

const byText = (text: string) =>
    [...document.querySelectorAll<HTMLElement>('button')].find(
        (element) => element.textContent?.trim() === text,
    );

const type = (element: HTMLInputElement | HTMLTextAreaElement, value: string) =>
    act(async () => {
        const setter = Object.getOwnPropertyDescriptor(
            Object.getPrototypeOf(element),
            'value',
        )?.set;
        setter?.call(element, value);
        element.dispatchEvent(new Event('input', { bubbles: true }));
    });

const click = (element?: HTMLElement) =>
    act(async () => {
        element?.click();
    });

const slugs = (groups: Group[]) =>
    groups.map((entry) => entry.items.map((i) => i.id));

describe('CollectionEditGroups', () => {
    it('names groups only once the collection is split into them', async () => {
        const { container, store } = await render([
            group('a', null, [item('x'), item('y')]),
        ]);

        expect(byLabel('Назва групи')).toHaveLength(0);
        expect(container.textContent).toContain('Додати тайтл');

        await click(byText('Додати групу'));

        expect(byLabel('Назва групи')).toHaveLength(1);
        expect(store().groups[0].title).toBe('');
        expect(container.textContent).toContain('Вкажіть назву групи');
    });

    it('edits a group name in place and flags a repeated one', async () => {
        const { container, store } = await render([
            group('a', 'Класика', [item('x')]),
            group('b', 'Хіти', [item('y')]),
        ]);
        const [, second] = byLabel<HTMLInputElement>('Назва групи');

        await type(second, 'Класика');

        expect(store().groups[1].title).toBe('Класика');
        expect(container.textContent).toContain('Група з такою назвою вже є');
    });

    it('shows an empty group as one target that hints at dragging', async () => {
        const { container } = await render([
            group('a', 'Класика', [item('x')]),
            group('b', 'Нова', []),
        ]);

        expect(container.textContent).toContain(
            'або перетягніть сюди з інших груп',
        );
    });

    it('adds through one search to the group that opened it', async () => {
        const { store } = await render([
            group('a', 'Класика', [item('x')]),
            group('b', 'Нова', []),
        ]);
        const [, emptyGroup] = [...document.querySelectorAll('button')].filter(
            (element) => element.textContent?.includes('Додати тайтл'),
        );

        await click(emptyGroup);
        expect(search.open).toBe(true);

        await act(async () => search.pick({ slug: 'z' }));
        expect(slugs(store().groups)).toEqual([['x'], ['z']]);

        await act(async () => search.pick({ slug: 'x' }));
        expect(toast.info).toHaveBeenCalledWith('Цей тайтл уже є в колекції');
    });

    it('removes a title from its card', async () => {
        const { store } = await render([
            group('a', null, [item('x'), item('y')]),
        ]);

        await click(byLabel('Прибрати з колекції')[0]);

        expect(slugs(store().groups)).toEqual([['y']]);
    });

    it('edits a title comment from its card and warns when it is too short', async () => {
        const { store } = await render([
            group('a', 'Класика', [item('x')]),
            group('b', 'Хіти', [item('y')]),
        ]);

        await click(byLabel('Коментар і група')[0]);
        const comment = document.querySelector('textarea');
        if (!comment) throw new Error('the title editor did not open');

        await type(comment, 'ок');
        expect(store().groups[0].items[0].comment).toBe('ок');
        expect(document.body.textContent).toContain('Щонайменше 3 символи');

        await type(comment, 'Ідеальний старт');
        expect(document.body.textContent).not.toContain('Щонайменше');
        expect(document.body.textContent).toContain('Група');

        await click(byText('Прибрати'));
        expect(slugs(store().groups)).toEqual([[], ['y']]);
        expect(store().editingItemId).toBeUndefined();
    });
});
