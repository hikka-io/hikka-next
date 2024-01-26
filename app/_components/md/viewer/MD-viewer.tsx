'use client';

import React from 'react';
import Markdown, { Options } from 'react-markdown';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';

import Spoiler from './components/spoiler';
import rehypeExternalLinks from 'rehype-external-links';

interface Props extends Options {}

const Component = ({ children, ...props }: Props) => {
    return (
        <Markdown
            className="markdown w-full"
            remarkPlugins={[remarkDirective, remarkDirectiveRehype, [rehypeExternalLinks, { target: '_blank' }]]}
            components={{
                spoiler: Spoiler,
            }}
            {...props}
        >
            {children}
        </Markdown>
    );
};

export default Component;