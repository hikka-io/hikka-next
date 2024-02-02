'use client';

import React from 'react';
import Markdown, { Options } from 'react-markdown';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
import Spoiler from './_components/spoiler';
import Link from './_components/link';
import remarkMentions from './plugins/remark-mentions';
import { cn } from '@/utils';

interface Props extends Options {}

const Component = ({ children, className, ...props }: Props) => {
    return (
        <Markdown
            className={cn("markdown w-full", className)}
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
                    <Link href={(node?.properties?.href as string) || ''}>
                        {children}
                    </Link>
                ),
                code: ({ node, children }) => <p>{children}</p>,
            }}
            {...props}
        >
            {children}
        </Markdown>
    );
};

export default Component;