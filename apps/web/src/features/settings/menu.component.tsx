'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

import { Button } from '@/components/ui/button';

import { SETTINGS_MENU } from '@/utils/constants/navigation';

interface Props {}

const Menu: FC<Props> = () => {
    const pathname = usePathname();

    return (
        <div className="flex flex-col gap-1">
            {SETTINGS_MENU.map((item) => (
                <Button
                    key={item.href}
                    variant={pathname === item.href ? 'outline' : 'ghost'}
                    className="justify-start"
                    asChild
                >
                    <Link href={item.href}>
                        {item.icon && <item.icon />}
                        {item.title}
                    </Link>
                </Button>
            ))}
        </div>
    );
};

export default Menu;
