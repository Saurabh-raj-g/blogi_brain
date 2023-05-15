export type SenderInterface = {
    //checkIfNeedToSend(options: { [key: string]: any }): Promise<boolean>;
    send(options: { [key: string]: any }): Promise<void>;
};
