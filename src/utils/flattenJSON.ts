type JSONObject = { [key: string]: any };

const flattenJSON = (obj: JSONObject = {}, res: JSONObject = {}, extraKey: string = ''): JSONObject => {
    for (const key in obj) {
        if (typeof obj[key] !== 'object' || obj[key] === null) {
            res[`${extraKey}${key}`] = obj[key];
        } else {
            flattenJSON(obj[key], res, `${extraKey}${key}.`);
        }
    }
    return res;
};

export default flattenJSON;