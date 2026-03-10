'use client';

import { cva } from 'class-variance-authority';
import { BookOpen, Layers, Pencil } from 'lucide-react';
import { Link } from '@tanstack/react-router';

import Card from '@/components/ui/card';

const NAV_ITEMS = [
    // { icon: Compass, label: 'Огляд', path: '/discovery', variant: 'secondary' },
    { icon: BookOpen, label: 'Статті', path: '/articles', variant: 'default' },
    {
        icon: Layers,
        label: 'Колекції',
        path: '/collections',
        variant: 'default',
    },
    { icon: Pencil, label: 'Правки', path: '/edit', variant: 'default' },
] as const;

const sidebarNavigationVariants = cva(
    'flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-secondary',
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
    return (
        <Card className="gap-1 p-2 bg-secondary/20 backdrop-blur">
            {NAV_ITEMS.map((item) => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={sidebarNavigationVariants({
                        variant: item.variant,
                    })}
                >
                    <item.icon className="text-muted-foreground size-4" />
                    <span
                        className={
                            item.variant === 'default'
                                ? 'text-foreground font-medium'
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
