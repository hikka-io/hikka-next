'use client';

import { FC } from 'react';

import MaterialSymbolsLoginRounded from '@/components/icons/material-symbols/MaterialSymbolsLoginRounded';
import P from '@/components/typography/p';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import AuthModal from '@/features/modals/auth-modal/auth-modal.component';

import { useModalContext } from '@/services/providers/modal-provider';

interface Props {}

const AuthNeeded: FC<Props> = () => {
    const { openModal } = useModalContext();

    return (
        <Card className="w-full flex-row items-center justify-between">
            <div className="flex items-center gap-4">
                <MaterialSymbolsLoginRounded className="text-3xl text-muted-foreground" />
                <div className="flex flex-1 flex-col">
                    <Header>
                        <HeaderContainer>
                            <HeaderTitle className="line-clamp-1">
                                Авторизація
                            </HeaderTitle>
                        </HeaderContainer>
                    </Header>
                    <P className="line-clamp-2 text-sm text-muted-foreground">
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
