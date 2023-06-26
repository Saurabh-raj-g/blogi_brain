import Env from "@ioc:Adonis/Core/Env";
import Mail from "@ioc:Adonis/Addons/Mail";

const FROM_ADDRESS = `Blogi Brain <${Env.get("FROM_ADDRESS")}>`;

export default class MailSender {
    /**
     * @param title
     * @param toAddress
     * @param html
     * @param text
     * @param fromAddress
     */
    public async send(
        title: string,
        toAddress: string,
        html: string,
        text: string,
        fromAddress: string = FROM_ADDRESS
    ): Promise<void> {
        try {
            await Mail.use("smtp").send((message) => {
                message
                    .from(fromAddress, "BlogiBrain")
                    .to(toAddress)
                    .subject(title)
                    .html(html)
                    .text(text);
            });
        } catch (e) {
            throw new Error(`Failed to send email`);
        }
    }
}
