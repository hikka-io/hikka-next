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
    /* const params = useParams();
    const { username } = params;
    const otherContentTypes = (
        Object.keys(TITLES) as (typeof content_type)[]
    ).filter((type) => type !== content_type); */

    return (
        <Header>
            <HeaderContainer className="gap-2">
                <HeaderTitle variant="h2">
                    Список {TITLES[content_type]}
                </HeaderTitle>

                {/* {otherContentTypes.map((type) => (
                    <Fragment key={type}>
                        <P className="opacity-30">/</P>
                        <HeaderTitle
                            href={`/u/${username}/list/${type}?status=completed&sort=${type === ContentTypeEnum.ANIME ? 'watch_score' : 'read_score'}`}
                            variant="h4"
                            className="text-primary-foreground font-normal"
                            key={type}
                        >
                            {TITLES[type]}
                        </HeaderTitle>
                    </Fragment>
                ))} */}
            </HeaderContainer>
        </Header>
    );
};

export default UserlistHeader;
