import {
	ApplicationCommandOption,
	AutocompleteInteraction,
	ButtonInteraction,
	PermissionsString
} from "discord.js";
import Context from "./Context";

export declare interface Command {
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
    aliases?: string[];
    command?: {
        slash?: boolean;
        prefix?: boolean;
    };
    whitelist?: Whitelist;
    defaultMemberPermissions?: PermissionsString[];
    category?: "developer" | "utils";
}

export interface Whitelist {
    developer?: boolean;
    admin?: boolean;
    guest?: boolean;
}

export declare interface CommandData {
    data: Command,
    execute: (ctx: Context, args: string[]) => void,
    autoComplete?: (interaction: AutocompleteInteraction) => void,
    buttonRun: (interaction: ButtonInteraction) => void
}