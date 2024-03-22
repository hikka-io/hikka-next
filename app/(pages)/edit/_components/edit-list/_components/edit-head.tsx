import * as React from 'react';

import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Component = () => {
    return (
        <TableHeader className="overflow-hidden rounded-lg bg-secondary/30">
            <TableRow>
                <TableHead className="w-8">#</TableHead>
                <TableHead>Автор</TableHead>
                <TableHead align="left">Контент</TableHead>
                <TableHead className=" hidden lg:table-cell" align="left">
                    Зміни
                </TableHead>
                <TableHead align="right">
                    Статус
                </TableHead>
            </TableRow>
        </TableHeader>
    );
};

export default Component;
