import MailSender from "App/ExternalService/MailSender/MailSender";
import MailGenerator from "../MailGenerator";
import NotificationEvent from "../NotificationEvent";
import { SenderInterface } from "./SenderInterface";
import UserRepository from "App/Domain/Repositories/Abstract/UserRepository";
import UserRepositoryImpl from 'App/Data/Repositories/UserRepositoryImpl';

export default class EmailVerificationSender implements SenderInterface {
    private userRepository: UserRepository;

    constructor(){
        this.userRepository = new UserRepositoryImpl();
    }

    public async send(options: { [key: string]: any } = {}): Promise<void> {
        const { userId, request,token } = options;

        if (userId === undefined) {
            return;
        }

        const userEntity = await this.userRepository.findById(userId);
        if (userEntity === null) {
            return;
        }

        const mailGenerator = new MailGenerator();
        const result = await mailGenerator.generate(
            userEntity.language,
            NotificationEvent.emailVerification(),
            {
                user: userEntity,
                token,
                request
            }
        );

        const mailSender = new MailSender();
        await mailSender.send(
            result.getTitle(),
            userEntity.email,
            result.getHtml(),
            result.getText()
        );
    }
}
