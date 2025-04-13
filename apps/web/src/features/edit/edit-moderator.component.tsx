'use client';

import { format } from 'date-fns';
import { FC } from 'react';

import useEdit from '@/services/hooks/edit/use-edit';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '../../components/ui/horizontal-card';
import { Label } from '../../components/ui/label';

interface Props {
    editId: string;
}

const EditModerator: FC<Props> = ({ editId }) => {
    const { data: edit } = useEdit({ edit_id: Number(editId) });

    if (!edit || !edit.moderator) {
        return null;
    }

    return (
        <>
            <hr className="my-4 h-px w-full text-muted-foreground" />
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
