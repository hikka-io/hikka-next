import type { FC } from 'react';

import MaterialSymbolsFavoriteRounded from '@/components/icons/material-symbols/MaterialSymbolsFavoriteRounded';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utils/cn';
import { FOOTER_LINKS } from '@/utils/constants/navigation';
import { Link } from '@/utils/navigation';
import { DONATION_LINKS, SOCIAL_LINKS } from '@/utils/constants/external-links';

type Props = {
    className?: string;
};

const Footer: FC<Props> = ({ className }) => {
    return (
        <footer
            className={cn(
                'w-full border-t border-t-border md:mt-12',
                className,
            )}
        >
            <div className="mx-auto w-full max-w-350 p-4">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 lg:justify-start">
                        {Object.values(FOOTER_LINKS).map((link) => (
                            <Button
                                key={link.href}
                                variant="ghost"
                                size="md"
                                render={<Link to={link.href} />}
                            >
                                {link.title}
                            </Button>
                        ))}

                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={<Button size="md" variant="ghost" />}
                            >
                                <MaterialSymbolsFavoriteRounded />
                                Підтримати нас
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {DONATION_LINKS.map(
                                    ({ href, title, icon: Icon }) => (
                                        <DropdownMenuItem
                                            key={href}
                                            render={
                                                <Link
                                                    to={href}
                                                    target="_blank"
                                                />
                                            }
                                        >
                                            <Icon className="mr-2 size-4" />
                                            {title}
                                        </DropdownMenuItem>
                                    ),
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
                        <div className="flex items-center gap-2">
                            {SOCIAL_LINKS.map(({ href, title, icon: Icon }) => (
                                <Button
                                    key={href}
                                    variant="ghost"
                                    size="icon-md"
                                    render={
                                        <Link
                                            to={href}
                                            target="_blank"
                                            aria-label={title}
                                        />
                                    }
                                >
                                    <Icon className="size-4" />
                                </Button>
                            ))}
                        </div>
                        <Separator
                            orientation="vertical"
                            className="mx-2 block h-6"
                        />
                        <p className="whitespace-nowrap text-muted-foreground text-sm">
                            © {new Date().getFullYear()} Hikka
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
