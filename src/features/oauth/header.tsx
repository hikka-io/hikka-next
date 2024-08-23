import Link from 'next/link';
import { FC } from 'react';

import HeaderComponent from '@/components/ui/header';

interface Props {}

const Header: FC<Props> = () => {
    return (
        <div className="flex justify-between w-full">
            <HeaderComponent variant="h2" title="Додати зʼєднання" />
            <Link href="/">
                <div className="logo-full h-[24px] w-[80px]" />
            </Link>
        </div>
    );
};

export default Header;
