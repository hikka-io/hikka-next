'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar';

import { APP_SIDEBAR } from '@/utils/constants/navigation';

function AppSidebar() {
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
            className="z-20"
            // onMouseLeave={toggleSidebar}
        >
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
                                                onClick={toggleSidebar}
                                                isActive={
                                                    navitem.url === item?.url
                                                }
                                            >
                                                <Link href={navitem.url}>
                                                    {navitem.icon && (
                                                        <navitem.icon />
                                                    )}
                                                    <span>
                                                        {navitem.title_ua}
                                                    </span>
                                                </Link>
                                            </SidebarMenuButton>
                                            {navitem.items && (
                                                <SidebarMenuSub>
                                                    {navitem.items.map(
                                                        (subnavitem) =>
                                                            subnavitem.visible ? (
                                                                <SidebarMenuSubItem
                                                                    key={
                                                                        subnavitem.url
                                                                    }
                                                                >
                                                                    <SidebarMenuSubButton
                                                                        asChild
                                                                        onClick={
                                                                            toggleSidebar
                                                                        }
                                                                    >
                                                                        <Link
                                                                            href={
                                                                                subnavitem.url
                                                                            }
                                                                        >
                                                                            {subnavitem.icon && (
                                                                                <subnavitem.icon />
                                                                            )}
                                                                            <span>
                                                                                {
                                                                                    subnavitem.title_ua
                                                                                }
                                                                            </span>
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            ) : null,
                                                    )}
                                                </SidebarMenuSub>
                                            )}
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
