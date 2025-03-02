'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import BxBxlTelegram from '@/components/icons/bx/BxBxlTelegram';
import BxBxsDonateHeart from '@/components/icons/bx/BxBxsDonateHeart';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

import { useMediaQuery } from '@/services/hooks/use-media-query';
import { APP_SIDEBAR } from '@/utils/constants/navigation';

const FOOTER_GROUP = [
    {
        title_ua: 'Telegram',
        url: 'https://t.me/hikka_io',
        icon: () => <BxBxlTelegram />,
    },
    {
        title_ua: 'Donatello',
        url: 'https://donatello.to/hikka.io',
        icon: () => <BxBxsDonateHeart />,
    },
];

function AppSidebar() {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const pathname = usePathname();
    const { toggleSidebar, setActiveItem, item } = useSidebar();

    useEffect(() => {
        APP_SIDEBAR.forEach((group) => {
            group.items.forEach((navitem) => {
                if (navitem.url === '/') {
                    if (pathname === navitem.url) {
                        setActiveItem(navitem);
                    }
                } else {
                    if (pathname.startsWith(navitem.url)) {
                        setActiveItem(navitem);
                    }
                }
            });
        });
    }, [pathname]);

    return (
        <Sidebar
            variant="floating"
            collapsible="offcanvas"
            onMouseLeave={toggleSidebar}
        >
            <SidebarHeader className="p-4">
                <Link href={'/'}>
                    <div className="logo-full size-[24px] w-[80px]" />
                </Link>
            </SidebarHeader>
            <SidebarContent>
                {APP_SIDEBAR.map((group) => (
                    <SidebarGroup key={group.title_ua}>
                        <SidebarGroupLabel>{group.title_ua}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((navitem) =>
                                    navitem.visible ? (
                                        <SidebarMenuItem key={navitem.url}>
                                            <SidebarMenuButton
                                                asChild
                                                onClick={
                                                    !isDesktop
                                                        ? toggleSidebar
                                                        : undefined
                                                }
                                                isActive={
                                                    navitem.url === item?.url
                                                }
                                            >
                                                <Link href={navitem.url}>
                                                    <navitem.icon />
                                                    <span>
                                                        {navitem.title_ua}
                                                    </span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ) : null,
                                )}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
        </Sidebar>
    );
}

export default AppSidebar;
