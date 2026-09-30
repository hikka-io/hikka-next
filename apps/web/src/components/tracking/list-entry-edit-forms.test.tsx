import { act, type ReactElement } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    API_LIMITS,
    ContentTypeEnum,
    type ReadResponseBase,
    type WatchResponseBase,
} from '@hikka/api';

import ReadEditForm from './read-edit-form';
import WatchEditForm from './watch-edit-form';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mocks = vi.hoisted(() => ({
    mutate: vi.fn(),
    renders: new Map<string, number>(),
}));

vi.mock('@/components/form/text-field', async (importOriginal) => {
    const actual =
        await importOriginal<typeof import('@/components/form/text-field')>();
    const { useFieldContext } = await import('@/components/form/form-context');
    const Original = actual.TextField;

    const TextField: typeof Original = (props) => {
        const { name } = useFieldContext();
        mocks.renders.set(name, (mocks.renders.get(name) ?? 0) + 1);

        return <Original {...props} />;
    };

    return { ...actual, TextField, default: TextField };
});

vi.mock('./use-tracking-mutations', () => {
    const add = () => ({ mutate: mocks.mutate, isPending: false });
    const remove = () => ({ mutate: vi.fn(), isPending: false });

    return {
        useAddWatch: add,
        useAddRead: add,
        useDeleteWatch: remove,
        useDeleteRead: remove,
    };
});

const START_DATE = 1_700_000_000;
const END_DATE = 1_710_000_000;

const WATCH = {
    status: 'watching',
    score: 7,
    episodes: 3,
    rewatches: 1,
    note: 'Нотатка',
    start_date: START_DATE,
    end_date: END_DATE,
} as unknown as WatchResponseBase;

const READ = {
    status: 'reading',
    score: 8,
    volumes: 2,
    chapters: 14,
    rereads: 1,
    note: 'Нотатка',
    start_date: START_DATE,
    end_date: END_DATE,
} as unknown as ReadResponseBase;

const NOTE_MAX = API_LIMITS.listNote.max;

const teardown: (() => void)[] = [];
const hasScrollIntoView = 'scrollIntoView' in Element.prototype;

beforeEach(() => {
    vi.stubGlobal(
        'ResizeObserver',
        class {
            observe() {}
            unobserve() {}
            disconnect() {}
        },
    );
    if (!hasScrollIntoView) Element.prototype.scrollIntoView = () => {};
});

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
    vi.clearAllMocks();
    mocks.renders.clear();
    vi.unstubAllGlobals();
    if (!hasScrollIntoView) {
        delete (Element.prototype as Partial<Element>).scrollIntoView;
    }
});

function must<T>(value: T | null | undefined, what: string): T {
    if (value == null) throw new Error(`missing ${what}`);

    return value;
}

async function mount(form: ReactElement) {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);

    await act(async () =>
        root.render(
            <QueryClientProvider client={queryClient}>
                {form}
            </QueryClientProvider>,
        ),
    );
    teardown.push(() => {
        root.unmount();
        container.remove();
    });

    const input = (id: string) =>
        must(
            container.querySelector<HTMLInputElement | HTMLTextAreaElement>(
                `#${id}`,
            ),
            id,
        );

    const type = async (id: string, value: string) => {
        const element = input(id);
        const prototype =
            element instanceof HTMLTextAreaElement
                ? HTMLTextAreaElement.prototype
                : HTMLInputElement.prototype;
        const setValue = must(
            Object.getOwnPropertyDescriptor(prototype, 'value')?.set,
            'value setter',
        );

        await act(async () => {
            element.focus();
            setValue.call(element, value);
            element.dispatchEvent(new Event('input', { bubbles: true }));
        });
    };

    const submit = async () => {
        await act(async () => {
            must(container.querySelector('form'), 'form').dispatchEvent(
                new Event('submit', { bubbles: true, cancelable: true }),
            );
        });
    };

    return { container, input, type, submit };
}

const lastBody = () =>
    (mocks.mutate.mock.calls.at(-1)?.[0] as { body: Record<string, unknown> })
        .body;

