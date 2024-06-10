import type { Value } from '@udecode/plate-common';

import { remarkTransformNode } from './remarkTransformNode';
import type { MdastNode, RemarkPluginOptions } from './types';

export function remarkPlugin<V extends Value>(options: RemarkPluginOptions<V>) {
    const compiler = (node: { children: MdastNode[] }) => {
        return node.children.flatMap((child) =>
            remarkTransformNode(child, options),
        );
    };

    // @ts-ignore
    this.Compiler = compiler;
}
