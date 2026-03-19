'use client';

import { useCreateUserSession, useHikkaClient } from '@hikka/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { Eye, EyeOff } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { OAuthLogin } from '@/features/auth';
import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';

import { setAuthCookieFn } from '@/utils/auth';
import { z } from '@/utils/i18n/zod';
import { Link, useRouter } from '@/utils/navigation';
import { validateRedirectUrl } from '@/utils/url';

const formSchema = z.object({
    identifier: z.string().min(5),
    password: z.string().min(8).max(256),
    rememberMe: z.boolean().default(false),
});

const LoginForm = () => {
    const { client } = useHikkaClient();
    const { callbackUrl: callbackUrlParam } = useFilterSearch<{
        callbackUrl?: string;
    }>();
    const captchaRef = useRef<TurnstileInstance>(undefined);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const callbackUrl = callbackUrlParam ?? '/';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            identifier: '',
            password: '',
            rememberMe: false,
        },
    });

    const mutationLogin = useCreateUserSession({
        options: {
            onSuccess: async (data) => {
                await setAuthCookieFn({
                    data: { secret: data.secret },
                });
                client.setAuthToken(data.secret);
                form.reset();
                router.push(validateRedirectUrl(callbackUrl));
            },
            onError: () => {
                captchaRef.current?.reset();
            },
        },
    });

    const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
        // Determine if identifier is email or username
        const isEmail = data.identifier.includes('@');

        const args = isEmail
            ? { email: data.identifier, password: data.password }
            : { username: data.identifier, password: data.password };

        mutationLogin.mutate({
            args,
            captcha: {
                captcha: String(captchaRef.current?.getResponse()),
            },
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ваш юзернейм або пошта</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Введіть ваш юзернейм або пошту"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel>Пароль</FormLabel>
                                <Link
                                    to="/reset"
                                    className="text-primary-foreground text-sm hover:underline"
                                >
                                    Забули пароль?
                                </Link>
                            </div>

                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        placeholder="Введіть ваш пароль"
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        className="absolute top-1/2 right-2 size-8 -translate-y-1/2"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="size-4" />
                                        ) : (
                                            <Eye className="size-4" />
                                        )}
                                    </Button>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* Captcha */}
                <Turnstile
                    ref={captchaRef}
                    siteKey="0x4AAAAAAANXs8kaCqjo_FLF"
                />

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full"
                    disabled={
                        mutationLogin.isPending || mutationLogin.isSuccess
                    }
                >
                    {mutationLogin.isPending && (
                        <span className="loading loading-spinner mr-2"></span>
                    )}
                    Увійти
                </Button>

                <OAuthLogin
                    disabled={
                        mutationLogin.isPending || mutationLogin.isSuccess
                    }
                />
            </form>
        </Form>
    );
};

export default LoginForm;
