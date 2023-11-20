'use client';

import Modal from '@/app/_components/Modal';
import Image from '@/app/_components/Image';
import ForgotPasswordForm from '@/app/_layout/auth/ForgotPasswordForm';
import LoginForm from '@/app/_layout/auth/LoginForm';
import SignUpForm from '@/app/_layout/auth/SignUpForm';
import PasswordConfirmForm from '@/app/_layout/auth/PasswordConfirmForm';
import { useModalContext } from '@/utils/providers/ModalProvider';
import getOAuth from '@/utils/api/auth/getOAuth';
import LogosGoogleIcon from '~icons/logos/google-icon'

const Component = () => {
    const { login, signup, forgotPassword, passwordConfirm, closeModals } = useModalContext();

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

    return (
        <Modal
            open={Boolean(login) || Boolean(signup) || Boolean(forgotPassword) || Boolean(passwordConfirm)}
            onDismiss={closeModals}
            id="authModal"
            boxClassName="p-0"
        >
            <div className="grid md:grid-cols-[40%_1fr] grid-cols-1">
                <div className="relative hidden md:block">
                    <Image
                        src="/hikka.art.jpg"
                        width={200}
                        height={200}
                        className="object-cover w-full h-full"
                        alt="test"
                    />
                </div>
                <div className="py-8 px-8 w-full text-center flex flex-col items-center gap-4">
                    <div className="h-12 flex items-center">
                        <Image
                            src="/logo.svg"
                            alt="Hikka"
                            width={85}
                            height={25}
                        />
                    </div>
                    {forgotPassword && <ForgotPasswordForm />}
                    {login && <LoginForm />}
                    {signup && <SignUpForm />}
                    {passwordConfirm && <PasswordConfirmForm />}
                    <button
                        onClick={onOAuthSubmit}
                        className="btn btn-outline btn-accent w-full mt-4"
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
