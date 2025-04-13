import { FC } from 'react';

import { Badge } from '../../../../components/ui/badge';
import { Label } from '../../../../components/ui/label';
import { RELEASE_STATUS } from '../../../../utils/constants/common';

interface Props {
    status: API.Status;
}

const Status: FC<Props> = ({ status }) => {
    if (!status) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center">
            <div className="w-24">
                <Label className="text-muted-foreground">Статус:</Label>
            </div>
            <div className="flex-1">
                <Badge variant="status" bgColor={RELEASE_STATUS[status].color}>
                    {RELEASE_STATUS[status].title_ua}
                </Badge>
            </div>
        </div>
    );
};

export default Status;
