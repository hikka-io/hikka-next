import type { FC } from 'react';

import {
    ContentTypeEnum,
    type ReadContentTypeEnum,
    type ReadResponseBase,
    type WatchResponse,
    type WatchResponseBase,
} from '@hikka/api';

import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';
import { useTitle } from '@/features/auth/hooks/use-title';

import ReadEditModal from './read-edit-modal';
import WatchEditModal from './watch-edit-modal';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    slug: string;
    content: object | undefined;
} & (
    | {
          contentType: typeof ContentTypeEnum.ANIME;
          watch?: WatchResponse | WatchResponseBase;
      }
    | {
          contentType: ReadContentTypeEnum;
          read?: ReadResponseBase;
      }
);

const ListEntryEditDialog: FC<Props> = (props) => {
    const { open, onOpenChange, slug, content } = props;
    const title = useTitle(content);

    return (
        <ResponsiveModal open={open} onOpenChange={onOpenChange} mobile="page">
            <ResponsiveModalContent className="md:max-w-xl" title={title}>
                {props.contentType === ContentTypeEnum.ANIME ? (
                    <WatchEditModal
                        slug={slug}
                        watch={props.watch}
                        onClose={() => onOpenChange(false)}
                    />
                ) : (
                    <ReadEditModal
                        slug={slug}
                        content_type={props.contentType}
                        read={props.read}
                        onClose={() => onOpenChange(false)}
                    />
                )}
            </ResponsiveModalContent>
        </ResponsiveModal>
    );
};

export default ListEntryEditDialog;
