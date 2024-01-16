import { createElement } from 'react';

import { ImageResponse } from 'next/og';

import getUserInfo from '@/utils/api/user/getUserInfo';
import getWatchStats from '@/utils/api/watch/getWatchStats';
import { WATCH_STATUS } from '@/utils/constants';

export const runtime = 'edge';

export async function GET(
    request: Request,
    { params: { username } }: { params: { username: string } },
) {
    const fixel = await fetch(
        new URL('/fonts/FixelDisplay-SemiBold.otf', import.meta.url),
    ).then((res) => res.arrayBuffer());
    const inter = await fetch(
        new URL('/fonts/Inter-Regular.ttf', import.meta.url),
    ).then((res) => res.arrayBuffer());

    const user = await getUserInfo({ username });
    const watchStats = await getWatchStats({ username });

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    fontSize: 16,
                    gap: 32,
                    color: 'white',
                    background: 'linear-gradient(180deg, #160820 0%, #000 60%, #000 100%)',
                    width: '100%',
                    height: '100%',
                    padding: '32px',
                    textAlign: 'center',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                }}
            >
                <div style={{ display: 'flex', gap: 32 }}>
                    <img
                        src={user.avatar}
                        width={256}
                        height={256}
                        style={{ borderRadius: 16 }}
                        alt="avatar"
                    />
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0,
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                        }}
                    >
                        <h1
                            style={{
                                fontSize: 36,
                                fontWeight: 600,
                                fontFamily: 'Fixel',
                                color: 'white',
                                lineHeight: '28px',
                            }}
                        >
                            {user.username}
                        </h1>
                        <p
                            style={{
                                fontSize: 24,
                                fontWeight: 400,
                                fontFamily: 'Inter',
                                color: 'white',
                                opacity: 0.6,
                                lineHeight: '12px',
                            }}
                        >
                            {user.description}
                        </p>
                    </div>
                </div>
                {watchStats && (
                    <div
                        style={{
                            display: 'flex',
                            overflow: 'hidden',
                            borderRadius: 8,
                            borderWidth: 1,
                            width: '100%',
                            borderColor: 'rgba(39,39,42,0.6)',
                            backgroundColor: 'rgba(39,39,42,0.3)',
                        }}
                    >
                        {Object.keys(watchStats).map((stat, index) => (
                            <div
                                key={stat}
                                style={{
                                    display: 'flex',
                                    flex: 1,
                                    flexDirection: 'column',
                                    padding: '8px 32px',
                                    borderLeftWidth: 1,
                                    borderColor:
                                        index !== 0
                                            ? 'rgba(39,39,42,0.6)'
                                            : 'transparent',
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: 24,
                                        fontWeight: 400,
                                        fontFamily: 'Inter',
                                        color: 'white',
                                        opacity: 0.6,
                                        lineHeight: '12px',
                                    }}
                                >
                                    {
                                        WATCH_STATUS[stat as Hikka.WatchStatus]
                                            .title_ua
                                    }
                                </p>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <h2
                                        style={{
                                            fontSize: 40,
                                            fontWeight: 600,
                                            fontFamily: 'Fixel',
                                            color: 'white',
                                            lineHeight: '24px',
                                        }}
                                    >
                                        {watchStats[stat as Hikka.WatchStatus]}
                                    </h2>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontSize: 24,
                                            width: 32,
                                            height: 32,
                                            borderRadius: 8,
                                            backgroundColor: '#27272a',
                                            padding: 4,
                                        }}
                                    >
                                        {createElement(
                                            WATCH_STATUS[
                                                stat as Hikka.WatchStatus
                                            ].icon,
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ),
        {
            width: 1112,
            height: 480,
            fonts: [
                {
                    name: 'Fixel',
                    data: fixel,
                    style: 'normal',
                    weight: 600,
                },
                {
                    name: 'Inter',
                    data: inter,
                    style: 'normal',
                    weight: 400,
                },
            ],
        },
    );
}