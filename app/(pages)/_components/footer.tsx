'use client';

import * as React from 'react';
import ArcticonsMonobank from '~icons/arcticons/monobank';
import MingcuteTelegramFill from '~icons/mingcute/telegram-fill';
import SimpleIconsBuymeacoffee from '~icons/simple-icons/buymeacoffee';

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

import Rightholder from './rightholder.mdx';

const Component = () => {
    const { openModal } = useModalContext();

    return (
        <footer className="w-full border-t border-t-secondary md:mt-12">
            <div className="container mx-auto max-w-screen-xl p-4">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                openModal({
                                    content: <Rightholder />,
                                    className: 'max-w-xl',
                                    title: 'Правовласникам',
                                })
                            }
                        >
                            Правовласникам
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="https://t.me/hikka_io" target="_blank">
                                <MingcuteTelegramFill />
                                Telegram
                            </Link>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost">
                                    Підтримати нас
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="https://www.buymeacoffee.com/hikka"
                                        target="_blank"
                                    >
                                        <SimpleIconsBuymeacoffee className="mr-2 h-4 w-4" />
                                        BuyMeACoffee
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="https://send.monobank.ua/jar/UejmZHk4B"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <ArcticonsMonobank className="mr-2 h-4 w-4" />
                                        Монобанка
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-center lg:justify-end">
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

export default Component;
