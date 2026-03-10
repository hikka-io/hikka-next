import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

const EditHead = () => {
    return (
        <TableHeader className="overflow-hidden rounded-lg bg-secondary/20">
            <TableRow>
                <TableHead className="hidden w-8 sm:table-cell">#</TableHead>
                <TableHead>Автор</TableHead>
                <TableHead align="left">Контент</TableHead>
                <TableHead className="hidden sm:table-cell" align="left">
                    Зміни
                </TableHead>
                <TableHead align="right" className="text-right">
                    Статус
                </TableHead>
            </TableRow>
        </TableHeader>
    );
};

export default EditHead;
