import { type FC, Fragment } from 'react';

import { Zap } from 'lucide-react';

import type { EditContentTypeEnum } from '@hikka/api';

import { Button } from '@/components/ui/button';

import { useQuickEdit } from './use-quick-edit';

type Props = {
    slug: string;
    content_type: EditContentTypeEnum;
};

const QuickEditButton: FC<Props> = ({ slug, content_type }) => {
    const { canQuickEdit, preload, openDeferred, modal } = useQuickEdit(
        content_type,
        slug,
    );

    if (!canQuickEdit) return null;

    return (
        <Fragment>
            <Button
                type="button"
                variant="outline"
                size="icon-md"
                aria-label="Швидка правка"
                title="Швидка правка"
                onPointerEnter={preload}
                onClick={openDeferred}
            >
                <Zap />
            </Button>
            {modal}
        </Fragment>
    );
};

export default QuickEditButton;
