interface AnimeCatalogRequest {
    query?: string;
    sort?: string[];
    page?: number;
    years?: [number, number];
    score?: [number, number];
    media_type?: string[];
    rating?: string[];
    status?: string[];
    source?: string[];
    season?: string[];
    producers?: string[];
    studios?: string[];
    genres?: string[];
}

export default async function getAnimeCatalog(params: AnimeCatalogRequest) {
    const res = await fetch('https://testapi.hikka.io/anime/', {
        method: 'post',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(params),
    });
    return res.json();
}
