import {
	ApplicationCommandOption,
	AutocompleteInteraction,
	ButtonInteraction,
	PermissionsString
} from "discord.js";
import { Bot } from "./struct";
import Context from "./struct/Context";

export declare interface CommandData {
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
    aliases?: string[];
    command?: {
        slash?: boolean;
        prefix?: boolean;
    };
    whitelist?: CommandWhitelist;
    defaultMemberPermissions?: PermissionsString[];
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