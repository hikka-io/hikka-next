'use client';

import { useParams } from 'next/navigation';

import Block from '../../../../components/ui/block';
import Card from '../../../../components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderTitle,
} from '../../../../components/ui/header';
import useNovelInfo from '../../../../services/hooks/novel/use-novel-info';
import Chapters from './chapters';
import Magazines from './magazines';
import MediaType from './media-type';
import Status from './status';
import Volumes from './volumes';

const Details = () => {
    const params = useParams();

    const { data } = useNovelInfo({ slug: String(params.slug) });

    if (!data) {
        return null;
    }

    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle>Деталі</HeaderTitle>
                </HeaderContainer>
            </Header>
            <Card>
                <MediaType media_type={data.media_type} />
                <Status status={data.status} />
                <Volumes volumes={data.volumes} />
                <Chapters chapters={data.chapters} />
                <Magazines magazines={data.magazines} />
            </Card>
        </Block>
    );
};

export default Details;
