'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface Props {
    title: string;
    description: string;
    onExport: () => void;
    isExporting: boolean;
}

const ListExportItem = ({
    title,
    description,
    onExport,
    isExporting,
}: Props) => {
    return (
        <div className="flex flex-col items-start gap-2">
            <Label>{title}</Label>
            <p className="text-sm text-muted-foreground">{description}</p>
            <Button onClick={onExport} disabled={isExporting} size="md">
                {isExporting && <span className="loading loading-spinner"></span>}
                Експортувати
            </Button>
        </div>
    );
};

export default ListExportItem;