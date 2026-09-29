import { act, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Value } from 'platejs';
import { createPlateEditor, Plate } from 'platejs/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    API_LIMITS,
    type CommentResponse,
    type CommentContentTypeEnum as CommentsContentType,
} from '@hikka/api';

import { MarkdownEditorKit } from '@/components/plate/editor/markdown-editor-kit';
import { getCommentText } from '@/components/plate/editor/value/submit-value';

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
                    <CommentInputBottomBar
                        slug="some-slug"
                        content_type={'anime' as CommentsContentType}
                        {...props}
                    />
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

    return { send, counter, click };
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
});
