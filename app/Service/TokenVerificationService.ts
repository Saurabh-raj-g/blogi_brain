import { DateTime } from "luxon";
import crypto from "crypto";
export default class TokenVerificationService {
    public static async verify(
        oldToken: string,
        newToken: string,
        expiry: DateTime
    ): Promise<boolean> {
        const hashedToken = crypto
            .createHash("sha256")
            .update(newToken)
            .digest("hex");
        console.log(oldToken);
        console.log(hashedToken);

        if (oldToken !== hashedToken) {
            return false;
        }
        const count = expiry.diffNow().milliseconds;
        return count >= 0;
    }
}
