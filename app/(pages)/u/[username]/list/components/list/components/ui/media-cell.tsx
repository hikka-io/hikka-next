import { TableCell } from '@/components/ui/table';
import { MEDIA_TYPE } from '@/utils/constants';

interface Props {
    media_type: API.MediaType;
}

const Component = ({ media_type }: Props) => (
    <TableCell className="hidden w-32 lg:table-cell" align="center">
        {MEDIA_TYPE[media_type as API.MediaType]?.title_ua || '-'}
    </TableCell>
);

export default Component;
