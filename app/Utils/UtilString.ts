import { Readable } from "stream";

export default class UtilString {
    public static async toReadStream(string: string): Promise<Readable> {
        return new Promise((resolve, reject) => {
            resolve(Readable.from([string]));
        });
    }

    public static splitToWords(string: string): string[] {
        const formattedString = string.replace(/　/g, " ");
        const rawWords = formattedString.split(" ");

        const words = rawWords.filter((rawWord) => {
            return rawWord !== "";
        });
        return words;
    }

    public static truncate(string: string | null, length: number): string {
        if (string === null) {
            return "";
        }
        return string.length > length
            ? string.substring(0, length) + "..."
            : string;
    }

    public static getStringOrNull(
        value: string | null | undefined
    ): string | null {
        if (value === undefined) {
            return null;
        }
        if (value === "") {
            return null;
        }
        return value;
    }

    public static isBase64Embedded(url: string): boolean {
        if (url.includes("data:") && url.includes(";base64,")) {
            return true;
        }
        return false;
    }

    public static extractBase64(url: string): string {
        if (!this.isBase64Embedded(url)) {
            return "";
        }
        const words = url.split(";base64,");
        return words[1];
    }

    public static isUtf8Embedded(url: string): boolean {
        if (url.includes("data:") && url.includes(";utf8,")) {
            return true;
        }
        return false;
    }

    public static extractUtf8(url: string): string {
        if (!this.isUtf8Embedded(url)) {
            return "";
        }
        const words = url.split(";utf8,");
        return words[1];
    }
}
