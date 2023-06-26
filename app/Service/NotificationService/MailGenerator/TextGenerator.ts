import Application from "@ioc:Adonis/Core/Application";

import * as Eta from "eta";
import NotificationEvent from "../NotificationEvent";

import { TextMailViewFormatter as UserFormatter } from "App/Controllers/ViewFormatters/User/TextMailViewFormatter";

import { Language } from "App/ValueObjects/Language";

export default class TextGenerator {
    constructor() {
        Eta.configure({
            views: Application.makePath("mail_templates"),
        });
    }

    public async generate(
        language: Language,
        event: NotificationEvent,
        options: { [key: string]: any } = {}
    ): Promise<string | void> {
        let text: string | void;

        if (event.isEmailVerification()) {
            text = await this.generateEmailVerification(language, options);
        }

        if (event.isResetPasssword()) {
            text = await this.generateResetPassswordToken(language, options);
        }

        if (event.isChangeEmailRequest()) {
            text = await this.generateChangeEmailRequest(language, options);
        }

        return new Promise((resolve) => {
            resolve(text);
        });
    }

    private async generateEmailVerification(
        language: Language,
        options: { [key: string]: any }
    ): Promise<string | void> {
        const { user, request, token } = options;

        if (user === undefined) {
            return new Promise((resolve) => {
                resolve("");
            });
        }

        const userFormatter = new UserFormatter();
        const userJson = userFormatter.toJson(user, token, language, request);

        const text = await Eta.renderFile(
            `./${language.getName()}/text/email_verification.eta`,
            {
                user: userJson,
            }
        );
        return new Promise((resolve) => {
            resolve(text);
        });
    }

    private async generateResetPassswordToken(
        language: Language,
        options: { [key: string]: any }
    ): Promise<string | void> {
        const { user, request, token } = options;

        if (user === undefined) {
            return new Promise((resolve) => {
                resolve("");
            });
        }

        const userFormatter = new UserFormatter();
        const userJson = userFormatter.toJson(user, token, language, request);

        const text = await Eta.renderFile(
            `./${language.getName()}/text/reset_password.eta`,
            {
                user: userJson,
            }
        );
        return new Promise((resolve) => {
            resolve(text);
        });
    }

    private async generateChangeEmailRequest(
        language: Language,
        options: { [key: string]: any }
    ): Promise<string | void> {
        const { user, request, token } = options;

        if (user === undefined) {
            return new Promise((resolve) => {
                resolve("");
            });
        }

        const userFormatter = new UserFormatter();
        const userJson = userFormatter.toJson(user, token, language, request);

        const text = await Eta.renderFile(
            `./${language.getName()}/text/change_email_request.eta`,
            {
                user: userJson,
            }
        );
        return new Promise((resolve) => {
            resolve(text);
        });
    }
}
