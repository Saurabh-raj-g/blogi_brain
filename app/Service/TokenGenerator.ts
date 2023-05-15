import crypto from "crypto";
export default class TokenGenerator {
   
    public static async generate():Promise<string>{
        // Generating Token
        const resetToken = crypto.randomBytes(20).toString("hex");
        return resetToken;
    }
    
}
