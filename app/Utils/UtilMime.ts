export default class UtilMime {
    /**
     * standard images are except svg file
     * @param mimeType
     * @returns
     */
    public static isStandardImage(mimeType: string): boolean {
        if (this.isSvg(mimeType)) {
            return false;
        }

        return mimeType.indexOf("image") !== -1;
    }

    public static isSvg(mimeType: string): boolean {
        return mimeType.indexOf("image/svg+xml") !== -1;
    }

    public static isAudio(mimeType: string): boolean {
        return mimeType.indexOf("audio") !== -1;
    }

    public static isVideo(mimeType: string): boolean {
        return mimeType.indexOf("video") !== -1;
    }

    public static isModel(mimeType: string) {
        return mimeType.indexOf("model") !== -1;
    }
}
