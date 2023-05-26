import EmailVerificationSender from "./NotificationService/Sender/EmailVerificationSender";
import ResetPasswordSender from "./NotificationService/Sender/ResetPasswordSender";
import { SenderInterface } from "./NotificationService/Sender/SenderInterface";
import NotificationEvent from "./NotificationService/NotificationEvent";
import ChangeEmailRequestSender from "./NotificationService/Sender/ChangeEmailRequestSender";

export default class NotificationService {
   
    public static async send(
        event: NotificationEvent,
        options: { [key: string]: any } = {}
    ): Promise<void> {
        let sender: SenderInterface | null = null;

        if (event.isEmailVerification()) {
            sender = new EmailVerificationSender();
        }

        if (event.isResetPasssword()) {
            sender = new ResetPasswordSender();
        }

        if (event.isChangeEmailRequest()) {
            sender = new ChangeEmailRequestSender();
        }

        if (sender === null) {
            throw new Error("sender could not recognized")
        }

        await sender.send(options);
    }
}
