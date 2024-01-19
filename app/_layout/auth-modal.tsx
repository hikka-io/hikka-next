'use client';

import React from 'react';
import LogosGoogleIcon from '~icons/logos/google-icon';

import Image from '@/app/_components/image';
import Modal from '@/app/_components/modal';
import ForgotPasswordForm from '@/app/_layout/auth/forgot-password-form';
import LoginForm from '@/app/_layout/auth/login-form';
import PasswordConfirmForm from '@/app/_layout/auth/password-confirm-form';
import SignUpForm from '@/app/_layout/auth/signup-form';
import getOAuth from '@/utils/api/auth/getOAuth';
import { useModalContext } from '@/utils/providers/modal-provider';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { Button } from '@/app/_components/ui/button';

const Component = () => {
    const { secret } = useAuthContext();
    const { login, signup, forgotPassword, passwordConfirm, closeModals } =
        useModalContext();

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

    if (secret) {
        return null;
    }

    return (
        <Modal
            open={
                Boolean(login) ||
                Boolean(signup) ||
                Boolean(forgotPassword) ||
                Boolean(passwordConfirm)
            }
            onOpenChange={(open) => !open && closeModals()}
            id="authModal"
            boxClassName="p-0 max-w-3xl"
        >
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
                    {forgotPassword && <ForgotPasswordForm />}
                    {login && <LoginForm />}
                    {signup && <SignUpForm />}
                    {passwordConfirm && <PasswordConfirmForm />}
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
        </Modal>
    );
};

export default Component;
