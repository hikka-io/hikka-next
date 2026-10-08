import { useQuery } from '@tanstack/react-query';

import type { MainContentTypeEnum } from '@hikka/api';

import DescriptionBlock from '@/components/description-block';
import { contentInfoOptions } from '@/utils/api/content-queries';
import { useParams } from '@/utils/navigation';

type Props = {
    className?: string;
    content_type: MainContentTypeEnum;
};

const ContentDescription = ({ className, content_type }: Props) => {
    const params = useParams();
    const { data } = useQuery(
        contentInfoOptions(content_type, String(params.slug)),
    );

    if (!data) {
        return null;
    }

    return (
        <DescriptionBlock
            className={className}
            id="content-description"
            options={[
                {
                    value: 'synopsis_ua',
                    label: 'UA',
                    ariaLabel: 'Опис українською',
                    text: data.synopsis_ua,
                },
                {
                    value: 'synopsis_en',
                    label: 'EN',
                    ariaLabel: 'Опис англійською',
                    text: data.synopsis_en,
                },
            ]}
        />
    );
};

export default ContentDescription;
