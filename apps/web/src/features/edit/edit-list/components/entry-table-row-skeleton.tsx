import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

const EntryTableRowSkeleton = () => {
    return (
        <TableRow className="hover:bg-transparent">
            <TableCell className="hidden w-8 md:table-cell">
                <Skeleton className="h-4 w-12" />
            </TableCell>
            <TableCell className="md:w-40">
                <div className="flex gap-4 max-md:gap-3">
                    <Avatar className="size-10 rounded-md max-md:hidden">
                        <AvatarFallback className="size-10 rounded-md" />
                    </Avatar>
                    <div className="flex min-w-0 flex-1 flex-col">
                        <Skeleton className="my-0.5 h-4 w-20 max-w-full" />
                        <Skeleton className="my-0.75 h-3 w-24 max-w-full md:w-16" />
                        <Skeleton className="my-0.75 hidden h-3 w-12 max-w-full md:block" />
                    </div>
                </div>
            </TableCell>
            <TableCell align="left" className="md:w-1/4">
                <div className="flex flex-col">
                    <Skeleton className="my-0.5 h-4 w-full" />
                    <Skeleton className="my-0.5 h-4 w-2/3 md:hidden" />
                    <Skeleton className="my-1 h-3 w-10" />
                </div>
            </TableCell>
            <TableCell className="hidden md:table-cell" align="left">
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5.5 w-18 rounded-sm" />
                    <Skeleton className="h-5.5 w-14 rounded-sm" />
                </div>
            </TableCell>
            <TableCell align="center" className="w-20">
                <div className="flex justify-end">
                    <Skeleton className="h-4.5 w-18 rounded-sm" />
                </div>
            </TableCell>
        </TableRow>
    );
};

export default EntryTableRowSkeleton;
