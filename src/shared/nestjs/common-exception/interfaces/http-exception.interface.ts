import { JSONArray, JSONObject } from '../../../common/types/JSON.type';


interface HttpException {
    statusCode: number;
    description: string;
    message: string;
    code: string;
    errors?: JSONArray | JSONObject;
    input?: JSONObject;
}
