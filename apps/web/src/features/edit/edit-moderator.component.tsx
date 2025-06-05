'use client';

import { useEdit } from '@hikka/react';
import { format } from 'date-fns';
import { FC } from 'react';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import { Label } from '@/components/ui/label';

interface Props {
    editId: string;
}

const EditModerator: FC<Props> = ({ editId }) => {
    const { data: edit } = useEdit({ editId: Number(editId) });

    if (!edit || !edit.moderator) {
        return null;
    }

    return (
        <>
            <hr className="text-muted-foreground my-4 h-px w-full" />
            <div className="flex flex-col gap-4">
                <Label className="text-muted-foreground">Модератор</Label>
                <HorizontalCard href={`/u/${edit.moderator.username}`}>
                    <HorizontalCardImage
                        image={edit.moderator.avatar}
                        imageRatio={1}
                    />
                    <HorizontalCardContainer>
                        <HorizontalCardTitle>
                            {edit.moderator.username}
                        </HorizontalCardTitle>
                        <HorizontalCardDescription>
                            {format(edit.updated * 1000, 'd MMM yyyy H:mm')}
                        </HorizontalCardDescription>
                    </HorizontalCardContainer>
                </HorizontalCard>
            </div>
        </>
    );
};

export default EditModerator;
