export default class Result {
    private title: string;
    private html: string;
    private text: string;

    constructor(title: string, html: string, text: string) {
        this.title = title;
        this.html = html;
        this.text = text;
    }

    public getTitle(): string {
        return this.title;
    }

    public getHtml(): string {
        return this.html;
    }

    public getText(): string {
        return this.text;
    }
}
