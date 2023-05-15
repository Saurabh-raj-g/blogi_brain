import { DateTime } from "luxon";
export default class TokenVerificationService {
    public static async verify(oldToken:string,newToken:string, expiry:DateTime):Promise<boolean>{
       if(oldToken !== newToken){
            return false;
        }
        const count = expiry.diffNow().milliseconds
        return count>=0;
    }
    
}