'use client';

import { withProps } from '@udecode/cn';
import Markdown, { Components, Options } from 'react-markdown';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';

import { cn } from '@/utils/utils';

import Blockquote from '../../typography/blockquote';
import Li from '../../typography/li';
import Link from '../../typography/link';
import Ol from '../../typography/ol';
import P from '../../typography/p';
import Spoiler from '../../typography/spoiler';
import Ul from '../../typography/ul';
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
        <span
            className={cn('text-primary-foreground hover:underline', className)}
        >
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
