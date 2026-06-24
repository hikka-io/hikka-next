'use client';

import type { FC } from 'react';

import MaterialSymbolsLoginRounded from '@/components/icons/material-symbols/MaterialSymbolsLoginRounded';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { Link, useCurrentUrl } from '@/utils/navigation';

type Props = {};

const AuthNeeded: FC<Props> = () => {
    const currentUrl = useCurrentUrl();

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
                    <p className="line-clamp-2 text-muted-foreground text-sm">
                        Вам необіхдно авторизуватись, перш ніж надати доступ
                    </p>
                </div>
            </div>
            <Button size="md" variant="outline" asChild>
                <Link to="/login" search={{ callbackUrl: currentUrl }}>
                    Увійти
                </Link>
            </Button>
        </Card>
    );
};

export default AuthNeeded;
