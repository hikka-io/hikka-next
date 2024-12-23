'use client';

import { memo } from 'react';
import Markdown, { Options } from 'react-markdown';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';

import Link from '@/components/markdown/viewer/components/link';
import Spoiler from '@/components/markdown/viewer/components/spoiler';

import { cn } from '@/utils/utils';

import NoSpoiler from './components/no-spoiler';
import remarkDisableTokenizer from './plugins/remark-disable-tokenizer';
import remarkMentions from './plugins/remark-mentions';

interface Props extends Options {
    preview?: boolean;
}

const MDViewer = ({ children, className, preview, ...props }: Props) => {
    return (
        <Markdown
            className={cn('markdown w-full', className)}
            remarkPlugins={[
                remarkDisableTokenizer,
                remarkDirective,
                remarkDirectiveRehype,
                [
                    remarkMentions,
                    { usernameLink: (username: string) => '/u/' + username },
                ],
            ]}
            components={{
                spoiler: preview ? NoSpoiler : Spoiler,
                // @ts-ignore
                a: ({ node, children }) =>
                    preview ? (
                        <span className="text-primary hover:underline">
                            {children}
                        </span>
                    ) : (
                        <Link
                            href={(node?.properties?.href as string) || ''}
                            className="break-all"
                        >
                            {children}
                        </Link>
                    ),
            }}
            {...props}
        >
            {children}
        </Markdown>
    );
};

export default memo(MDViewer);
