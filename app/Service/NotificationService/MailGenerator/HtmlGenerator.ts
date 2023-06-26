import Application from "@ioc:Adonis/Core/Application";
import Env from "@ioc:Adonis/Core/Env";

import * as Eta from "eta";
import NotificationEvent from "../NotificationEvent";

import { HtmlMailViewFormatter as UserFormatter } from "App/Controllers/ViewFormatters/User/HtmlMailViewFormatter";

import { Language } from "App/ValueObjects/Language";

export default class HtmlGenerator {
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
        let html: string | void;

        if (event.isEmailVerification()) {
            html = await this.generateEmailVerification(language, options);
        }

        if (event.isResetPasssword()) {
            html = await this.generateResetPassswordToken(language, options);
        }

        if (event.isChangeEmailRequest()) {
            html = await this.generateChangeEmailRequest(language, options);
        }

        return new Promise((resolve) => {
            resolve(html);
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

        const html = await Eta.renderFile(
            `./${language.getName()}/html/email_verification.eta`,
            {
                user: userJson,
            }
        );
        return html;
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

        const html = await Eta.renderFile(
            `./${language.getName()}/html/reset_password.eta`,
            {
                user: userJson,
            }
        );
        return html;
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

        const html = await Eta.renderFile(
            `./${language.getName()}/html/change_email_request.eta`,
            {
                user: userJson,
            }
        );
        return html;
    }
}
