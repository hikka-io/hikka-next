import type { FC } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { useSession } from '@/services/session';
import { useCurrentUrl } from '@/utils/navigation';

import OAuthAuthNeeded from './oauth-auth-needed';

type Props = {};

const OAuthProfile: FC<Props> = () => {
    const { user } = useSession();
    const currentUrl = useCurrentUrl();

    const logout = () => {
        window.location.href = `/auth/logout?callbackUrl=${encodeURIComponent(currentUrl)}`;
    };

    if (!user) return <OAuthAuthNeeded />;

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
                    <p className="text-muted-foreground text-sm">
                        Ваш обліковий запис
                    </p>
                </div>
            </div>
            <Button size="md" variant="destructive" onClick={logout}>
                Вийти
            </Button>
        </Card>
    );
};

export default OAuthProfile;
