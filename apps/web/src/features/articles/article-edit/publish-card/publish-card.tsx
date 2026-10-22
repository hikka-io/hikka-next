import type { FC } from 'react';

import PreviewButton from '@/components/preview-button';
import Card from '@/components/ui/card';
import { FooterBar } from '@/components/ui/footer-bar';
import { Header, HeaderTitle } from '@/components/ui/header';
import { cn } from '@/utils/cn';

import { useArticleContext } from '../article-provider';
import { type ArticleSave, selectPreviewUrl } from '../use-article-save';
import ArticleVolume from './article-volume';
import CategoryPicker from './category-picker';
import PublishActions from './publish-actions';

type Props = {
    save: ArticleSave;
    className?: string;
};

const PublishCard: FC<Props> = ({ save, className }) => {
    const previewUrl = useArticleContext(selectPreviewUrl);

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
                <CategoryPicker />
                <ArticleVolume />
            </div>

            <FooterBar>
                <PublishActions save={save} />
            </FooterBar>
        </Card>
    );
};

export default PublishCard;
