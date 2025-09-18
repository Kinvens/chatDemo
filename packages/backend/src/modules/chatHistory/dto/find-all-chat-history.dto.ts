import {IsNotEmpty, IsNumberString} from "class-validator";


export class FindAllChatHistoryDto {
    @IsNotEmpty()
    @IsNumberString()
    chatId: string;
}