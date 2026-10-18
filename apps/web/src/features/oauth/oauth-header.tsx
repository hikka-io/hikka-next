import type { FC } from 'react';

import { Header, HeaderTitle } from '@/components/ui/header';
import { Link } from '@/utils/navigation';

type Props = {};

const OAuthHeader: FC<Props> = () => {
    return (
        <div className="flex w-full justify-between">
            <Header>
                <HeaderTitle as="h1" size="page">
                    Додати зʼєднання
                </HeaderTitle>
            </Header>
            <Link to="/">
                <div className="logo-full h-[24px] w-[80px]" />
            </Link>
        </div>
    );
};

export default OAuthHeader;
