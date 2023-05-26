import Base from "App/ValueObjects/Base";

export default class NotificationEvent extends Base {
    public static getResourceArray() {
        return [
            {
                id: 1,
                name: "emailVerification",
                label: "Email Verification",
                description: "Notifies to the user issues email verification",
            },
            {
                id: 2,
                name: "resetPasssword",
                label: "Reset Password",
                description: "Notifies to the user reset password",
            },
            {
                id: 3,
                name: "changeEmailRequest",
                label: "Change Email Request",
                description: "Notifies to the user change email request",
            },
        ];
    }

    public getDescription(): string {
        return this.resource["description"] as string;
    }

    public static resetPasssword(): NotificationEvent {
        return this.fromName("resetPasssword");
    }

    public static emailVerification(): NotificationEvent {
        return this.fromName("emailVerification");
    }

    public static changeEmailRequest(): NotificationEvent {
        return this.fromName("changeEmailRequest");
    }

    public isEmailVerification(): boolean {
        return this.getName() === "emailVerification";
    }

    public isResetPasssword(): boolean {
        return this.getName() === "resetPasssword";
    }

    public isChangeEmailRequest(): boolean {
        return this.getName() === "changeEmailRequest";
    }

    public toJsonForGeneral(): { [key: string]: string | number | boolean } {
        return {
            id: this.getId(),
            name: this.getName(),
            label: this.getLabel(),
            description: this.getDescription(),
        };
    }
}
