import { deserializeMd as _deserializeMd } from '@udecode/plate-markdown';
import remarkDirective from 'remark-directive';
import emoji from 'remark-emoji';

export function deserializeMd({
    editor,
    data,
    options,
}: (typeof _deserializeMd)['arguments']) {
    return _deserializeMd(editor, data, {
        ...options,
        processor(processor) {
            return processor.use(emoji).use(remarkDirective) as any;
        },
    });
}
