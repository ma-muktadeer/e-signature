import { app } from "./App";
import { Constants } from "./Constants";

export class Softcafe {

    public static usre = {}

    public app = app;

    public isOK(response: any) : boolean{
        return response.header.status == Constants.STR_OK;
    }
    public getErrorMsg(response: any) : any{
        return response?.header?.errorMsg ?? response;
    }

 
    

}