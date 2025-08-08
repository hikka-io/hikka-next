'use client';

import { useCreateUser } from '@hikka/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import OAuthLogin from '@/features/auth/oauth/oauth-login.component';

import { setCookie } from '@/utils/cookies';
import { z } from '@/utils/zod';

const formSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(8),
        username: z.string().min(3),
        passwordConfirmation: z.string().min(8),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: 'Паролі не збігаються',
        path: ['passwordConfirmation'],
    });

const SignupForm = () => {
    const captchaRef = useRef<TurnstileInstance>(undefined);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
            username: '',
            passwordConfirmation: '',
        },
    });

    const mutationSignup = useCreateUser({
        options: {
            onSuccess: async (data) => {
                await setCookie('auth', data.secret);
                router.push('/');
                router.refresh();

                toast.success(
                    <span>
                        <span className="font-bold">
                            {form.getValues('username')}
                        </span>
                        , Ви успішно зареєструвались.
                    </span>,
                );

                form.reset();
            },
            onError: () => {
                captchaRef.current?.reset();
            },
        },
    });

    const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
        mutationSignup.mutate({
            args: {
                email: data.email,
                password: data.password,
                username: data.username,
            },
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
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Ім&apos;я користувача (нікнейм)
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Введіть Ваше ім'я"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Введіть ваш email"
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
                            <FormLabel>Пароль</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        placeholder="Введіть пароль"
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        className="absolute right-2 top-1/2 size-8 -translate-y-1/2"
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

                <FormField
                    control={form.control}
                    name="passwordConfirmation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Підтвердження паролю</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={
                                            showPasswordConfirmation
                                                ? 'text'
                                                : 'password'
                                        }
                                        placeholder="Повторіть пароль"
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        className="absolute right-2 top-1/2 size-8 -translate-y-1/2"
                                        onClick={() =>
                                            setShowPasswordConfirmation(
                                                !showPasswordConfirmation,
                                            )
                                        }
                                    >
                                        {showPasswordConfirmation ? (
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
                        mutationSignup.isPending || mutationSignup.isSuccess
                    }
                >
                    {mutationSignup.isPending && (
                        <span className="loading loading-spinner mr-2"></span>
                    )}
                    Зареєструватись
                </Button>

                <OAuthLogin
                    disabled={
                        mutationSignup.isPending || mutationSignup.isSuccess
                    }
                    buttonText="Зареєструватись з Google"
                />
            </form>
        </Form>
    );
};

export default SignupForm;
