'use client';

import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import MaterialSymbolsImageOutlineRounded from '~icons/material-symbols/image-outline-rounded';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';

import { Button } from '@/app/_components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/app/_components/ui/form';
import { Textarea } from '@/app/_components/ui/textarea';
import addComment from '@/utils/api/comments/addComment';
import { useAuthContext } from '@/utils/providers/auth-provider';


type FormValues = {
    text: string;
};

interface Props {
    slug: string;
    content_type: 'edit';
    parent?: string;
}

const Component = ({ parent, slug, content_type }: Props) => {
    const captchaRef = useRef<TurnstileInstance>();
    const { secret } = useAuthContext();
    const form = useForm<FormValues>();

    const onSubmit = async (data: FormValues) => {
        if (captchaRef.current) {
            try {
                await addComment({
                    content_type: content_type,
                    slug: slug,
                    parent: parent,
                    secret: String(secret),
                    text: data.text,
                    captcha: String(captchaRef.current.getResponse()),
                });
            } catch (e) {
                if (captchaRef.current) {
                    captchaRef.current?.reset();
                }
            }
        }
    };

    return (
        <Form {...form}>
            <form
                className="relative w-full"
                onSubmit={(e) => e.preventDefault()}
            >
                <FormField
                    name="text"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    className="rounded-b-none border-b-0"
                                    rows={5}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="p-2 flex justify-between items-center w-full bg-secondary/30 border-secondary/60 border border-t-0 rounded-b-md">
                    <Button size="icon-sm" variant="ghost">
                        <MaterialSymbolsImageOutlineRounded />
                    </Button>
                    <Button
                        size="sm"
                        onClick={form.handleSubmit(onSubmit)}
                        type="submit"
                        variant="secondary"
                    >
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
            </form>
        </Form>
    );
};

export default Component;