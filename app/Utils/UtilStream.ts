import { Readable } from "stream";
import { BufferableStream } from "./UtilStream/BufferableStream";

export default class UtilStream {
    public static async toString(
        stream: Readable,
        encoding: BufferEncoding
    ): Promise<string> {
        const chunks: Buffer[] = [];
        return new Promise((resolve, reject) => {
            stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on("error", (err) => reject(err));
            stream.on("end", () => {
                resolve(Buffer.concat(chunks).toString(encoding));
            });
        });
    }

    public static async toBuffer(stream: Readable): Promise<Buffer> {
        const bufferableStream = new BufferableStream();

        return new Promise((resolve, reject) => {
            stream
                .on("error", (error: Error) => {
                    bufferableStream.emit("error", error);
                })
                .pipe(bufferableStream)
                .on("finish", () => {
                    resolve(bufferableStream.toBuffer());
                })
                .on("error", (error: Error) => {
                    reject(error);
                });
        });
    }
}
