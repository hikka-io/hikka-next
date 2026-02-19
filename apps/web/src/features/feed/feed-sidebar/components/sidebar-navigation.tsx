'use client';

import { useSession } from '@hikka/react';
import { cva } from 'class-variance-authority';
import { BookOpen, Eye, Layers, Pencil } from 'lucide-react';
import Link from 'next/link';

import Card from '@/components/ui/card';

const NAV_ITEMS = [
    { icon: Eye, label: 'Огляд', path: '', variant: 'secondary' },
    { icon: BookOpen, label: 'Статті', path: '/articles', variant: 'default' },
    {
        icon: Layers,
        label: 'Колекції',
        path: '/collections',
        variant: 'default',
    },
    { icon: Pencil, label: 'Правки', path: '/edits', variant: 'default' },
];

const sidebarNavigationVariants = cva(
    'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary',
    {
        variants: {
            variant: {
                default: '',
                secondary: 'bg-secondary/20',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

const SidebarNavigation = () => {
    const { user } = useSession();

    if (!user) return null;

    return (
        <Card className="gap-1 p-2 bg-secondary/20">
            {NAV_ITEMS.map((item) => (
                <Link
                    key={item.path}
                    href={`/u/${user.username}${item.path}`}
                    className={sidebarNavigationVariants({
                        variant: item.variant as 'default' | 'secondary',
                    })}
                >
                    <item.icon className="text-muted-foreground size-4" />
                    <span
                        className={
                            item.variant === 'default'
                                ? 'text- font-medium'
                                : 'text-foreground'
                        }
                    >
                        {item.label}
                    </span>
                </Link>
            ))}
        </Card>
    );
};

export default SidebarNavigation;
