'use client';

import { ContentTypeEnum } from '@hikka/client';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

interface Props {
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const TITLES = {
    [ContentTypeEnum.ANIME]: 'аніме',
    [ContentTypeEnum.MANGA]: 'манґи',
    [ContentTypeEnum.NOVEL]: 'ранобе',
};

const UserlistHeader = ({ content_type }: Props) => {
    return (
        <Header>
            <HeaderContainer className="gap-2">
                <HeaderTitle variant="h2">
                    Список {TITLES[content_type]}
                </HeaderTitle>
            </HeaderContainer>
        </Header>
    );
};

export default UserlistHeader;
