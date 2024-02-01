const createQueryString = (
    name: string,
    value: string | string[] | boolean,
    params: URLSearchParams,
) => {
    if (value) {
        if (Array.isArray(value)) {
            params.delete(name);
            value.forEach((v) => params.append(name, String(v)));
        } else {
            params.set(name, String(value));
        }
    } else {
        params.delete(name);
    }

    return params;
}

export default createQueryString;
