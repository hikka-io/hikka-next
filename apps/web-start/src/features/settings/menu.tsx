'use client';

import { FC, useRef } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { cn } from '@/utils/cn';
import { SETTINGS_MENU } from '@/utils/constants/navigation';
import { Link } from '@/utils/navigation';
import { usePathname } from '@/utils/navigation';

interface Props {}

const Menu: FC<Props> = () => {
    const pathname = usePathname();
    const scrollRef = useRef<HTMLDivElement>(null);
    const { gradientClassName } = useScrollGradientMask(
        scrollRef,
        'horizontal',
    );

    return (
        <Tabs defaultValue={SETTINGS_MENU[0].href} value={pathname}>
            <TabsList
                ref={scrollRef}
                className={cn(
                    'no-scrollbar w-full justify-start overflow-auto',
                    gradientClassName,
                )}
            >
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
