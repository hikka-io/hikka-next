import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

import { readYouTubeVideo } from '@hikka/core';

/** A YouTube thumbnail that loads the player on click, starting at the saved time. */
export function YouTubeEmbed({ url }: { url: string }) {
    const video = readYouTubeVideo(url);

    if (!video) {
        return (
            <div className="flex aspect-video items-center justify-center rounded-md bg-muted text-muted-foreground text-sm">
                Не вдалося показати відео
            </div>
        );
    }

    return (
        <LiteYouTubeEmbed
            id={video.id}
            title="Відео з YouTube"
            announce="Дивитися"
            params={video.start ? { start: video.start } : undefined}
            lazyLoad
            wrapperClass="yt-lite overflow-hidden rounded-md"
        />
    );
}
