import Order from "./OrderExtractor/Order";

export default class OrderExtractor {
    private defaultColumn: string;
    private defaultDirection: "asc" | "desc";

    private registeredColumns: string[];

    constructor(column: string, direction: "asc" | "desc") {
        this.defaultColumn = column;
        this.defaultDirection = direction;
    }

    public registerColumns(columns: string[]): void {
        this.registeredColumns = columns;
    }

    public defaultOrder(): Order {
        return new Order(this.defaultColumn, this.defaultDirection);
    }

    public createOrder(sort: string): Order {
        const words = sort.split(":");
        const column = words[0];
        const direction = words[1];

        if (words.length !== 2) {
            return this.defaultOrder();
        }

        if (!this.registeredColumns.includes(column)) {
            return this.defaultOrder();
        }

        if (direction !== "asc" && direction !== "desc") {
            return this.defaultOrder();
        }

        return new Order(column, direction);
    }
}
