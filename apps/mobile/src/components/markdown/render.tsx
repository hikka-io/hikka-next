import type { ReactNode } from 'react';

import type { Token, Tokens } from 'marked';
import { Text, View } from 'react-native';

import type { DirectiveToken, SpoilerToken } from './directives';
import Link from './link';
import MDImage from './md-image';
import Mention from './mention';
import { asMention, type MentionToken } from './mentions';
import { decodeText, plainText } from './plain-text';
import Spoiler from './spoiler';
import SpoilerInline from './spoiler-inline';

export type RenderContext = {
    authenticated: boolean;
    selectable: boolean;
    textClassName: string;
};

type Nested = Token & { tokens?: Token[]; text?: string };

const imageOf = (token: Token): Tokens.Image | null => {
    if (token.type === 'image') return token as Tokens.Image;

    const link = token as Tokens.Link;

    return link.type === 'link' && link.tokens?.length === 1
        ? imageOf(link.tokens[0])
        : null;
};

export const renderInline = (
    tokens: Token[] | undefined,
    context: RenderContext,
): ReactNode[] =>
    (tokens ?? []).map((token: Nested, index) => {
        const children = () => renderInline(token.tokens, context);

        switch (token.type) {
            case 'strong':
                return (
                    <Text key={index} className="font-bold">
                        {children()}
                    </Text>
                );
            case 'em':
                return (
                    <Text key={index} className="italic">
                        {children()}
                    </Text>
                );
            case 'strike':
                return (
                    <Text key={index} className="line-through">
                        {children()}
                    </Text>
                );
            case 'br':
                return '\n';
            case 'link': {
                const link = token as Tokens.Link;
                const mention = asMention(link);

                return mention ? (
                    <Mention key={index} {...mention} />
                ) : (
                    <Link
                        key={index}
                        href={link.href}
                        authenticated={context.authenticated}
                    >
                        {children()}
                    </Link>
                );
            }
            case 'mention': {
                const { username } = token as unknown as MentionToken;

                return <Mention key={index} username={username} />;
            }
            case 'spoiler': {
                const spoiler = token as unknown as SpoilerToken;

                return (
                    <SpoilerInline key={index} text={plainText(spoiler.tokens)}>
                        {children()}
                    </SpoilerInline>
                );
            }
            case 'html':
            case 'image':
                return null;
            default:
                if (token.tokens) return children();

                return typeof token.text === 'string'
                    ? decodeText(token.text)
                    : null;
        }
    });

const renderParagraph = (
    tokens: Token[],
    context: RenderContext,
    key: number,
) => {
    const nodes: ReactNode[] = [];
    let run: Token[] = [];

    const flush = (suffix: string) => {
        const content = renderInline(run, context);

        if (
            plainText(run).trim() !== '' ||
            run.some((t) => t.type !== 'text')
        ) {
            nodes.push(
                <Text
                    key={`${key}-${suffix}`}
                    selectable={context.selectable}
                    className={context.textClassName}
                >
                    {content}
                </Text>,
            );
        }

        run = [];
    };

    tokens.forEach((token, index) => {
        const image = imageOf(token);

        if (!image) {
            run.push(token);
            return;
        }

        flush(`t${index}`);
        nodes.push(
            <MDImage
                key={`${key}-i${index}`}
                uri={image.href}
                alt={image.text}
                href={
                    token.type === 'link'
                        ? (token as Tokens.Link).href
                        : undefined
                }
            />,
        );
    });

    flush('end');

    return nodes;
};

export const renderBlocks = (
    tokens: Token[] | undefined,
    context: RenderContext,
): ReactNode[] =>
    (tokens ?? []).flatMap((token: Nested, index): ReactNode[] => {
        switch (token.type) {
            case 'paragraph':
            case 'text':
            case 'heading':
                return renderParagraph(token.tokens ?? [token], context, index);
            case 'blockquote':
                return [
                    <View
                        key={index}
                        className="gap-4 border-border border-l-2 pl-3"
                    >
                        {renderBlocks(token.tokens, context)}
                    </View>,
                ];
            case 'list': {
                const list = token as Tokens.List;
                const start = list.start === '' ? 1 : Number(list.start);

                return [
                    <View key={index} className="gap-2">
                        {list.items.map((item, itemIndex) => (
                            <View key={itemIndex} className="flex-row">
                                <Text
                                    className={`${context.textClassName} ${list.ordered ? 'min-w-7' : 'w-5'}`}
                                >
                                    {list.ordered
                                        ? `${start + itemIndex}.`
                                        : '•'}
                                </Text>
                                <View className="flex-1 gap-2">
                                    {renderBlocks(item.tokens, context)}
                                </View>
                            </View>
                        ))}
                    </View>,
                ];
            }
            case 'hr':
                return [<View key={index} className="h-px bg-border" />];
            case 'directive': {
                const directive = token as unknown as DirectiveToken;
                const children = renderBlocks(directive.tokens, context);

                return directive.name === 'spoiler'
                    ? [<Spoiler key={index}>{children}</Spoiler>]
                    : children;
            }
            default:
                return [];
        }
    });
