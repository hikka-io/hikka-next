import React from 'react';
import MaterialSymbolsStarRounded from '~icons/*';

import P from '@/components/typography/p';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';

const FollowingItem = () => {
    return (
        <div className="flex items-center gap-4">
            <Avatar className="size-12 rounded-md">
                <AvatarImage
                    className="size-12 rounded-md"
                    src="https://cdn.hikka.io/uploads/volbil/UploadTypeEnum.avatar/be23d575-6cf6-4df1-b55d-ba1a8bd58c2e.jpg"
                />
                <AvatarFallback className="size-12 rounded-md" />
            </Avatar>
            <div className="flex flex-1 flex-col gap-1">
                <Label>Volbil</Label>
                <P className="text-xs text-muted-foreground">Дивлюсь</P>
            </div>
            <div className="inline-flex items-end gap-1">
                <Label>10</Label>
                <MaterialSymbolsStarRounded />
            </div>
        </div>
    );
};

export default FollowingItem;