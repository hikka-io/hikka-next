import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

const EditHead = () => {
    return (
        <TableHeader className="[&_tr]:border-b">
            <TableRow className="hover:bg-transparent">
                <TableHead className="hidden w-8 md:table-cell">#</TableHead>
                <TableHead className="max-md:w-36">Автор</TableHead>
                <TableHead align="left">Контент</TableHead>
                <TableHead className="hidden md:table-cell" align="left">
                    Зміни
                </TableHead>
                <TableHead align="right" className="text-right max-md:w-24">
                    Статус
                </TableHead>
            </TableRow>
        </TableHeader>
    );
};

export default EditHead;
