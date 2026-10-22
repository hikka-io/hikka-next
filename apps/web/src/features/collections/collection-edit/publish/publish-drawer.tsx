import type { FC } from 'react';

import PreviewButton from '@/components/preview-button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
} from '@/components/ui/responsive-modal';

import { useCollectionContext } from '../collection-provider';
import { type CollectionSave, selectPreviewUrl } from '../use-collection-save';
import PublishSettings from './publish-settings';
import SaveButton from './save-button';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    save: CollectionSave;
};

const PublishDrawer: FC<Props> = ({ open, onOpenChange, save }) => {
    const previewUrl = useCollectionContext(selectPreviewUrl);

    return (
        <ResponsiveModal open={open} onOpenChange={onOpenChange}>
            <ResponsiveModalContent title="Публікація">
                <div className="flex flex-col gap-6 overflow-y-auto">
                    <PublishSettings />
                </div>
                <ResponsiveModalFooter className="flex-row">
                    <PreviewButton to={previewUrl} size="icon-md" />
                    <SaveButton save={save.save} className="flex-1" />
                </ResponsiveModalFooter>
            </ResponsiveModalContent>
        </ResponsiveModal>
    );
};

export default PublishDrawer;
