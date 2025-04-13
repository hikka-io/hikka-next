'use client';

import { FC } from 'react';

import P from '@/components/typography/p';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderTitle,
} from '@/components/ui/header';
import useSession from '@/services/hooks/auth/use-session';
import AuthNeeded from './auth-needed';

interface Props {}

const Profle: FC<Props> = () => {
    const { user, logout } = useSession();

    if (!user) return <AuthNeeded />;

    return (
        <Card className="w-full flex-row items-center justify-between">
            <div className="flex items-center gap-4">
                <Avatar className="size-12 rounded-md">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="size-12 rounded-md">
                        {user?.username[0]}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <Header>
                        <HeaderContainer>
                            <HeaderTitle className="line-clamp-1">
                                {user?.username}
                            </HeaderTitle>
                        </HeaderContainer>
                    </Header>
                    <P className="text-sm text-muted-foreground">
                        Ваш обліковий запис
                    </P>
                </div>
            </div>
            <Button size="md" variant="destructive" onClick={logout}>
                Вийти
            </Button>
        </Card>
    );
};

export default Profle;
