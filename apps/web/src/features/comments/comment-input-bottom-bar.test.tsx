import { act, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import { MarkdownPlugin } from '@platejs/markdown';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Value } from 'platejs';
import { createPlateEditor, Plate, PlateSlate } from 'platejs/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    API_LIMITS,
    type CommentContentTypeEnum,
    type CommentResponse,
} from '@hikka/api';

import { MarkdownEditorKit } from '@/components/plate/editor/markdown-editor-kit';
import { getCommentText } from '@/components/plate/editor/value/submit-value';
import { DEBOUNCE_MS } from '@/services/hooks/use-debounce';

import CommentInputBottomBar from './comment-input-bottom-bar';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type Sent = { body: { text: string } };

const mocks = vi.hoisted(() => ({
    write: vi.fn(async (_request: unknown) => ({})),
    edit: vi.fn(async (_request: unknown) => ({})),
}));

vi.mock('@hikka/api', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hikka/api')>()),
    writeCommentMutation: () => ({ mutationFn: mocks.write }),
    editCommentMutation: () => ({ mutationFn: mocks.edit }),
}));

vi.mock('@/components/plate/ui/fixed-toolbar', () => ({
    FixedToolbar: ({ children }: { children?: ReactNode }) => (
        <div>{children}</div>
    ),
}));

vi.mock('@/components/plate/ui/fixed-toolbar-buttons', () => ({
    FixedMarkdownToolbarButtons: () => null,
}));

vi.mock('@/utils/api/invalidate-content-state', () => ({
    invalidateComments: vi.fn(),
}));

vi.mock('./comments-provider', () => ({
    useCommentsContext: () => ({
        clearActive: vi.fn(),
        addPendingReply: vi.fn(),
        updatePendingReply: vi.fn(),
    }),
}));

const MAX = API_LIMITS.commentText.max;

const paragraph = (text: string, marks: Record<string, boolean> = {}) =>
    [{ type: 'p', children: [{ text, ...marks }] }] as Value;

const serialize = (value: Value) =>
    getCommentText(createPlateEditor({ plugins: MarkdownEditorKit, value }));

const OVERHEAD = serialize(paragraph('a')).length - 1;

const withLength = (length: number) => paragraph('a'.repeat(length - OVERHEAD));

const DEEP_COMMENT = {
    reference: 'deep-reference',
    parent: 'parent-reference',
    depth: 5,
    author: { username: 'olexh' },
} as unknown as CommentResponse;

const MENTION = '@olexh ';

const EMOJI = '\u{1F600}';

const teardown: (() => void)[] = [];

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
    vi.clearAllMocks();
});

function must<T>(value: T | null | undefined, what: string): T {
    if (value == null) throw new Error(`missing ${what}`);

    return value;
}

async function mount(
    value: Value,
    props: { comment?: CommentResponse; isEdit?: boolean } = {},
) {
    const editor = createPlateEditor({ plugins: MarkdownEditorKit, value });
    const queryClient = new QueryClient();
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);

    await act(async () =>
        root.render(
            <QueryClientProvider client={queryClient}>
                <Plate editor={editor}>
                    <PlateSlate>
                        <CommentInputBottomBar
                            slug="some-slug"
                            content_type={'anime' as CommentContentTypeEnum}
                            {...props}
                        />
                    </PlateSlate>
                </Plate>
            </QueryClientProvider>,
        ),
    );
    teardown.push(() => {
        root.unmount();
        container.remove();
    });

    const send = () =>
        must(
            container.querySelector<HTMLButtonElement>('button[type="submit"]'),
            'send button',
        );
    const counter = () =>
        [...container.querySelectorAll('span')].find((span) =>
            span.textContent?.endsWith(`/${MAX}`),
        );
    const click = async () => {
        await act(async () => send().click());
    };

    return { editor, send, counter, click };
}

const sentText = (mutation: typeof mocks.write) =>
    (mutation.mock.calls.at(-1)?.[0] as Sent).body.text;

