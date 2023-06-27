import KeywordManager from "App/Service/KeywordManager";
import { Language } from "App/ValueObjects/Language";

import NotificationEvent from "../NotificationEvent";

export default class TitleGenerator {
    private km: KeywordManager;

    constructor() {
        this.km = new KeywordManager();
    }

    public async generate(
        language: Language,
        event: NotificationEvent,
        options: { [key: string]: any } = {}
    ): Promise<string> {
        let title = "";

        if (event.isEmailVerification()) {
            title = this.generateEmailVerification(language, options);
        }

        if (event.isResetPasssword()) {
            title = this.generateResetPassswordToken(language, options);
        }

        if (event.isChangeEmailRequest()) {
            title = this.generateChangeEmailRequest(language, options);
        }

        return new Promise((resolve) => {
            resolve(title);
        });
    }

    private generateEmailVerification(
        language: Language,
        _: { [key: string]: any }
    ): string {
        return this.km.get(language, "mail.title.email_verification");
    }

    private generateResetPassswordToken(
        language: Language,
        _: { [key: string]: any }
    ): string {
        return this.km.get(language, "mail.title.reset_password");
    }

    private generateChangeEmailRequest(
        language: Language,
        _: { [key: string]: any }
    ): string {
        return this.km.get(language, "mail.title.change_email_request");
    }
}
