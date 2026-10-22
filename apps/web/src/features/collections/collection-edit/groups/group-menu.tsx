import type { FC } from 'react';

import { ArrowDown, ArrowUp } from 'lucide-react';

import MaterialSymbolsDeleteForeverRounded from '@/components/icons/material-symbols/MaterialSymbolsDeleteForeverRounded';
import MaterialSymbolsMoreHoriz from '@/components/icons/material-symbols/MaterialSymbolsMoreHoriz';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useCollectionContext } from '../collection-provider';

type Props = {
    groupId: string;
    className?: string;
};

const GroupMenu: FC<Props> = ({ groupId, className }) => {
    const index = useCollectionContext((state) =>
        state.groups.findIndex((group) => group.id === groupId),
    );
    const last = useCollectionContext((state) => state.groups.length - 1);
    const reorderGroups = useCollectionContext((state) => state.reorderGroups);
    const removeGroup = useCollectionContext((state) => state.removeGroup);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Дії з групою"
                        className={className}
                    />
                }
            >
                <MaterialSymbolsMoreHoriz />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem
                    disabled={index === 0}
                    onClick={() => reorderGroups(index, index - 1)}
                >
                    <ArrowUp />
                    Перемістити вище
                </DropdownMenuItem>
                <DropdownMenuItem
                    disabled={index === last}
                    onClick={() => reorderGroups(index, index + 1)}
                >
                    <ArrowDown />
                    Перемістити нижче
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => removeGroup(groupId)}
                    className="text-destructive-foreground"
                >
                    <MaterialSymbolsDeleteForeverRounded />
                    Видалити групу
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default GroupMenu;