const CASES = [
    {
        name: 'watch',
        render: () => <WatchEditForm slug="anime-slug" watch={WATCH} />,
        path: { slug: 'anime-slug' },
        snapshot: WATCH as unknown as Record<string, unknown>,
        progress: ['episodes'],
        repeats: 'rewatches',
    },
    {
        name: 'read',
        render: () => (
            <ReadEditForm
                slug="manga-slug"
                content_type={ContentTypeEnum.MANGA}
                read={READ}
            />
        ),
        path: { content_type: ContentTypeEnum.MANGA, slug: 'manga-slug' },
        snapshot: READ as unknown as Record<string, unknown>,
        progress: ['volumes', 'chapters'],
        repeats: 'rereads',
    },
];

describe.each(CASES)('$name edit form', (entry) => {
    it('saves the full snapshot unchanged', async () => {
        const { submit } = await mount(entry.render());

        await submit();

        expect(mocks.mutate).toHaveBeenCalledTimes(1);
        expect(mocks.mutate.mock.calls[0][0]).toEqual({
            path: entry.path,
            body: entry.snapshot,
        });
    });

    it('saves the backend upper bounds', async () => {
        const { type, submit } = await mount(entry.render());

        for (const field of entry.progress) {
            await type(field, String(API_LIMITS.listProgress.max));
        }
        await type(entry.repeats, String(API_LIMITS.listRepeats.max));
        await type('score', String(API_LIMITS.listScore.max));
        await submit();

        expect(mocks.mutate).toHaveBeenCalledTimes(1);

        const body = lastBody();

        for (const field of entry.progress) {
            expect(Number(body[field])).toBe(API_LIMITS.listProgress.max);
        }
        expect(Number(body[entry.repeats])).toBe(API_LIMITS.listRepeats.max);
        expect(Number(body.score)).toBe(API_LIMITS.listScore.max);
        expect(body.start_date).toBe(START_DATE);
        expect(body.end_date).toBe(END_DATE);
    });

    const invalid = () => [
        ...entry.progress.flatMap((field) => [
            [field, String(API_LIMITS.listProgress.max + 1)],
            [field, '2.5'],
            [field, '-1'],
        ]),
        [entry.repeats, String(API_LIMITS.listRepeats.max + 1)],
        [entry.repeats, '1.5'],
        [entry.repeats, '-1'],
        ['score', String(API_LIMITS.listScore.max + 1)],
        ['score', '7.5'],
    ];

    it.each(
        invalid(),
    )('shows a field error instead of saving %s = %s', async (field, value) => {
        const { type, submit, input } = await mount(entry.render());

        await type(field, value);
        await submit();

        expect(mocks.mutate).not.toHaveBeenCalled();
        expect(input(field).getAttribute('aria-invalid')).toBe('true');
    });

    it('caps the note at the backend limit', async () => {
        const { input } = await mount(entry.render());

        expect((input('note') as HTMLTextAreaElement).maxLength).toBe(NOTE_MAX);
    });

    it('does not save a note over the backend limit', async () => {
        const { type, submit, input } = await mount(entry.render());

        await type('note', 'x'.repeat(NOTE_MAX + 1));
        await submit();

        expect(mocks.mutate).not.toHaveBeenCalled();
        expect(input('note').getAttribute('aria-invalid')).toBe('true');
    });

    it('saves a note at the backend limit', async () => {
        const { type, submit } = await mount(entry.render());

        await type('note', 'x'.repeat(NOTE_MAX));
        await submit();

        expect(mocks.mutate).toHaveBeenCalledTimes(1);
        expect(lastBody().note).toBe('x'.repeat(NOTE_MAX));
    });

    it('re-renders only the note field while typing a note', async () => {
        const { type, container } = await mount(entry.render());
        const others = [...entry.progress, entry.repeats, 'score'];
        const before = others.map((field) => mocks.renders.get(field));

        expect(before.every((count) => count !== undefined)).toBe(true);

        for (const length of [NOTE_MAX - 150, NOTE_MAX - 100, NOTE_MAX]) {
            await type('note', 'x'.repeat(length));
        }

        expect(others.map((field) => mocks.renders.get(field))).toEqual(before);
        expect(container.textContent).toContain(`${NOTE_MAX}/${NOTE_MAX}`);
    });

    it('counts the note near the limit like the user note', async () => {
        const { type, container } = await mount(entry.render());
        const threshold = NOTE_MAX - 200;

        await type('note', 'x'.repeat(threshold - 1));
        expect(container.textContent).not.toContain(
            `${threshold - 1}/${NOTE_MAX}`,
        );

        await type('note', 'x'.repeat(threshold));
        expect(container.textContent).toContain(`${threshold}/${NOTE_MAX}`);
    });
});
