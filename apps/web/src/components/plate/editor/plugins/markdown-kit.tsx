import {
    DeserializeMdOptions,
    MarkdownPlugin,
    SerializeMdOptions,
    convertChildrenDeserialize,
    convertNodesSerialize,
} from '@platejs/markdown';
import { KEYS } from 'platejs';
import remarkDirective from 'remark-directive';

import { ELEMENT_SPOILER } from './spoiler-kit';

// Configuration for different container directive types
interface DirectiveConfig {
    deserialize: (
        mdastNode: any,
        deco: any,
        options: DeserializeMdOptions,
    ) => any;
    serialize: (plateNode: any, options: SerializeMdOptions) => any;
}

const directiveConfigs: Record<string, DirectiveConfig> = {
    spoiler: {
        deserialize: (
            mdastNode: any,
            deco: any,
            options: DeserializeMdOptions,
        ) => ({
            type: ELEMENT_SPOILER,
            children: convertChildrenDeserialize(
                mdastNode.children,
                deco,
                options,
            ),
        }),
        serialize: (plateNode: any, options: SerializeMdOptions) => {
            return {
                type: 'containerDirective',
                name: ELEMENT_SPOILER,
                children: convertNodesSerialize(plateNode.children, options),
            };
        },
    },
    // Add more directive types here as needed
    // Example for future expansion:
    // callout: {
    //     deserialize: (mdastNode: any) => ({
    //         type: 'callout',
    //         children: convertMdastChildren(mdastNode.children),
    //     }),
    //     serialize: (plateNode: any) => `:::callout\n${plateNode.children}\n:::\n`,
    // },
};

// General container directive deserialize function
const deserializeContainerDirective = (
    mdastNode: any,
    deco: any,
    options: DeserializeMdOptions,
) => {
    const config = directiveConfigs[mdastNode.name];

    if (!config) {
        // Return undefined for non-defined directives to let other handlers process them
        return undefined;
    }

    return config.deserialize(mdastNode, deco, options);
};

// General container directive serialize function
const serializeContainerDirective = (
    plateNode: any,
    options: SerializeMdOptions,
) => {
    const config = directiveConfigs[plateNode.type];

    if (!config) {
        console.warn(
            `No serialize config found for directive type: ${plateNode.type}`,
        );
        return '';
    }

    return config.serialize(plateNode, options);
};

// Custom paragraph serializer that removes first and empty paragraphs
const serializeParagraph = (plateNode: any, options: SerializeMdOptions) => {
    // Check if this is an empty paragraph (only contains empty text)
    const isEmpty =
        plateNode.children?.length === 1 && plateNode.children[0].text === '';

    // Skip serialization for empty paragraphs by returning undefined
    if (isEmpty) {
        return undefined;
    }

    // Get the value array from options to check if this is the first paragraph
    const value = options.value || [];
    const isFirstParagraph = value.length > 0 && value[0] === plateNode;

    // Skip serialization for the first paragraph by returning undefined
    if (isFirstParagraph) {
        return undefined;
    }

    // Default paragraph serialization - return mdast paragraph node
    return {
        type: 'paragraph',
        children: convertNodesSerialize(plateNode.children, options),
    } as any;
};

export const MarkdownKit = [
    MarkdownPlugin.configure({
        options: {
            disallowedNodes: [KEYS.suggestion],
            remarkPlugins: [remarkDirective],

            rules: {
                // Rule for handling containerDirective - this matches mdast node type
                containerDirective: {
                    deserialize: deserializeContainerDirective,
                },
                // Rule for serializing spoiler elements back to markdown
                [ELEMENT_SPOILER]: {
                    serialize: serializeContainerDirective,
                },
                // Custom paragraph serializer that removes first and empty paragraphs
                /* [KEYS.p]: {
                    serialize: serializeParagraph,
                }, */
            },
        },
    }),
];
