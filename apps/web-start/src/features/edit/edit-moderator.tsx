import type { FC } from 'react';

import { format } from 'date-fns';

import { useQuery } from '@tanstack/react-query';

import { getEditOptions } from '@hikka/api';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import { Label } from '@/components/ui/label';

type Props = {
    editId: string;
};

const EditModerator: FC<Props> = ({ editId }) => {
    const { data: edit } = useQuery(
        getEditOptions({ path: { edit_id: Number(editId) } }),
    );

    if (!edit?.moderator) {
        return null;
    }

    return (
        <>
            <hr className="my-4 h-px w-full text-muted-foreground" />
            <div className="flex flex-col gap-4">
                <Label className="text-muted-foreground">Модератор</Label>
                <HorizontalCard>
                    <HorizontalCardImage
                        image={edit.moderator.avatar}
                        imageRatio={1}
                        href={`/u/${edit.moderator.username}`}
                    />
                    <HorizontalCardContainer>
                        <HorizontalCardTitle
                            href={`/u/${edit.moderator.username}`}
                        >
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
