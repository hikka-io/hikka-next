'use client';

import { useSnackbar } from 'notistack';
import React, { ForwardedRef, forwardRef, useRef, useState } from 'react';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import {
    MDXEditorMethods,
    directivesPlugin,
    listsPlugin,
    quotePlugin,
    toolbarPlugin,
} from '@mdxeditor/editor';
import { useQueryClient } from '@tanstack/react-query';

import { SpoilerDirectiveDescriptor } from '@/app/_components/md/editor/directives/spoiler-directive';
import { ForwardRefEditor } from '@/app/_components/md/editor/forward-ref-editor';
import BoldButton from '@/app/_components/md/editor/toolbar/bold-button';
import ItalicButton from '@/app/_components/md/editor/toolbar/italic-button';
import SpoilerButton from '@/app/_components/md/editor/toolbar/spoiler-button';
import { Button } from '@/app/_components/ui/button';
import { cn } from '@/utils';
import addComment from '@/utils/api/comments/addComment';
import { useAuthContext } from '@/utils/providers/auth-provider';

interface Props {
    slug: string;
    content_type: 'edit';
    parent?: string;
    className?: string;
}

const Component = forwardRef(
    (
        { parent, slug, content_type, className }: Props,
        ref: ForwardedRef<HTMLDivElement>,
    ) => {
        const { enqueueSnackbar } = useSnackbar();
        const [isPosting, setIsPosting] = useState(false);
        const editorRef = useRef<MDXEditorMethods>(null);
        const queryClient = useQueryClient();
        const [text, setText] = useState('');
        const captchaRef = useRef<TurnstileInstance>();
        const { secret } = useAuthContext();

        const onSubmit = async () => {
            setIsPosting(true);

            if (captchaRef.current) {
                try {
                    await addComment({
                        content_type: content_type,
                        slug: slug,
                        parent: parent,
                        secret: String(secret),
                        text: text,
                        captcha: String(captchaRef.current.getResponse()),
                    });

                    await queryClient.invalidateQueries({
                        queryKey: ['comments', slug],
                    });

                    setText('');
                    editorRef.current?.setMarkdown('');
                } catch (e) {
                    if (captchaRef.current) {
                        captchaRef.current?.reset();
                    }

                    enqueueSnackbar(
                        'Виникла помилка при відправленні повідомлення. Спробуйте, будь ласка, ще раз',
                        { variant: 'error' },
                    );
                }
            }

            setIsPosting(false);
        };

        return (
            <div ref={ref} className={cn('relative w-full', className)}>
                <ForwardRefEditor
                    ref={editorRef}
                    readOnly={isPosting}
                    plugins={[
                        directivesPlugin({
                            directiveDescriptors: [SpoilerDirectiveDescriptor],
                        }),
                        listsPlugin(),
                        quotePlugin(),
                        toolbarPlugin({
                            toolbarContents: () => (
                                <>
                                    <BoldButton />
                                    <ItalicButton />
                                    <SpoilerButton />
                                </>
                            ),
                        }),
                    ]}
                    className="dark-theme dark-editor border border-b-0 border-secondary/60 bg-secondary/30 rounded-t-md"
                    markdown={text}
                    onChange={setText}
                />
                <div className="p-2 flex justify-end items-center w-full bg-secondary/30 border-secondary/60 border border-t-0 rounded-b-md">
                    <Button
                        disabled={isPosting}
                        onClick={onSubmit}
                        size="sm"
                        type="submit"
                        variant="secondary"
                    >
                        {isPosting && (
                            <span className="loading loading-spinner"></span>
                        )}
                        Відправити
                    </Button>
                </div>
                <Turnstile
                    options={{
                        size: 'invisible',
                    }}
                    ref={captchaRef}
                    siteKey="0x4AAAAAAANXs8kaCqjo_FLF"
                />
            </div>
        );
    },
);

export default Component;