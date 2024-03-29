'use client';

import React, { memo } from 'react';
import Markdown, { Options } from 'react-markdown';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';

import { cn } from '@/utils';

import Spoiler from '@/components/markdown/viewer/components/spoiler';
import remarkMentions from './plugins/remark-mentions';
import Link from '@/components/markdown/viewer/components/link';

interface Props extends Options {}

const Component = ({ children, className, ...props }: Props) => {
    return (
        <Markdown
            className={cn('markdown w-full', className)}
            // disallowedElements={['code']}
            remarkPlugins={[
                remarkDirective,
                remarkDirectiveRehype,
                [
                    remarkMentions,
                    { usernameLink: (username: string) => '/u/' + username },
                ],
            ]}

            components={{
                spoiler: Spoiler,
                a: ({ node, children }) => (
                    <Link href={(node?.properties?.href as string) || ''} className="break-all">
                        {children}
                    </Link>
                ),
                code: ({ node, children }) => <p>{children}</p>,
                u: ({ children }) => <u>{children}</u>,
            }}
            {...props}
        >
            {children}
        </Markdown>
    );
};

export default memo(Component);