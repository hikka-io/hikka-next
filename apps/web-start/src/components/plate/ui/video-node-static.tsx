import type { SlateElementProps } from 'platejs/static';
import { SlateElement } from 'platejs/static';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';

import { cn } from '@/utils/cn';
import { extractYouTubeVideoId } from '@/utils/youtube';

export interface VideoElementStaticProps extends SlateElementProps {
    className?: string;
    url?: string;
}

export function VideoElementStatic({
    className,
    element,
    ...props
}: VideoElementStaticProps) {
    const url = (element as any)?.url || '';
    const videoId = extractYouTubeVideoId(url);

    if (!videoId) {
        return (
            <SlateElement {...props} element={element}>
                <div className={cn('mb-4', className)}>
                    <div className="flex aspect-video items-center justify-center rounded-md bg-muted text-muted-foreground">
                        Invalid video URL
                    </div>
                </div>
            </SlateElement>
        );
    }

    return (
        <SlateElement
            as="div"
            {...props}
            element={element}
            className={cn('mb-4', className)}
        >
            <LiteYouTubeEmbed
                id={videoId}
                title="youtube"
                wrapperClass={cn(
                    'z-20 aspect-video rounded-md',
                    'relative block cursor-pointer bg-black bg-cover bg-center [contain:content]',
                    '[&.lyt-activated]:before:absolute [&.lyt-activated]:before:top-0 [&.lyt-activated]:before:h-[60px] [&.lyt-activated]:before:w-full [&.lyt-activated]:before:bg-top [&.lyt-activated]:before:bg-repeat-x [&.lyt-activated]:before:pb-[50px] [&.lyt-activated]:before:[transition:all_0.2s_cubic-bezier(0,_0,_0.2,_1)]',
                    '[&.lyt-activated]:before:bg-[url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==)]',
                    'after:block after:pb-[var(--aspect-ratio)] after:content-[""]',
                    '[&_>_iframe]:absolute [&_>_iframe]:left-0 [&_>_iframe]:top-0 [&_>_iframe]:size-full',
                    '[&_>_.lty-playbtn]:z-1 [&_>_.lty-playbtn]:h-[46px] [&_>_.lty-playbtn]:w-[70px] [&_>_.lty-playbtn]:rounded-[14%] [&_>_.lty-playbtn]:bg-[#212121] [&_>_.lty-playbtn]:opacity-80 [&_>_.lty-playbtn]:[transition:all_0.2s_cubic-bezier(0,_0,_0.2,_1)]',
                    '[&:hover_>_.lty-playbtn]:bg-[red] [&:hover_>_.lty-playbtn]:opacity-100',
                    '[&_>_.lty-playbtn]:before:border-y-[11px] [&_>_.lty-playbtn]:before:border-l-[19px] [&_>_.lty-playbtn]:before:border-r-0 [&_>_.lty-playbtn]:before:border-[transparent_transparent_transparent_#fff] [&_>_.lty-playbtn]:before:content-[""]',
                    '[&_>_.lty-playbtn]:absolute [&_>_.lty-playbtn]:left-1/2 [&_>_.lty-playbtn]:top-1/2 [&_>_.lty-playbtn]:[transform:translate3d(-50%,-50%,0)]',
                    '[&_>_.lty-playbtn]:before:absolute [&_>_.lty-playbtn]:before:left-1/2 [&_>_.lty-playbtn]:before:top-1/2 [&_>_.lty-playbtn]:before:[transform:translate3d(-50%,-50%,0)]',
                    '[&.lyt-activated]:cursor-[unset]',
                    '[&.lyt-activated]:before:pointer-events-none [&.lyt-activated]:before:opacity-0',
                    '[&.lyt-activated_>_.lty-playbtn]:opacity-0! [&.lyt-activated_>_.lty-playbtn]:pointer-events-none',
                )}
            />
        </SlateElement>
    );
}
