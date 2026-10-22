import type { FC } from 'react';

import PreviewButton from '@/components/preview-button';
import Card from '@/components/ui/card';
import { FooterBar } from '@/components/ui/footer-bar';
import { Header, HeaderTitle } from '@/components/ui/header';
import { cn } from '@/utils/cn';

import { useCollectionContext } from '../collection-provider';
import { type CollectionSave, selectPreviewUrl } from '../use-collection-save';
import PublishSettings from './publish-settings';
import SaveButton from './save-button';

type Props = {
    save: CollectionSave;
    className?: string;
};

const PublishCard: FC<Props> = ({ save, className }) => {
    const previewUrl = useCollectionContext(selectPreviewUrl);

    return (
        <Card className={cn('gap-0 p-0', className)}>
            <Header className="border-b px-4 py-3">
                <HeaderTitle as="h2" size="subsection">
                    Публікація
                </HeaderTitle>
                <div className="ml-auto">
                    <PreviewButton to={previewUrl} />
                </div>
            </Header>

            <div className="flex flex-col gap-8 p-4 py-8">
                <PublishSettings />
            </div>

            <FooterBar>
                <SaveButton save={save.save} className="w-full" />
            </FooterBar>
        </Card>
    );
};

export default PublishCard;
