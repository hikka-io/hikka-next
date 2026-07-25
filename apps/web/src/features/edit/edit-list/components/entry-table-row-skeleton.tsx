import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

const EntryTableRowSkeleton = () => {
    return (
        <TableRow className="hover:bg-transparent">
            <TableCell className="hidden w-8 md:table-cell">
                <Skeleton className="h-4 w-11" />
            </TableCell>
            <TableCell className="md:w-40">
                <div className="flex gap-4 max-md:gap-3">
                    <Avatar className="size-10 rounded-md max-md:hidden">
                        <AvatarFallback className="size-10 rounded-md" />
                    </Avatar>
                    <div className="flex min-w-0 flex-col gap-1.5">
                        <Skeleton className="h-4 w-20 max-w-full" />
                        <Skeleton className="h-3 w-32 max-w-full md:w-14" />
                        <Skeleton className="hidden h-3 w-20 max-w-full md:block" />
                    </div>
                </div>
            </TableCell>
            <TableCell align="left" className="md:w-1/4">
                <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </TableCell>
            <TableCell className="hidden md:table-cell" align="left">
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-16 rounded-sm" />
                    <Skeleton className="h-5 w-20 rounded-sm" />
                </div>
            </TableCell>
            <TableCell align="center" className="w-20">
                <div className="flex justify-end">
                    <Skeleton className="h-5 w-16 rounded-sm" />
                </div>
            </TableCell>
        </TableRow>
    );
};

export default EntryTableRowSkeleton;
