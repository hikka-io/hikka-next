import type { SETTINGS_MENU } from '@/utils/constants/navigation';

type SettingsMenu = typeof SETTINGS_MENU;

/** A specific link (leaf top item or sub-link) is active on an exact match. */
export function isNavLinkActive(href: string, pathname: string): boolean {
    return pathname === href;
}

/** A group is active when the path is the parent itself or any descendant. */
export function isGroupActive(href: string, pathname: string): boolean {
    return pathname === href || pathname.startsWith(`${href}/`);
}

/** Href of the top-level item that owns the current path (for mobile auto-open). */
export function getActiveTopLevelHref(
    menu: SettingsMenu,
    pathname: string,
): string | undefined {
    return menu.find((item) => isGroupActive(item.href, pathname))?.href;
}
