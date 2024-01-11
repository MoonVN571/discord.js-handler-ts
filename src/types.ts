import {
	AutocompleteInteraction,
	ButtonInteraction,
	ChatInputApplicationCommandData,
	ModalSubmitInteraction,
} from "discord.js";
import { DiscordBot, Context } from "./structures";

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
    data: CommandData;
    execute?: (ctx: Context, args: string[]) => void;
    autoComplete?: (interaction: AutocompleteInteraction) => void;
    buttonRun?: (interaction: ButtonInteraction) => void;
    modalRun?: (interaction: ModalSubmitInteraction) => void;
}

export declare interface Event {
    execute?: (client: DiscordBot, ...args: string[]) => void;
}