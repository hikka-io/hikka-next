import Link from 'next/link';
import { FC } from 'react';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

interface Props {}

const OAuthHeader: FC<Props> = () => {
    return (
        <div className="flex w-full justify-between">
            <Header>
                <HeaderContainer>
                    <HeaderTitle variant="h2">Додати зʼєднання</HeaderTitle>
                </HeaderContainer>
            </Header>
            <Link href="/">
                <div className="logo-full h-[24px] w-[80px]" />
            </Link>
        </div>
    );
};

export default OAuthHeader;
