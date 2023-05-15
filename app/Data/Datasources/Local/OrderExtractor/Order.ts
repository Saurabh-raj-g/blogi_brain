export default class Order {
    private column: string;
    private direction: "asc" | "desc";

    constructor(column: string, direction: "asc" | "desc") {
        this.column = column;
        this.direction = direction;
    }

    public getColumn(): string {
        return this.column;
    }

    public getDirection(): "asc" | "desc" {
        return this.direction;
    }
}
