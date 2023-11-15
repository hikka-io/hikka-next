'use client';

import Modal from '@/app/_components/Modal';
import Image from '@/app/_components/Image';
import { Dispatch, SetStateAction, useState } from 'react';
import LoginForm from '@/app/_layout/auth/LoginForm';
import SignUpForm from '@/app/_layout/auth/SignUpForm';

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const Component = ({ open, setOpen }: Props) => {
    const [tab, setTab] = useState<'login' | 'signup'>('login');

    return (
        <Modal
            open={open}
            onDismiss={() => setOpen(false)}
            id="authModal"
            boxClassName="p-0"
        >
            <div className="grid md:grid-cols-[40%_1fr] grid-cols-1">
                <div className="relative hidden md:block">
                    <Image
                        src="https://images.pexels.com/photos/18608193/pexels-photo-18608193.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
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
                    {open && tab === 'login' && (
                        <LoginForm
                            open={open}
                            setOpen={setOpen}
                            setTab={setTab}
                        />
                    )}
                    {open && tab === 'signup' && (
                        <SignUpForm
                            open={open}
                            setOpen={setOpen}
                            setTab={setTab}
                        />
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default Component;
