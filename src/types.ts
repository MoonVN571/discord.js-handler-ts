import {
    AutocompleteInteraction,
    ButtonInteraction,
    ChatInputApplicationCommandData,
} from "discord.js";
import { Bot } from "./struct";
import Context from "./struct/Context";

export declare interface CommandData extends ChatInputApplicationCommandData {
    aliases?: string[];
    command?: {
        slash?: boolean;
        prefix?: boolean;
    };
    whitelist?: CommandWhitelist;
    category?: string;
}

export interface CommandWhitelist {
    developer?: boolean;
    admin?: boolean;
}

export declare interface CommandOptions {
    data: CommandData,
    execute?: (ctx: Context, args: string[]) => void,
    autoComplete?: (interaction: AutocompleteInteraction) => void,
    buttonRun?: (interaction: ButtonInteraction) => void
}

export declare interface Event {
    execute?: (client: Bot, ...args: string[]) => void
}