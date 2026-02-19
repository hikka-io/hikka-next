import { HistoryResponse } from '@hikka/client';
import { FC } from 'react';

import MDViewer from '@/components/markdown/viewer/MD-viewer';

import { convertActivity } from '@/utils/adapters/convert-activity';

import FeedItemContentPreview from './feed-item-content-preview';

interface Props {
    data: HistoryResponse;
}

const FeedItemHistory: FC<Props> = ({ data }) => {
    const activity = convertActivity(data);

    return (
        <div className="flex flex-col gap-4 p-4 py-0">
            <FeedItemContentPreview
                contentType={data.content?.data_type}
                slug={data.content?.slug}
                title={data.content?.title}
            />
            {activity.length > 0 && (
                <MDViewer className="text-[0.9375rem]">
                    {activity.join(', ')}
                </MDViewer>
            )}
        </div>
    );
};

export default FeedItemHistory;
