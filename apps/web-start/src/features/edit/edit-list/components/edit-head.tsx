import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

const EditHead = () => {
    return (
        <TableHeader className="bg-secondary/20 overflow-hidden rounded-lg">
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
