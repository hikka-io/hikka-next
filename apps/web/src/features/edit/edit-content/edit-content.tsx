import type { FC } from 'react';

import type { EditContentTypeEnum } from '@hikka/api';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

import type { EditMainContent } from '../types';
import Details from './components/details';
import General from './components/general';

type Props = {
    slug: string;
    content_type: EditContentTypeEnum;
    content?: EditMainContent;
};

const EditContent: FC<Props> = ({ slug, content_type, content }) => {
    if (!content) {
        return null;
    }

    const link = `${CONTENT_TYPE_LINKS[content_type]}/${slug}`;

    return (
        <Card className="p-0">
            <Block className="py-4">
                <Header
                    to={link}
                    linkProps={{ target: '_blank' }}
                    className="px-4"
                >
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Контент</HeaderTitle>
                    </HeaderContainer>
                    <HeaderNavButton />
                </Header>
                <div className="flex flex-col gap-4 px-4">
                    <General
                        content={content}
                        content_type={content_type}
                        slug={slug}
                    />
                    <div className="border-border border-t" />
                    <Details content={content} />
                </div>
            </Block>
        </Card>
    );
};

export default EditContent;
