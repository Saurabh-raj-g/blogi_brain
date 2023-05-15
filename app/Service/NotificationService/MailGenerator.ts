import HtmlGenerator from "./MailGenerator/HtmlGenerator";
import TextGenerator from "./MailGenerator/TextGenerator";
import TitleGenerator from "./MailGenerator/TitleGenerator";
import NotificationEvent from "./NotificationEvent";
import Result from "./MailGenerator/Result";
import { Language } from "App/ValueObjects/Language";

export default class MailGenerator {
    private titleGenerator: TitleGenerator;
    private htmlGenerator: HtmlGenerator;
    private textGenerator: TextGenerator;

    constructor() {
        this.titleGenerator = new TitleGenerator();
        this.htmlGenerator = new HtmlGenerator();
        this.textGenerator = new TextGenerator();
    }

    public async generate(
        language: Language,
        event: NotificationEvent,
        options: { [key: string]: any } = {}
    ): Promise<Result> {
        const title = await this.titleGenerator.generate(
            language,
            event,
            options
        );
        const html = await this.htmlGenerator.generate(
            language,
            event,
            options
        );
        const text = await this.textGenerator.generate(
            language,
            event,
            options
        );

        return new Promise((resolve) => {
            resolve(new Result(title, `${html}`, `${text}`));
        });
    }
}
