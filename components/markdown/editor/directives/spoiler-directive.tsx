import { ContainerDirective } from 'mdast-util-directive';
import React from 'react';

import {
    DirectiveDescriptor,
    NestedLexicalEditor,
    useNestedEditorContext,
} from '@mdxeditor/editor';

export const SpoilerDirectiveDescriptor: DirectiveDescriptor = {
    name: 'spoiler',
    attributes: [],
    hasChildren: true,
    testNode(node) {
        return node.name === 'spoiler';
    },
    Editor({ mdastNode }) {
        const {
            config: { theme },
        } = useNestedEditorContext();
        return (
            <div className="spoiler">
                <NestedLexicalEditor<ContainerDirective>
                    block
                    getContent={(node) => node.children}
                    getUpdatedMdastNode={(mdastNode, children: any) => ({
                        ...mdastNode,
                        children,
                    })}
                />
            </div>
        );
    },
};
