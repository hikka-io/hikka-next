import type { ReactNode } from 'react';

import { Text, View } from 'react-native';

import {
    type ArticleBlockNode,
    type ArticleInlineNode,
    articleInlineText,
    isBlankArticleParagraph,
} from '@hikka/core';

import { Link, Spoiler, SpoilerInline } from '@/components/markdown';

import ArticleImages from './article-images';
import ArticleVideo from './article-video';
import { HEADING_CLASSES, listMarker, markClassName } from './document-layout';

export type RenderContext = {
    authenticated: boolean;
    selectable: boolean;
    textClassName: string;
};

// Inline runs use React Native's own Text so they inherit the size and colour of the block around them.
const renderInlines = (
    nodes: ArticleInlineNode[],
    context: RenderContext,
): ReactNode[] =>
    nodes.map((node, index) => {
        switch (node.type) {
            case 'text': {
                const className = markClassName(node);
                return className ? (
                    <Text key={index} className={className}>
                        {node.text}
                    </Text>
                ) : (
                    node.text
                );
            }
            case 'link':
                return (
                    <Link
                        key={index}
                        href={node.url}
                        authenticated={context.authenticated}
                    >
                        {renderInlines(node.children, context)}
                    </Link>
                );
            case 'spoiler_inline':
                return (
                    <SpoilerInline
                        key={index}
                        text={articleInlineText(node.children)}
                    >
                        {renderInlines(node.children, context)}
                    </SpoilerInline>
                );
            default:
                return null;
        }
    });

export const renderBlocks = (
    blocks: ArticleBlockNode[],
    context: RenderContext,
): ReactNode[] =>
    blocks.map((block, index) => {
        switch (block.type) {
            case 'paragraph':
                return (
                    <Text
                        key={index}
                        selectable={context.selectable}
                        className={context.textClassName}
                    >
                        {isBlankArticleParagraph(block.children)
                            ? ' '
                            : renderInlines(block.children, context)}
                    </Text>
                );
            case 'heading':
                return (
                    <Text
                        key={index}
                        accessibilityRole="header"
                        selectable={context.selectable}
                        className={HEADING_CLASSES[block.level]}
                    >
                        {renderInlines(block.children, context)}
                    </Text>
                );
            case 'blockquote':
                return (
                    <View
                        key={index}
                        className="gap-4 border-border border-l-2 pl-3"
                    >
                        {renderBlocks(block.children, context)}
                    </View>
                );
            case 'spoiler':
                return (
                    <Spoiler key={index}>
                        <View className="gap-4">
                            {renderBlocks(block.children, context)}
                        </View>
                    </Spoiler>
                );
            case 'list':
                return (
                    <View key={index} className="gap-2">
                        {block.items.map((item, itemIndex) => (
                            <View key={itemIndex} className="flex-row">
                                <Text
                                    className={`${context.textClassName} ${block.ordered ? 'min-w-7' : 'w-5'}`}
                                >
                                    {listMarker(block.ordered, itemIndex)}
                                </Text>
                                <View className="flex-1 gap-2">
                                    {renderBlocks(item, context)}
                                </View>
                            </View>
                        ))}
                    </View>
                );
            case 'images':
                return <ArticleImages key={index} urls={block.urls} />;
            case 'video':
                return <ArticleVideo key={index} video={block.video} />;
            default:
                return null;
        }
    });
