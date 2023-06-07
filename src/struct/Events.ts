import { Bot } from "./Bot";

export declare interface EventData {
    execute?: (client: Bot) => void;
}