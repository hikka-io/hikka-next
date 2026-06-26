import DescriptionBlock from '@/components/description-block';
import { CONTENT_CONFIG } from '@/utils/constants/common';
import { useParams } from '@/utils/navigation';

type Props = {
    className?: string;
    content_type: 'anime' | 'manga' | 'novel';
};

const Description = ({ className, content_type }: Props) => {
    const params = useParams();
    const { data } = CONTENT_CONFIG[content_type].useInfo(String(params.slug));

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

export default Description;
