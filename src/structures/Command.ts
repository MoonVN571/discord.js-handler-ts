import { AutocompleteInteraction, ButtonInteraction, ChatInputApplicationCommandData, ModalSubmitInteraction, SlashCommandBuilder } from "discord.js";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import DiscordBot from "./DiscordBot";
import Context from "./Context";

export type CommandType = {
    slash?: boolean;
    prefix?: boolean;
};

export interface CommandOptions extends ChatInputApplicationCommandData {
    commandType?: CommandType;
    aliases?: string[];
    whitelist?: CommandWhitelist;
    category?: string;
}

export interface CommandWhitelist {
    developer?: boolean;
    admin?: boolean;
}

export default class Command {
	public client: DiscordBot;
    
	public name: string;
	public description: string;
	public options: CommandOptions | undefined;
	public cmdType: CommandType;
	public aliases?: string[];
	public whitelist?: CommandWhitelist;
	public category?: string;

	constructor(client: DiscordBot, options?: CommandOptions) {
		this.client = client;
		this.name = options.name;
		this.description = options.description;
		this.whitelist = options.whitelist;
		this.category = options.category;
		this.aliases = options.aliases;
		this.cmdType = options.commandType;
		this.options = options;
	}

	execute(_ctx: Context, _args?: string[]) {

	}

	autoCompleteExecute(_interaction: AutocompleteInteraction) {

	}

	buttonExecute(_interaction:ButtonInteraction){

	}

	modalExecute(_interaction: ModalSubmitInteraction){

	}

	build(client: DiscordBot, command: SlashCommandBuilder): SlashCommandBuilder | RESTPostAPIApplicationCommandsJSONBody {
		return command;
	}
}