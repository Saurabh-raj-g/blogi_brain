import { v4 as uuidv4 } from "uuid";

export default class UuidIssuer {
    public static issue(): string {
        return uuidv4();
    }
}
