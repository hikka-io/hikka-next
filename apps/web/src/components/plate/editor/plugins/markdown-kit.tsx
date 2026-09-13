import {
    convertChildrenDeserialize,
    convertNodesSerialize,
    type DeserializeMdOptions,
    defaultRules,
    MarkdownPlugin,
    type MdRules,
    remarkMention,
    type SerializeMdOptions,
} from '@platejs/markdown';
import type {
    ContainerDirective,
    LeafDirective,
    TextDirective,
} from 'mdast-util-directive';
import { KEYS, type TElement } from 'platejs';
import remarkDirective from 'remark-directive';

import { isMentionLabel, isUserUrl, userMentionUrl } from '@/utils/mentions';

import { ELEMENT_SPOILER, ELEMENT_SPOILER_INLINE } from './spoiler-kit';

type DirectiveNode = ContainerDirective | TextDirective | LeafDirective;

// Per directive type: `:::name` blocks and `:name[text]` inlines
type DirectiveConfig = {
    name: string;
    kind: 'container' | 'text';
    deserialize: (
        mdastNode: DirectiveNode,
        deco: Parameters<typeof convertChildrenDeserialize>[1],
        options: DeserializeMdOptions,
    ) => TElement;
    serialize: (
        plateNode: TElement,
        options: SerializeMdOptions,
    ) => DirectiveNode;
};

const directiveConfigs: Record<string, DirectiveConfig> = {
    [ELEMENT_SPOILER]: {
        name: 'spoiler',
        kind: 'container',
        deserialize: (mdastNode, deco, options) => ({
            type: ELEMENT_SPOILER,
            children: convertChildrenDeserialize(
                mdastNode.children as ContainerDirective['children'],
                deco,
                options,
            ),
        }),
        serialize: (plateNode, options) => ({
            type: 'containerDirective',
            name: 'spoiler',
            children: convertNodesSerialize(
                plateNode.children,
                options,
            ) as ContainerDirective['children'],
        }),
    },
    [ELEMENT_SPOILER_INLINE]: {
        name: 'spoiler',
        kind: 'text',
        deserialize: (mdastNode, deco, options) => ({
            type: ELEMENT_SPOILER_INLINE,
            children: convertChildrenDeserialize(
                mdastNode.children as TextDirective['children'],
                deco,
                options,
            ),
        }),
        serialize: (plateNode, options) => ({
            type: 'textDirective',
            name: 'spoiler',
            children: convertNodesSerialize(
                plateNode.children,
                options,
            ) as TextDirective['children'],
        }),
    },
    // Add more directive types here as needed (e.g. callout)
};

const configFor = (name: string, kind: DirectiveConfig['kind']) =>
    Object.values(directiveConfigs).find(
        (config) => config.name === name && config.kind === kind,
    );

const deserializeTextDirective = (
    mdastNode: TextDirective | LeafDirective,
    deco: Parameters<typeof convertChildrenDeserialize>[1],
    options: DeserializeMdOptions,
) => {
    const mark =
        mdastNode.name === 'underline'
            ? KEYS.underline
            : mdastNode.name === 'strike'
              ? KEYS.strikethrough
              : undefined;
    if (mark) {
        if (mdastNode.children.length === 0)
            return [{ text: `:${mdastNode.name}` }];

        return convertChildrenDeserialize(
            mdastNode.children as TextDirective['children'],
            { ...deco, [mark]: true },
            options,
        );
    }

    const config = configFor(mdastNode.name, 'text');

    if (!config) return undefined;

    // `:spoiler` with no bracket is text the user typed, not a directive
    if (mdastNode.children.length === 0)
        return [{ text: `:${mdastNode.name}` }];

    const children = convertChildrenDeserialize(
        mdastNode.children as TextDirective['children'],
        deco,
        options,
    );

    // Editors without the inline plugin (articles) keep the text, not the node
    if (!options.editor?.plugins[ELEMENT_SPOILER_INLINE]) return children;

    return config.deserialize(mdastNode, deco, options);
};

const isBlankParagraph = ({ children }: TElement) =>
    children.length === 1 && 'text' in children[0] && children[0].text === '';

type DefaultParagraphRule = {
    serialize: NonNullable<NonNullable<typeof defaultRules.p>['serialize']>;
};

