'use client';

import { useCollection } from '@hikka/react';
import { useParams } from 'next/navigation';

import MDViewer from '@/components/markdown/viewer/MD-viewer';
import TextExpand from '@/components/text-expand';
import { Badge } from '@/components/ui/badge';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

const CollectionTitle = () => {
    const params = useParams();
    const { data: collection } = useCollection({
        reference: String(params.reference),
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h2">
                            {collection?.title || 'Нова колекція'}
                        </HeaderTitle>
                    </HeaderContainer>
                </Header>
                <div className="flex gap-2 flex-wrap">
                    {collection!.spoiler && (
                        <Badge variant="warning">Спойлери</Badge>
                    )}
                    {collection!.nsfw && (
                        <Badge variant="destructive">+18</Badge>
                    )}

                    {collection!.tags.length > 0 &&
                        collection!.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                                {tag.toLowerCase()}
                            </Badge>
                        ))}
                </div>
            </div>
            {collection?.description && (
                <TextExpand>
                    <MDViewer className="text-sm text-muted-foreground">
                        {collection.description}
                    </MDViewer>
                </TextExpand>
            )}
        </div>
    );
};

export default CollectionTitle;
