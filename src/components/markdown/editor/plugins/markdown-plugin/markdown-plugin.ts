import {
    MdastElementType,
    MarkdownPlugin as _MarkdownPlugin,
    remarkDefaultElementRules,
    remarkTransformNode,
} from '@udecode/plate-markdown';

const defaultDirectives = ['spoiler'];

export const MarkdownPlugin = _MarkdownPlugin.configure({
    options: {
        elementRules: {
            ...remarkDefaultElementRules,
            ['containerDirective' as MdastElementType]: {
                transform: (node: any, options: any) => {
                    return {
                        children: node.children!.flatMap((paragraph: any) => {
                            return remarkTransformNode(paragraph, options);
                        }),
                        type: defaultDirectives.includes(node.name!)
                            ? node.name!
                            : 'paragraph',
                    };
                },
            },
        },
    },
});
