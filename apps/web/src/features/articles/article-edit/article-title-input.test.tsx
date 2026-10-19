import { act, useEffect } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { BlockSelectionPlugin } from '@platejs/selection/react';
import type { TElement, Value } from 'platejs';
import { createPlateEditor } from 'platejs/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ArticleKit } from '@/components/plate/editor/article-kit';

import ArticleProvider, { useArticleStoreApi } from './article-provider';
import ArticleTitleInput from './article-title-input';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const makeEditor = () =>
    createPlateEditor({
        plugins: ArticleKit,
        nodeId: true,
        value: [{ type: 'p', children: [{ text: 'Текст' }] }] as Value,
    });

type Editor = ReturnType<typeof makeEditor>;

const ReportEditor = ({ editor }: { editor: Editor }) => {
    const store = useArticleStoreApi();

    useEffect(() => {
        store.getState().setEditorDocument(editor.children, editor);
    }, [store, editor]);

    return null;
};

let root: Root | undefined;

afterEach(() => {
    act(() => root?.unmount());
    root = undefined;
    document.body.innerHTML = '';
});

const renderTitle = (editor: Editor) => {
    const container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);

    act(() =>
        root?.render(
            <ArticleProvider>
                <ReportEditor editor={editor} />
                <ArticleTitleInput />
            </ArticleProvider>,
        ),
    );

    return container.querySelector('textarea') as HTMLTextAreaElement;
};

describe('ArticleTitleInput', () => {
    it('lets go of selected blocks when it takes focus', () => {
        const editor = makeEditor();
        editor
            .getApi(BlockSelectionPlugin)
            .blockSelection.set((editor.children[0] as TElement).id as string);
        const title = renderTitle(editor);

        act(() => title.focus());

        expect(
            editor.getOption(BlockSelectionPlugin, 'selectedIds')?.size,
        ).toBe(0);
    });

    it('moves focus to the start of the body on Tab', () => {
        const editor = makeEditor();
        const focus = vi.spyOn(editor.tf, 'focus').mockImplementation(() => {});
        const title = renderTitle(editor);

        const event = new KeyboardEvent('keydown', {
            key: 'Tab',
            bubbles: true,
            cancelable: true,
        });
        act(() => {
            title.dispatchEvent(event);
        });

        expect(event.defaultPrevented).toBe(true);
        expect(focus).toHaveBeenCalledWith({ edge: 'start' });
    });
});