describe('comment length limit', () => {
    it('measures what the backend receives', () => {
        expect(serialize(withLength(MAX))).toHaveLength(MAX);
    });

    it('sends a comment at the backend limit', async () => {
        const { send, counter, click } = await mount(withLength(MAX));

        expect(send().disabled).toBe(false);
        expect(counter()?.textContent).toBe(`${MAX}/${MAX}`);

        await click();

        await vi.waitFor(() => expect(mocks.write).toHaveBeenCalledTimes(1));
        expect(sentText(mocks.write)).toHaveLength(MAX);
    });

    it('blocks a comment over the backend limit', async () => {
        const { send, counter, click } = await mount(withLength(MAX + 1));

        expect(send().disabled).toBe(true);
        expect(counter()?.textContent).toBe(`${MAX + 1}/${MAX}`);
        expect(counter()?.className).toContain('text-destructive');

        await click();

        expect(mocks.write).not.toHaveBeenCalled();
    });

    it('counts the markdown markup, not the plain text', async () => {
        const text = 'a'.repeat(MAX - OVERHEAD - 2);
        const value = paragraph(text, { bold: true });

        expect(text.length).toBeLessThan(MAX);
        expect(serialize(value).length).toBeGreaterThan(MAX);

        const { send } = await mount(value);

        expect(send().disabled).toBe(true);
    });

    it('counts the mention added to a reply past the depth limit', async () => {
        const over = await mount(withLength(MAX - MENTION.length + 1), {
            comment: DEEP_COMMENT,
        });

        expect(over.send().disabled).toBe(true);

        const fits = await mount(withLength(MAX - MENTION.length), {
            comment: DEEP_COMMENT,
        });

        expect(fits.send().disabled).toBe(false);

        await fits.click();

        await vi.waitFor(() => expect(mocks.write).toHaveBeenCalledTimes(1));
        expect(sentText(mocks.write)).toHaveLength(MAX);
        expect(sentText(mocks.write).startsWith(MENTION)).toBe(true);
    });

    it('does not count the mention when editing', async () => {
        const { send, click } = await mount(withLength(MAX), {
            comment: DEEP_COMMENT,
            isEdit: true,
        });

        expect(send().disabled).toBe(false);

        await click();

        await vi.waitFor(() => expect(mocks.edit).toHaveBeenCalledTimes(1));
        expect(sentText(mocks.edit)).toHaveLength(MAX);
    });

    it('hides the counter for a short comment', async () => {
        const { send, counter } = await mount(paragraph('Привіт'));

        expect(send().disabled).toBe(false);
        expect(counter()).toBeUndefined();
    });

    it.each([
        ['an empty paragraph', ''],
        ['a lone zero-width space', '\u200B'],
    ])('keeps send disabled for %s', async (_, text) => {
        const { send, counter, click } = await mount(paragraph(text));

        expect(send().disabled).toBe(true);
        expect(counter()).toBeUndefined();

        await click();

        expect(mocks.write).not.toHaveBeenCalled();
    });

    it('counts an emoji as one character like the backend', async () => {
        const fits = await mount(paragraph(EMOJI.repeat(MAX - OVERHEAD)));

        expect(fits.send().disabled).toBe(false);
        expect(fits.counter()?.textContent).toBe(`${MAX}/${MAX}`);

        await fits.click();

        await vi.waitFor(() => expect(mocks.write).toHaveBeenCalledTimes(1));
        expect(Array.from(sentText(mocks.write))).toHaveLength(MAX);

        const over = await mount(paragraph(EMOJI.repeat(MAX - OVERHEAD + 1)));

        expect(over.send().disabled).toBe(true);
        expect(over.counter()?.textContent).toBe(`${MAX + 1}/${MAX}`);
    });
});

describe('comment length counter', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    const wait = async (ms: number) => {
        await act(async () => vi.advanceTimersByTime(ms));
    };

    const edit = async (change: () => void) => {
        await act(async () => change());
    };

    it('does not serialize the comment when only the caret moves', async () => {
        const { editor, counter } = await mount(withLength(MAX - 10));
        const serialize = vi.spyOn(
            editor.getApi(MarkdownPlugin).markdown,
            'serialize',
        );

        for (const offset of [0, 5, 20, 3]) {
            await edit(() => editor.tf.select({ path: [0, 0], offset }));
        }
        await wait(DEBOUNCE_MS.input);

        expect(serialize).not.toHaveBeenCalled();
        expect(counter()?.textContent).toBe(`${MAX - 10}/${MAX}`);
    });

    it('serializes once per typing pause, not per keystroke', async () => {
        const { editor, counter } = await mount(withLength(MAX - 10));
        const serialize = vi.spyOn(
            editor.getApi(MarkdownPlugin).markdown,
            'serialize',
        );

        await edit(() => editor.tf.select(editor.api.end([])));
        for (const char of 'abcde') {
            await edit(() => editor.tf.insertText(char));
            await wait(DEBOUNCE_MS.input - 1);
        }

        expect(serialize).not.toHaveBeenCalled();
        expect(counter()?.textContent).toBe(`${MAX - 10}/${MAX}`);

        await wait(1);

        expect(serialize).toHaveBeenCalledTimes(1);
        expect(counter()?.textContent).toBe(`${MAX - 5}/${MAX}`);
    });

    it('blocks an over-limit send before the counter catches up', async () => {
        const { editor, send, counter, click } = await mount(withLength(MAX));

        await edit(() => {
            editor.tf.select(editor.api.end([]));
            editor.tf.insertText('b');
        });

        expect(send().disabled).toBe(false);
        expect(counter()?.textContent).toBe(`${MAX}/${MAX}`);

        await click();

        expect(mocks.write).not.toHaveBeenCalled();

        await wait(DEBOUNCE_MS.input);

        expect(send().disabled).toBe(true);
        expect(counter()?.textContent).toBe(`${MAX + 1}/${MAX}`);
    });
});
