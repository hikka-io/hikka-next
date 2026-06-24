import {
    convertChildrenDeserialize,
    convertNodesSerialize,
    type DeserializeMdOptions,
    MarkdownPlugin,
    type SerializeMdOptions,
} from '@platejs/markdown';
import type { ContainerDirective } from 'mdast-util-directive';
import { KEYS, type TElement } from 'platejs';
import remarkDirective from 'remark-directive';

import { ELEMENT_SPOILER } from './spoiler-kit';

// Configuration for different container directive types (:::name blocks)
interface DirectiveConfig {
    deserialize: (
        mdastNode: ContainerDirective,
        deco: Parameters<typeof convertChildrenDeserialize>[1],
        options: DeserializeMdOptions,
    ) => TElement;
    serialize: (
        plateNode: TElement,
        options: SerializeMdOptions,
    ) => ContainerDirective;
}

const directiveConfigs: Record<string, DirectiveConfig> = {
    [ELEMENT_SPOILER]: {
        deserialize: (mdastNode, deco, options) => ({
            type: ELEMENT_SPOILER,
            children: convertChildrenDeserialize(
                mdastNode.children,
                deco,
                options,
            ),
        }),
        serialize: (plateNode, options) => ({
            type: 'containerDirective',
            name: ELEMENT_SPOILER,
            children: convertNodesSerialize(
                plateNode.children,
                options,
            ) as ContainerDirective['children'],
        }),
    },
    // Add more directive types here as needed (e.g. callout)
};

export const MarkdownKit = [
    MarkdownPlugin.configure({
        options: {
            disallowedNodes: [KEYS.suggestion, KEYS.codeBlock, KEYS.code],
            remarkPlugins: [remarkDirective],
            // Keep [text](url) form for links whose text equals the URL —
            // the read-side renderer (MDViewer, no GFM) cannot autolink
            // bare URLs, so v53's default bare-autolink output would
            // produce dead links in comments.
            remarkStringifyOptions: { resourceLink: true },

            rules: {
                // Markdown -> Plate: one entry point for all container directives
                containerDirective: {
                    deserialize: (mdastNode, deco, options) =>
                        directiveConfigs[mdastNode.name]?.deserialize(
                            mdastNode,
                            deco,
                            options,
                        ),
                },
                // Plate -> Markdown: one rule per registered directive type
                ...Object.fromEntries(
                    Object.entries(directiveConfigs).map(([name, config]) => [
                        name,
                        { serialize: config.serialize },
                    ]),
                ),
            },
        },
    }),
];
