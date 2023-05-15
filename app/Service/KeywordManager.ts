import Application from "@ioc:Adonis/Core/Application";
import { Language } from "App/ValueObjects/Language";

export default class KeywordManager {
    private static instance: KeywordManager;

    private enJson: { [key: string]: string };
    

    public static getInstance(): KeywordManager {
        if (KeywordManager.instance !== undefined) {
            return this.instance;
        }
        this.instance = new this();
        return this.instance;
    }

    constructor() {
        this.enJson = require(`${Application.appRoot}/json/keywords_en.json`);
        
    }

    public get(language: Language, key: string): string {
        if (language.isEnglish()) {
            if (this.enJson[key] !== undefined) {
                return this.enJson[key];
            }
        }

        return this.enJson[key];
    }
}
