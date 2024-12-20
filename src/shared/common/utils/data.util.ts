export function hidePasswords(data: any) {
    for (const key in data) {
        if (typeof data[key] === 'object')
            data[key] = hidePasswords(data[key]);
        else if (key.toLowerCase().includes('password'))
            data[key] = '********';
    }

    return data;
}

export function objectFromDotNotation(dotNotation: string, obj?: any, value?: any) {
    if (!obj) obj = {};
    const parts = dotNotation.split('.');
    const last = parts.pop();

    parts.reduce((acc, part) => acc[part] = acc[part] || {}, obj)[last] = value;

    return obj;
}

/*
* Deep merge objects.
* from https://stackoverflow.com/a/48218209/742249
*
* @param - Objects to merge
* @returns - New object with merged key/values
*/
export function mergeDeep(...objects: any[]): any {
    const isObject = obj => obj && typeof obj === 'object';

    return objects.reduce((prev, obj) => {
        Object.keys(obj).forEach(key => {
            const pVal = prev[key];
            const oVal = obj[key];

            if (Array.isArray(pVal) && Array.isArray(oVal)) {
                prev[key] = pVal.concat(...oVal);
            }
            else if (isObject(pVal) && isObject(oVal)) {
                prev[key] = mergeDeep(pVal, oVal);
            }
            else {
                prev[key] = oVal;
            }
        });

        return prev;
    }, {});
}
