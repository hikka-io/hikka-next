'use client';

import React from 'react';
import Markdown, { Options } from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';

import Link from 'next/link';

import Spoiler from './components/spoiler';

interface Props extends Options {}

const Component = ({ children, ...props }: Props) => {
    return (
        <Markdown
            className="markdown w-full"
            disallowedElements={['code']}
            remarkPlugins={[
                remarkDirective,
                remarkDirectiveRehype,
                [rehypeExternalLinks, { target: '_blank', rel: ['nofollow'] }],
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
            }}
            {...props}
        >
            {children}
        </Markdown>
    );
};

export default Component;