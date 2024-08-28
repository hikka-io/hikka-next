'use client';

import { FC } from 'react';
import MaterialSymbolsLoginRounded from '~icons/material-symbols/login-rounded';

import P from '@/components/typography/p';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import Header from '@/components/ui/header';

import AuthModal from '@/features/modals/auth-modal/auth-modal.component';

import { useModalContext } from '@/services/providers/modal-provider';

interface Props {}

const AuthNeeded: FC<Props> = () => {
    const { openModal } = useModalContext();

    return (
        <Card className="flex-row items-center justify-between w-full">
            <div className="flex items-center gap-4">
                <MaterialSymbolsLoginRounded className="text-3xl text-muted-foreground" />
                <div className="flex flex-col flex-1">
                    <Header titleClassName="line-clamp-1" title="Авторизація" />
                    <P className="text-sm text-muted-foreground line-clamp-2">
                        Вам необіхдно авторизуватись, перш ніж надати доступ
                    </P>
                </div>
            </div>
            <Button
                size="md"
                variant="outline"
                onClick={() =>
                    openModal({
                        content: <AuthModal type="login" />,
                        className: 'max-w-3xl p-0',
                        forceModal: true,
                    })
                }
            >
                Увійти
            </Button>
        </Card>
    );
};

export default AuthNeeded;
