'use client';

import { FC } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { SETTINGS_MENU } from '@/utils/constants/navigation';
import { Link } from '@/utils/navigation';
import { usePathname } from '@/utils/navigation';

interface Props {}

const Menu: FC<Props> = () => {
    const pathname = usePathname();

    return (
        <Tabs defaultValue={SETTINGS_MENU[0].href} value={pathname}>
            <TabsList className="no-scrollbar w-full justify-start overflow-auto ">
                {SETTINGS_MENU.map((item) => (
                    <TabsTrigger asChild key={item.href} value={item.href}>
                        <Link to={item.href}>
                            <div className="flex items-center gap-2">
                                {<item.icon />} {item.title}
                            </div>
                        </Link>
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
};

export default Menu;
