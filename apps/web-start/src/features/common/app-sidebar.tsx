'use client';

import { Link } from '@/utils/navigation';
import { usePathname } from '@/utils/navigation';

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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarTrigger,
    useSidebar,
} from '@/components/ui/sidebar';

import { APP_SIDEBAR } from '@/utils/constants/navigation';

function AppSidebar() {
    const pathname = usePathname();
    const { toggleSidebar } = useSidebar();

    const isActive = (url: string) => {
        if (url === '/') return pathname === '/';
        return pathname === url || pathname.startsWith(url + '/');
    };

    return (
        <Sidebar
            variant="sidebar"
            collapsible="dropdown"
            side="left"
        >
            <SidebarHeader className="min-h-16 flex-row items-center justify-between p-4">
                <Link to={'/'} onClick={toggleSidebar}>
                    <div className="logo-full size-[24px] w-[80px]" />
                </Link>
                <SidebarTrigger />
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
                                                onClick={toggleSidebar}
                                                isActive={isActive(navitem.url)}
                                            >
                                                <Link to={navitem.url} search={navitem.search}>
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
                                                                            to={
                                                                                subnavitem.url
                                                                            }
                                                                            search={subnavitem.search}
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
