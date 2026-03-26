'use client';

import { useRouterState } from '@tanstack/react-router';
import { FC } from 'react';

import MaterialSymbolsLoginRounded from '@/components/icons/material-symbols/MaterialSymbolsLoginRounded';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import { Link } from '@/utils/navigation';

interface Props {}

const AuthNeeded: FC<Props> = () => {
    const currentUrl = useRouterState({
        select: (s) => {
            const loc = s.resolvedLocation ?? s.location;
            return loc.pathname + loc.searchStr;
        },
    });

    return (
        <Card className="w-full flex-row items-center justify-between">
            <div className="flex items-center gap-4">
                <MaterialSymbolsLoginRounded className="text-muted-foreground text-3xl" />
                <div className="flex flex-1 flex-col">
                    <Header>
                        <HeaderContainer>
                            <HeaderTitle className="line-clamp-1">
                                Авторизація
                            </HeaderTitle>
                        </HeaderContainer>
                    </Header>
                    <p className="text-muted-foreground line-clamp-2 text-sm">
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
