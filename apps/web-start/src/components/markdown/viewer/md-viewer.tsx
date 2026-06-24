'use client';

import Markdown, { type Components, type Options } from 'react-markdown';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';

import { cn } from '@/utils/cn';

import Link from '../link';
import Spoiler from '../spoiler';
import Mention from './components/mention';
import NoSpoiler from './components/no-spoiler';
import remarkDisableTokenizer from './plugins/remark-disable-tokenizer';
import remarkMentions from './plugins/remark-mentions';

type Props = Options & {
    preview?: boolean;
    className?: string;
};

type CustomComponents = Components & {
    spoiler: React.ComponentType<any>;
    mention: React.ComponentType<any>;
};

const previewComponents: Partial<CustomComponents> = {
    spoiler: NoSpoiler,
    mention: ({ node }: any) => (
        <span className="text-primary-foreground">
            @{node?.properties?.username ?? ''}
        </span>
    ),
    a: ({ children, className }) => (
        <span
            className={cn('text-primary-foreground hover:underline', className)}
        >
            {children}
        </span>
    ),
};

const headingComponent: React.FC<
    React.HTMLAttributes<HTMLParagraphElement>
> = ({ children }) => <p>{children}</p>;

const components = (preview?: boolean): CustomComponents =>
    ({
        spoiler: Spoiler,
        mention: Mention,
        a: Link,
        h1: headingComponent,
        h2: headingComponent,
        h3: headingComponent,
        h4: headingComponent,
        h5: headingComponent,
        h6: headingComponent,
        ...(preview ? previewComponents : {}),
    }) as CustomComponents;

const MDViewer = ({ children, className, preview, ...props }: Props) => {
    return (
        <div className={cn('prose', className)}>
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
