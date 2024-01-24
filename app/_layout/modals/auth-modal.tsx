'use client';

import React from 'react';
import LogosGoogleIcon from '~icons/logos/google-icon';

import Image from '@/app/_components/image';
import { Button } from '@/app/_components/ui/button';
import ForgotPasswordForm from '@/app/_layout/modals/auth/forgot-password-form';
import LoginForm from '@/app/_layout/modals/auth/login-form';
import PasswordConfirmForm from '@/app/_layout/modals/auth/password-confirm-form';
import SignUpForm from '@/app/_layout/modals/auth/signup-form';
import getOAuth from '@/utils/api/auth/getOAuth';

const Component = ({
    type,
}: {
    type: 'login' | 'signup' | 'forgotPassword' | 'passwordConfirm';
}) => {
    const onOAuthSubmit = async () => {
        try {
            const res = await getOAuth({ provider: 'google' });
            window.location.href = res.url;
            return;
        } catch (e) {
            console.error(e);
            return;
        }
    };
    // "p-0 max-w-3xl"
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[40%_1fr]">
            <div className="relative hidden lg:block">
                <Image
                    src="/hikka.art.jpg"
                    width={200}
                    height={200}
                    className="h-full w-full object-cover"
                    alt="test"
                />
            </div>
            <div className="flex w-full flex-col items-center gap-4 px-8 py-8 text-center">
                <div className="flex h-12 items-center">
                    <div className="logo h-[24px] w-[80px] bg-foreground" />
                </div>
                {type === 'forgotPassword' && <ForgotPasswordForm />}
                {type === 'login' && <LoginForm />}
                {type === 'signup' && <SignUpForm />}
                {type === 'passwordConfirm' && <PasswordConfirmForm />}
                <Button
                    variant="outline"
                    onClick={onOAuthSubmit}
                    className="mt-4 w-full"
                >
                    <LogosGoogleIcon />
                    Увійти з Google
                </Button>
            </div>
        </div>
    );
};

export default Component;