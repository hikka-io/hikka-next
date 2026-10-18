import { PlusIcon } from 'lucide-react';
import { KEYS, NodeApi, type TElement } from 'platejs';
import {
    type PlateEditor,
    type PlateElementProps,
    useFocused,
    useSelected,
} from 'platejs/react';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

import { SLASH_INPUT_KEY } from '../editor/plugins/trigger-keys';

const isActivationKey = (key: string) => key === 'Enter' || key === ' ';

const isEmptyBlock = (element: TElement) =>
    element.children.length === 1 && NodeApi.string(element) === '';

function openInsertMenu(editor: PlateEditor, element: TElement) {
    const path = editor.api.findPath(element);
    if (!path) return;

    editor.tf.select(editor.api.start(path));
    editor.tf.focus();
    editor.tf.insertNodes(
        {
            type: SLASH_INPUT_KEY,
            trigger: '/',
            fromGutter: true,
            children: [{ text: '' }],
        },
        { select: true },
    );
}

function Gutter({
    editor,
    element,
}: Pick<PlateElementProps, 'editor' | 'element'>) {
    const selected = useSelected();
    const focused = useFocused();

    if (!isEmptyBlock(element)) return null;

    return (
        <span
            contentEditable={false}
            className={cn(
                // The left gutter only fits once the centered column leaves 40px to the viewport edge.
                'absolute top-1/2 right-0 -translate-y-1/2 select-none in-[.slate-p:hover]:opacity-100 opacity-0 transition-opacity focus-within:opacity-100 min-[76rem]:right-auto min-[76rem]:-left-10',
                selected && focused && 'opacity-100',
            )}
        >
            <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Вставити блок"
                className="text-muted-foreground"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => openInsertMenu(editor, element)}
                // Inside the editable, the editor takes Enter and Space on keydown; open on release
                // so the rest of the press does not reach the menu's freshly focused input.
                onKeyDown={(event) => {
                    if (isActivationKey(event.key)) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }}
                onKeyUp={(event) => {
                    if (isActivationKey(event.key)) {
                        openInsertMenu(editor, element);
                    }
                }}
            >
                <PlusIcon />
            </Button>
        </span>
    );
}

/** Rendered inside every element, so showing it never changes the element tree (which would drop the caret). */
export function BlockInsertButton({
    editor,
    element,
    path,
}: PlateElementProps) {
    if (path.length !== 1 || element.type !== KEYS.p) return null;

    return <Gutter editor={editor} element={element} />;
}
