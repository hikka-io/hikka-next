const PLATFORM_ICONS: Record<string, string> = {
    'crunchyroll.com': '/icons/platforms/crunchyroll.png',
    'netflix.com': '/icons/platforms/netflix.png',
    'aniplus-asia.com': '/icons/platforms/aniplus.png',
    'aniplustv.com': '/icons/platforms/aniplus.png',
    'bilibili.tv': '/icons/platforms/bilibili.png',
    'bilibili.com': '/icons/platforms/bilibili.png',
    'catchplay.com': '/icons/platforms/catchplay.png',
    'youtube.com': '/icons/platforms/youtube.png',
    'iq.com': '/icons/platforms/iqiyi.png',
    'wetv.vip': '/icons/platforms/wetv.png',
    'anidb.net': '/icons/platforms/anidb.png',
    'animenewsnetwork.com': '/icons/platforms/ann.png',
    'mikai.me': '/icons/platforms/mikai.png',
    'anitube.in.ua': '/icons/platforms/anitube.png',
    'toloka.to': '/icons/platforms/toloka.png',
    'animeon.club': '/icons/platforms/animeon.png',
    'wikipedia.org': '/icons/platforms/wikipedia.png',
    'weibo.cn': '/icons/platforms/weibo.png',
    'douban.com': '/icons/platforms/douban.png',
    'baike.baidu.com': '/icons/platforms/baidu-baike.png',
    'bgm.tv': '/icons/platforms/bangumi.png',
    'moegirl.org.cn': '/icons/platforms/moegirl.png',
    'gamer.com.tw': '/icons/platforms/bahamut.png',
};

export function getPlatformIcon(url: string): string | null {
    try {
        const { hostname } = new URL(url);

        for (const domain in PLATFORM_ICONS) {
            if (hostname === domain || hostname.endsWith('.' + domain)) {
                return PLATFORM_ICONS[domain];
            }
        }
    } catch {
        // invalid URL
    }

    return null;
}
