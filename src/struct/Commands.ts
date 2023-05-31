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
    category?: "booking" | "developer" | "moderator" | "supporter" | "utils";
}

export interface Whitelist {
    developer?: boolean;
    admin?: boolean;
    adminJr?: boolean;
    guest?: boolean;
}

export declare interface CommandData {
    data: Command,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    execute: (ctx: Context, args: string[]) => any,
    autoComplete?: (interaction: AutocompleteInteraction) => any,
    buttonRun: (interaction: ButtonInteraction) => any
}