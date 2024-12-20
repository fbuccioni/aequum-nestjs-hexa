export function hidePasswords(data: any) {
    for (const key in data) {
        if (typeof data[key] === 'object')
            data[key] = hidePasswords(data[key]);
        else if (key.toLowerCase().includes('password'))
            data[key] = '********';
    }

    return data;
}
