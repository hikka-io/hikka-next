'use client';

import { useSession } from '@hikka/react';
import { BookOpen, Layers, Pencil, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';

import { Link } from '@/utils/navigation';

const NAV_ITEMS = [
    {
        icon: BookOpen,
        label: 'Статті',
        path: '/articles',
        createPath: '/articles/new',
    },
    {
        icon: Layers,
        label: 'Колекції',
        path: '/collections',
        createPath: '/collections/new',
    },
    { icon: Pencil, label: 'Правки', path: '/edit' },
] as const;

const SidebarNavigation = () => {
    const { user } = useSession();

    return (
        <Card className="gap-1 p-2 bg-secondary/20 backdrop-blur-lg">
            {NAV_ITEMS.map((item) => (
                <div key={item.path} className="flex items-center gap-1">
                    <Link
                        to={item.path}
                        className="flex flex-1 items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                    >
                        <item.icon className="text-muted-foreground size-4" />
                        <span>{item.label}</span>
                    </Link>
                    {user && 'createPath' in item && (
                        <Button
                            asChild
                            size="icon-sm"
                            className="text-muted-foreground"
                            variant="ghost"
                        >
                            <Link to={item.createPath}>
                                <Plus className="size-4" />
                            </Link>
                        </Button>
                    )}
                </div>
            ))}
        </Card>
    );
};

export default SidebarNavigation;
