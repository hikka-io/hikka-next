import { Label } from '@/components/ui/label';
import { TableCell } from '@/components/ui/table';

interface Props {
    number: number;
}

const Component = ({ number }: Props) => (
    <TableCell className="w-8">
        <Label className="text-muted-foreground">{number}</Label>
    </TableCell>
);

export default Component;