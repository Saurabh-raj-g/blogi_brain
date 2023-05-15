export default class OptionExtractor {
    /**
     * @param options
     * @returns
     */
    public static extractAppendFlag(options?: { [key: string]: any }): boolean {
        let append = true;
        if (options !== undefined && options["append"] !== undefined) {
            append = !!options["append"];
        }
        return append;
    }
}