const paragraphRule = {
    serialize: (node: TElement, options: SerializeMdOptions) =>
        (defaultRules.p as DefaultParagraphRule).serialize(node, {
            ...options,
            preserveEmptyParagraphs: isBlankParagraph(node)
                ? options.preserveEmptyParagraphs
                : false,
        }),
};

const MENTION_MDAST_TYPE = 'userLink';

type MdastMention = {
    username: string;
};

type MdastUserLink = {
    type: typeof MENTION_MDAST_TYPE;
    label: string;
    url: string;
};

const stripSigil = (value: string) => value.replace(/^@/, '');

// A bare `@name` in an old comment becomes the link the picker writes today;
// with no reference to go on, it points at the username.
const mentionRule = {
    deserialize: (mdastNode: MdastMention): TElement => {
        const username = stripSigil(mdastNode.username);

        return {
            type: KEYS.a,
            url: userMentionUrl(username),
            children: [{ text: `@${username}` }],
        };
    },
};

type LinkRule = NonNullable<typeof defaultRules.a>;
type DefaultLinkSerialize = NonNullable<LinkRule['serialize']>;
type LinkNode = Parameters<DefaultLinkSerialize>[0];

const labelOf = (node: LinkNode) =>
    node.children.length === 1 && 'text' in node.children[0]
        ? (node.children[0].text as string)
        : '';

const linkRule = {
    serialize: (node: LinkNode, options: SerializeMdOptions) => {
        const label = labelOf(node);
        const url = node.url ?? '';

        if (!isMentionLabel(label) || !isUserUrl(url)) {
            return (defaultRules.a?.serialize as DefaultLinkSerialize)(
                node,
                options,
            );
        }

        return { type: MENTION_MDAST_TYPE, label, url };
    },
};

// Both rules only apply where legacy mention syntax can appear: comments.
const mentionRules = {
    mention: mentionRule,
    a: linkRule,
} as unknown as MdRules;

// Written raw rather than as an mdast link: remark-stringify escapes `_` in the
// label, and `@second\_user` no longer matches the `@([a-zA-Z0-9_]+)` scan the
// backend runs to raise tag notifications.
const userLinkHandler = (node: MdastUserLink) => `[${node.label}](${node.url})`;

type StringifyHandlers = NonNullable<
    NonNullable<SerializeMdOptions['remarkStringifyOptions']>['handlers']
>;

const mentionHandlers = {
    [MENTION_MDAST_TYPE]: userLinkHandler,
} as StringifyHandlers;

type MarkdownKitOptions = {
    mentions?: boolean;
};

export const createMarkdownKit = ({
    mentions = false,
}: MarkdownKitOptions = {}) => [
    MarkdownPlugin.configure({
        options: {
            disallowedNodes: [KEYS.suggestion, KEYS.codeBlock, KEYS.code],
            remarkPlugins: mentions
                ? [remarkDirective, remarkMention]
                : [remarkDirective],

            remarkStringifyOptions: {
                resourceLink: true,
                handlers: {
                    ...(mentions && mentionHandlers),
                    // Keep marks in the same directive syntax as spoilers.
                    delete: (node, _parent, state, info) =>
                        ':strike[' +
                        state.containerPhrasing(node, {
                            ...info,
                            before: '[',
                            after: ']',
                        }) +
                        ']',
                },
            },

            rules: {
                p: paragraphRule,
                underline: {
                    mark: true,
                    serialize: (node) => ({
                        type: 'textDirective',
                        name: 'underline',
                        children: [{ type: 'text', value: node.text }],
                    }),
                },
                ...(mentions && mentionRules),
                // Markdown -> Plate: one entry point per directive shape
                containerDirective: {
                    deserialize: (mdastNode, deco, options) =>
                        configFor(mdastNode.name, 'container')?.deserialize(
                            mdastNode,
                            deco,
                            options,
                        ),
                },
                textDirective: { deserialize: deserializeTextDirective },
                leafDirective: { deserialize: deserializeTextDirective },
                // Plate -> Markdown: one rule per registered directive type
                ...Object.fromEntries(
                    Object.entries(directiveConfigs).map(([type, config]) => [
                        type,
                        { serialize: config.serialize },
                    ]),
                ),
            },
        },
    }),
];

export const MarkdownKit = createMarkdownKit();
