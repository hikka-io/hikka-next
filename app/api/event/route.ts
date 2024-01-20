export async function POST(request: Request) {
    const data = {
        domain: 'hikka.io',
        name: 'pageview',
        url: request.url,
        referrer: request.referrer,
    };

    const headers = {
        'X-Forwarded-For': request.headers.get('x-forwarded-for')!,
        'User-Agent': request.headers.get('User-Agent')!,
        'Content-Type': 'application/json',
    };

    await fetch('https://analytics.hikka.io/api/event', {
        method: 'post',
        body: JSON.stringify(data),
        headers: headers,
    });

    return Response.json(
        {},
        {
            status: 202,
        },
    );
}