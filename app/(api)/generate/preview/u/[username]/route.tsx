import { createElement } from 'react';

import { ImageResponse } from 'next/og';

import getUserInfo from '@/services/api/user/getUserInfo';
import getWatchStats from '@/services/api/watch/getWatchStats';
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
                <div style={{ display: 'flex', gap: 32, width: '100%' }}>
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
                            width: '100%',
                            flex: 1,
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
                                textAlign: 'left',
                                width: '100%',
                                flex: 1
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
                            gap: 16,
                            width: '100%',

                        }}
                    >
                        {Object.keys(watchStats).map((stat, index) => (
                            <div
                                key={stat}
                                style={{
                                    display: 'flex',
                                    flex: 1,
                                    flexDirection: 'column',
                                    padding: '8px 16px',
                                    borderColor: 'rgba(39,39,42,0.6)',
                                    backgroundColor: 'rgba(39,39,42,0.3)',
                                    borderLeftWidth: 1,
                                    borderRadius: 8,
                                    borderWidth: 1,
                                }}
                            >

                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        width: 8,
                                        height: 8,
                                        borderRadius: '100%',
                                        backgroundColor: WATCH_STATUS[stat as Hikka.WatchStatus].color
                                    }} />
                                    <p
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 400,
                                            fontFamily: 'Inter',
                                            color: 'white',
                                            opacity: 0.6,
                                            lineHeight: '12px',
                                            flex: 1,
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
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontSize: 24,
                                            width: 16,
                                            height: 16,

                                        }}
                                    >
                                        {createElement(
                                            WATCH_STATUS[
                                                stat as Hikka.WatchStatus
                                            ].icon!,
                                        )}
                                    </div>
                                </div>
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