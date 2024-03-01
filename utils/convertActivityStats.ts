export const convertToDays = (data: API.Activity[]) => {
    if (data.length > 16) {
        return data.slice(data.length - 16, data.length);
    }

    if (data.length < 16) {
        const emplyArr = new Array(16 - data.length).fill({
            actions: 0,
            timestamp: 0,
        });
        return [...data, ...emplyArr];
    }

    return data;
};
