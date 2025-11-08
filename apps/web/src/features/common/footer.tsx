'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';

import { useModalContext } from '@/services/providers/modal-provider';

import BxShareAlt from '@/components/icons/bx/BxShareAlt';
import MaterialSymbolsFavoriteRounded from '@/components/icons/material-symbols/MaterialSymbolsFavoriteRounded';

import { DONATION_LINKS, FOOTER_LINKS, SOCIAL_LINKS } from '@/utils/constants/footer';

const Footer = () => {
    const { openModal } = useModalContext();

    return (
        <footer className="w-full border-t border-t-border md:mt-12">
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                        <Button variant="ghost" size="md" asChild>
                            <Link href={FOOTER_LINKS.rules.href}>
                                {FOOTER_LINKS.rules.title}
                            </Link>
                        </Button>

                        <Button variant="ghost" size="md" asChild>
                            <Link href={FOOTER_LINKS.owners.href}>
                                {FOOTER_LINKS.owners.title}
                            </Link>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="md" variant="ghost">
                                    <MaterialSymbolsFavoriteRounded />
                                    Підтримати нас
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {DONATION_LINKS.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <DropdownMenuItem key={link.href} asChild>
                                            <Link
                                                href={link.href}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <Icon className="mr-2 size-4" />
                                                {link.title}
                                            </Link>
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="md">
                                    <BxShareAlt />
                                    Соцмережі
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {SOCIAL_LINKS.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <DropdownMenuItem key={link.href} asChild>
                                            <Link href={link.href} target="_blank">
                                                <Icon className="mr-2 size-4" />
                                                {link.title}
                                            </Link>
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-center gap-4 lg:justify-end">
                        <Label
                            id="hikka-footer-label"
                            className="text-muted-foreground"
                        >
                            © {new Date().getFullYear()} Hikka
                        </Label>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;