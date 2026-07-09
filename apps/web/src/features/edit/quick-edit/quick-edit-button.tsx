import { type FC, Fragment, useState } from 'react';

import { Zap } from 'lucide-react';

import type { EditContentTypeEnum } from '@hikka/api';

import { Button } from '@/components/ui/button';
import { useSession } from '@/features/auth/hooks/use-session';

import QuickEditModal from './quick-edit-modal';

type Props = {
    slug: string;
    content_type: EditContentTypeEnum;
};

const QuickEditButton: FC<Props> = ({ slug, content_type }) => {
    const { isModerator } = useSession();
    const [open, setOpen] = useState(false);

    if (!isModerator()) return null;

    return (
        <Fragment>
            <Button
                type="button"
                variant="outline"
                size="icon-md"
                aria-label="Швидка правка"
                title="Швидка правка"
                onClick={() => setOpen(true)}
            >
                <Zap />
            </Button>
            <QuickEditModal
                slug={slug}
                content_type={content_type}
                open={open}
                onOpenChange={setOpen}
            />
        </Fragment>
    );
};

export default QuickEditButton;
