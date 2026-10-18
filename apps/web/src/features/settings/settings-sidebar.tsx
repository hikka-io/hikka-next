import type { FC } from 'react';

import { ChevronDown } from 'lucide-react';

import Block from '@/components/ui/block';
import { buttonVariants } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Header, HeaderTitle } from '@/components/ui/header';
import { cn } from '@/utils/cn';
import { Link, usePathname } from '@/utils/navigation';

import { SETTINGS_MENU } from './settings-menu';
import {
    getActiveTopLevelHref,
    isGroupActive,
    isNavLinkActive,
} from './settings-nav';

type Props = {
    className?: string;
};

const leafRowClass = (active: boolean) =>
    cn(
        buttonVariants({ variant: active ? 'secondary' : 'ghost', size: 'md' }),
        'w-full justify-start',
        !active && 'text-muted-foreground',
    );

/* Parent of sub-links: never filled — the active sub-link carries the fill. */
const parentRowClass = (active: boolean) =>
    cn(
        buttonVariants({ variant: 'ghost', size: 'md' }),
        'w-full justify-start',
        active ? 'text-foreground' : 'text-muted-foreground',
    );

const subRowClass = (active: boolean) =>
    cn(
        buttonVariants({ variant: active ? 'secondary' : 'ghost', size: 'sm' }),
        'w-full justify-start',
        !active && 'text-muted-foreground',
    );

const SettingsSidebar: FC<Props> = ({ className }) => {
    const pathname = usePathname();
    const activeTopLevel = getActiveTopLevelHref(SETTINGS_MENU, pathname);

    return (
        <Block variant="card" className={cn('w-full', className)}>
            <Header>
                <HeaderTitle as="h3" size="subsection">
                    Налаштування
                </HeaderTitle>
            </Header>

            {/* Desktop: always-expanded groups */}
            <nav className="-mx-2 hidden flex-col gap-1 md:flex">
                {SETTINGS_MENU.map((item) => (
                    <div key={item.href} className="flex flex-col gap-1">
                        <Link
                            to={item.children?.[0]?.href ?? item.href}
                            className={
                                item.children
                                    ? parentRowClass(
                                          isGroupActive(item.href, pathname),
                                      )
                                    : leafRowClass(
                                          isNavLinkActive(item.href, pathname),
                                      )
                            }
                        >
                            <item.icon />
                            {item.title}
                        </Link>
                        {item.children && (
                            <div className="ml-5 flex flex-col gap-1 border-border/60 border-l pl-2">
                                {item.children.map((child) => (
                                    <Link
                                        key={child.href}
                                        to={child.href}
                                        className={subRowClass(
                                            isNavLinkActive(
                                                child.href,
                                                pathname,
                                            ),
                                        )}
                                    >
                                        {child.title}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Mobile: collapsible accordion, active group open by default */}
            <nav className="-mx-2 flex flex-col gap-1 md:hidden">
                {SETTINGS_MENU.map((item) =>
                    item.children ? (
                        <Collapsible
                            key={item.href}
                            defaultOpen={activeTopLevel === item.href}
                        >
                            <CollapsibleTrigger
                                className={cn(
                                    parentRowClass(
                                        isGroupActive(item.href, pathname),
                                    ),
                                    '[&[data-state=open]>svg:last-child]:rotate-180',
                                )}
                            >
                                <item.icon />
                                {item.title}
                                <ChevronDown className="ml-auto transition-transform" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-1 ml-5 flex flex-col gap-1 border-border/60 border-l pl-2">
                                {item.children.map((child) => (
                                    <Link
                                        key={child.href}
                                        to={child.href}
                                        className={subRowClass(
                                            isNavLinkActive(
                                                child.href,
                                                pathname,
                                            ),
                                        )}
                                    >
                                        {child.title}
                                    </Link>
                                ))}
                            </CollapsibleContent>
                        </Collapsible>
                    ) : (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={leafRowClass(
                                isNavLinkActive(item.href, pathname),
                            )}
                        >
                            <item.icon />
                            {item.title}
                        </Link>
                    ),
                )}
            </nav>
        </Block>
    );
};

export default SettingsSidebar;
