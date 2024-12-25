'use client';

import Link from 'next/link';

import BxBxlGithub from '@/components/icons/bx/BxBxlGithub';
import BxBxlTelegram from '@/components/icons/bx/BxBxlTelegram';
import BxBxsDonateHeart from '@/components/icons/bx/BxBxsDonateHeart';
import PhTipJarFill from '@/components/icons/ph/PhTipJarFill';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';

import { useModalContext } from '@/services/providers/modal-provider';

import RightHolder from './rightholder.component';

const Footer = () => {
    const { openModal } = useModalContext();

    return (
        <footer className="w-full border-t border-t-border md:mt-12">
            <div className="container mx-auto max-w-screen-xl p-4">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                        <Button
                            variant="ghost"
                            size="md"
                            onClick={() =>
                                openModal({
                                    content: <RightHolder />,
                                    className: 'max-w-xl',
                                    title: 'Правовласникам',
                                })
                            }
                        >
                            Правовласникам
                        </Button>
                        <Button variant="ghost" size="md" asChild>
                            <Link href="https://t.me/hikka_io" target="_blank">
                                <BxBxlTelegram />
                                Telegram
                            </Link>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="md" variant="ghost">
                                    Підтримати нас
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="https://donatello.to/hikka.io"
                                        target="_blank"
                                    >
                                        <BxBxsDonateHeart className="mr-2 size-4" />
                                        Donatello
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="https://send.monobank.ua/jar/UejmZHk4B"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <PhTipJarFill className="mr-2 size-4" />
                                        Монобанка
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-center gap-4 lg:justify-end">
                        <Button size="md" variant="ghost" asChild>
                            <Link
                                href="https://github.com/hikka-io"
                                target="_blank"
                            >
                                <BxBxlGithub />
                                GitHub
                            </Link>
                        </Button>
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
