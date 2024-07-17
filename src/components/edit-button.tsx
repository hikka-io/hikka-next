import clsx from 'clsx';
import { FC } from 'react';
import MaterialSymbolsEditRounded from '~icons/material-symbols/edit-rounded';

import { Button } from '@/components/ui/button';

import EditListModal from '@/features/modals/editlist-modal/editlist-modal';

import { useModalContext } from '@/services/providers/modal-provider';

interface Props {
    slug: string;
    content_type: API.ContentType;
    className?: string;
}

const EditButton: FC<Props> = ({ className, slug, content_type }) => {
    const { openModal } = useModalContext();

    return (
        <Button
            variant="outline"
            size="icon-xs"
            onClick={() =>
                openModal({
                    content: (
                        <EditListModal
                            content_type={content_type}
                            slug={slug}
                        />
                    ),
                    type: 'sheet',
                    title: 'Список правок',
                })
            }
            className={clsx(className)}
        >
            <MaterialSymbolsEditRounded />
        </Button>
    );
};

export default EditButton;
