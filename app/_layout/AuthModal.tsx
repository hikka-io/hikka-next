'use client';

import React from 'react';
import LogosGoogleIcon from '~icons/logos/google-icon';

import Image from '@/app/_components/Image';
import Modal from '@/app/_components/Modal';
import ForgotPasswordForm from '@/app/_layout/auth/ForgotPasswordForm';
import LoginForm from '@/app/_layout/auth/LoginForm';
import PasswordConfirmForm from '@/app/_layout/auth/PasswordConfirmForm';
import SignUpForm from '@/app/_layout/auth/SignUpForm';
import getOAuth from '@/utils/api/auth/getOAuth';
import { useModalContext } from '@/utils/providers/ModalProvider';
import { useAuthContext } from '@/utils/providers/AuthProvider';

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
            onDismiss={closeModals}
            id="authModal"
            boxClassName="p-0"
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
                        <div className="logo h-[24px] w-[80px] bg-base-content" />
                    </div>
                    {forgotPassword && <ForgotPasswordForm />}
                    {login && <LoginForm />}
                    {signup && <SignUpForm />}
                    {passwordConfirm && <PasswordConfirmForm />}
                    <button
                        onClick={onOAuthSubmit}
                        className="btn btn-accent btn-outline mt-4 w-full"
                    >
                        <LogosGoogleIcon />
                        Увійти з Google
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default Component;
