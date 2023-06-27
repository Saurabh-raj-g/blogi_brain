import Base from "./Base";

export class Language extends Base {
    public static getResourceArray() {
        return [
            {
                id: 1,
                name: "en",
                label: "English",
            },
        ];
    }

    public static english(): Language {
        return this.fromName("en");
    }

    public isEnglish(): boolean {
        return this.getName() === "en";
    }
}
