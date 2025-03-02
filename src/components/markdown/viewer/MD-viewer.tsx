'use client';

import { withProps } from '@udecode/cn';
import Markdown, { Components, Options } from 'react-markdown';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';

import Blockquote from '@/components/typography/blockquote';
import Li from '@/components/typography/li';
import Link from '@/components/typography/link';
import Ol from '@/components/typography/ol';
import P from '@/components/typography/p';
import Spoiler from '@/components/typography/spoiler';
import Ul from '@/components/typography/ul';

import { cn } from '@/utils/utils';

import NoSpoiler from './components/no-spoiler';
import remarkDisableTokenizer from './plugins/remark-disable-tokenizer';
import remarkMentions from './plugins/remark-mentions';

interface Props extends Options {
    preview?: boolean;
    className?: string;
}

type CustomComponents = Components & {
    spoiler: React.ComponentType<any>;
};

const previewComponents: CustomComponents = {
    spoiler: NoSpoiler,
    a: ({ children, className }) => (
        <span className={cn('text-primary hover:underline', className)}>
            {children}
        </span>
    ),
    p: P,
};

const components = (preview?: boolean): CustomComponents =>
    ({
        spoiler: withProps(Spoiler, { className: 'mb-4' }),
        p: withProps(P, { className: 'mb-4' }),
        blockquote: withProps(Blockquote, { className: 'mb-4' }),
        a: Link,
        ul: withProps(Ul, { className: 'mb-4' }),
        ol: withProps(Ol, { className: 'mb-4' }),
        li: Li,
        ...(preview ? previewComponents : {}),
    }) as CustomComponents;

const MDViewer = ({ children, className, preview, ...props }: Props) => {
    return (
        <div className={className}>
            <Markdown
                remarkPlugins={[
                    remarkDisableTokenizer,
                    remarkDirective,
                    remarkDirectiveRehype,
                    [
                        remarkMentions,
                        {
                            usernameLink: (username: string) =>
                                '/u/' + username,
                        },
                    ],
                ]}
                components={components(preview)}
                {...props}
            >
                {children}
            </Markdown>
        </div>
    );
};

export default MDViewer;
