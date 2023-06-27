import Base from "./Base";

export class PostReadTimeType extends Base {
    public static getResourceArray() {
        return [
            {
                id: 1,
                name: "sec",
                label: "second",
            },
            {
                id: 2,
                name: "mint",
                label: "minutes",
            },
            {
                id: 3,
                name: "hour",
                label: "hours",
            },
        ];
    }

    public static second(): PostReadTimeType {
        return this.fromName("sec");
    }

    public isSecond(): boolean {
        return this.getName() === "sec";
    }

    public static minute(): PostReadTimeType {
        return this.fromName("mint");
    }

    public isMinute(): boolean {
        return this.getName() === "mint";
    }

    public static hour(): PostReadTimeType {
        return this.fromName("hour");
    }

    public isHour(): boolean {
        return this.getName() === "hour";
    }
}
