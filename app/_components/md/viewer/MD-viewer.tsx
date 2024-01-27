'use client';

import React from 'react';
import Markdown, { Options } from 'react-markdown';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';

import Link from 'next/link';

import Spoiler from './components/spoiler';
import remarkMentions from './plugins/remark-mentions';

interface Props extends Options {}

const Component = ({ children, ...props }: Props) => {
    return (
        <Markdown
            className="markdown w-full"
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
                    <Link
                        target="_blank"
                        rel="nofollow"
                        href={(node?.properties?.href as string) || ''}
                    >
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