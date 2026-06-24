import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Spinner from '@/components/ui/spinner';

type Props = {
    title: string;
    description: string;
    onExport: () => void;
    isExporting: boolean;
};

const ListExportItem = ({
    title,
    description,
    onExport,
    isExporting,
}: Props) => {
    return (
        <div className="flex flex-col items-start gap-2">
            <Label>{title}</Label>
            <p className="text-muted-foreground text-sm">{description}</p>
            <Button onClick={onExport} disabled={isExporting} size="md">
                {isExporting && <Spinner />}
                Експортувати
            </Button>
        </div>
    );
};

export default ListExportItem;
