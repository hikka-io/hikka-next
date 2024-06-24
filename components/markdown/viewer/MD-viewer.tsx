'use client';

import { memo } from 'react';
import Markdown, { Options } from 'react-markdown';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';

import Link from '@/components/markdown/viewer/components/link';
import Spoiler from '@/components/markdown/viewer/components/spoiler';

import { cn } from '@/utils/utils';

import NoSpoiler from './components/no-spoiler';
import remarkMentions from './plugins/remark-mentions';

interface Props extends Options {
    disableSpoiler?: boolean;
}

const MDViewer = ({ children, className, disableSpoiler, ...props }: Props) => {
    return (
        <Markdown
            className={cn('markdown w-full', className)}
            remarkPlugins={[
                remarkDirective,
                remarkDirectiveRehype,
                [
                    remarkMentions,
                    { usernameLink: (username: string) => '/u/' + username },
                ],
            ]}
            components={{
                spoiler: disableSpoiler ? NoSpoiler : Spoiler,
                a: ({ node, children }) => (
                    <Link
                        href={(node?.properties?.href as string) || ''}
                        className="break-all"
                    >
                        {children}
                    </Link>
                ),
                code: ({ node, children }) => <p>{children}</p>,
                u: ({ children }) => <u>{children}</u>,
            }}
            disallowedElements={['pre']}
            unwrapDisallowed
            {...props}
        >
            {children}
        </Markdown>
    );
};

export default memo(MDViewer);
