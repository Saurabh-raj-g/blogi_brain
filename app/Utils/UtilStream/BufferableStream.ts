import { Writable, WritableOptions } from "stream";

export type Bufferable = {
    toBuffer(): Buffer;
};

export class BufferableStream extends Writable implements Bufferable {
    private readonly chunks: any[];

    constructor(opts?: WritableOptions) {
        super(opts);
        this.chunks = [];
    }

    public toBuffer(): Buffer {
        return this.chunksToBuffer();
    }

    public _write(
        chunk: any,
        encoding: BufferEncoding,
        callback: (error?: Error | null | undefined) => void
    ): void {
        this.chunks.push(chunk);
        callback();
    }

    private chunksToBuffer(): Buffer {
        return Buffer.concat(this.chunks);
    }
}
