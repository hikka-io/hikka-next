import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { TableCell, TableRow } from '../../../components/ui/table';

interface Props {}

const Component = ({}: Props) => {
    return (
        <TableRow className="animate-pulse">
            <TableCell className="w-8">
                <div className="h-3 w-10 rounded-lg bg-secondary/20" />
            </TableCell>
            <TableCell className="w-40">
                <div className="flex items-center gap-4">
                    <Avatar className="size-10 rounded-md">
                        <AvatarFallback className="size-10 rounded-md" />
                    </Avatar>
                    <div className="flex flex-col gap-2">
                        <div className="h-3 w-12 rounded-lg bg-secondary/20" />
                        <div className="h-2 w-6 rounded-lg bg-secondary/20" />
                    </div>
                </div>
            </TableCell>
            <TableCell align="left" className="md:w-1/4">
                <div className="flex flex-col gap-2">
                    <div className="h-3 w-full rounded-lg bg-secondary/20" />
                    <div className="h-2 w-12 rounded-lg bg-secondary/20" />
                </div>
            </TableCell>
            <TableCell className="hidden md:w-1/3 lg:table-cell" align="left">
                <div className="flex flex-col gap-2">
                    <div className="h-3 w-full rounded-lg bg-secondary/20" />
                    <div className="h-3 w-1/2 rounded-lg bg-secondary/20" />
                </div>
            </TableCell>
            <TableCell align="center" className="w-20">
                <div className="flex justify-end">
                    <div className="h-5 w-20 rounded-md bg-secondary/20" />
                </div>
            </TableCell>
        </TableRow>
    );
};

export default Component;
