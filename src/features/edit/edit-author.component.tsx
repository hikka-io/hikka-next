'use client';

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

import useEdit from '@/services/hooks/edit/use-edit';

interface Props {
    editId: string;
}

const EditAuthor: FC<Props> = ({ editId }) => {
    const { data: edit } = useEdit({ edit_id: Number(editId) });

    if (!edit) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <Label className="text-muted-foreground">Автор</Label>
            <HorizontalCard href={`/u/${edit.author!.username}`}>
                <HorizontalCardImage
                    image={edit.author!.avatar}
                    imageRatio={1}
                />
                <HorizontalCardContainer>
                    <HorizontalCardTitle>
                        {edit.author!.username}
                    </HorizontalCardTitle>
                    <HorizontalCardDescription>
                        {format(edit.created * 1000, 'd MMM yyyy H:mm')}
                    </HorizontalCardDescription>
                </HorizontalCardContainer>
            </HorizontalCard>
        </div>
    );
};

export default EditAuthor;
