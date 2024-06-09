import {
    type PlateEditor,
    type Value,
    getPluginOptions,
} from '@udecode/plate-common';
import remarkDirective from 'remark-directive';
import markdown from 'remark-parse';
import { unified } from 'unified';

import {
    type RemarkPluginOptions,
    remarkPlugin,
} from '../../remark-slate/index';
import { KEY_DESERIALIZE_MD } from '../createDeserializeMdPlugin';
import type { DeserializeMdPlugin } from '../types';

/** Deserialize content from Markdown format to Slate format. `editor` needs */
export const deserializeMd = <V extends Value>(
    editor: PlateEditor<V>,
    data: string,
) => {
    const { elementRules, indentList, textRules } = getPluginOptions<
        DeserializeMdPlugin,
        V
    >(editor, KEY_DESERIALIZE_MD);

    const tree: any = unified()
        .use(markdown)
        .use(remarkDirective)
        .use(remarkPlugin, {
            editor,
            elementRules,
            indentList,
            textRules,
        } as unknown as RemarkPluginOptions<V>)
        .processSync(data);

    return tree.result;
};
