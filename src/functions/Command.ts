import dotenv from "dotenv";
dotenv.config();

import { Bot } from "../struct/Bot";
import Context from "../struct/Context";

import { Command, CommandData } from "../struct/Commands";
import { CacheType, CommandInteractionOption, GuildMember } from "discord.js";

export class Commands {
	public client: Bot;
	constructor(client: Bot) {
		this.client = client;
	}

	public async canUserRunCommand(ctx: Context, cmd?: CommandData, type?: "prefix" | undefined): Promise<boolean> {
		const isDeveloper: boolean = this.client.config.developers.indexOf(ctx.author?.id as string) > -1;
		const hasRole = (roleId: string) => (ctx.member as GuildMember).roles.cache.has(roleId);
		const noPerm = () => ctx.sendMessage({
			embeds: [{
				description: "Bạn không thể dùng lệnh này!",
				color: ctx.config.color.error
			}],
			ephemeral: true
		});
		const { whitelist, command } = cmd.data;
		if (isDeveloper && whitelist?.developer)
			return true;
		if (type == "prefix" && !command?.slash) return true;
		if (!whitelist) return true;
		noPerm();
		return false;
	}

	public async sendCmdLog(ctx: Context, msg?: string): Promise<void> {
		if (!msg) msg = `/${ctx.interaction.commandName} ${this.getSlashData(ctx.interaction.options.data.slice())}`;
		const username = `${ctx.author.tag.endsWith("#0") ? ctx.author.username : ctx.author.tag}`;
		this.client.logger.info(`[${ctx.guild?.name}] [${ctx.channel?.name}] - ${username} (${ctx.author?.id}) : ${msg}`);
		/*
		const space = "====================================";
		this.client.logger.info(`${space}`);
		this.client.logger.info(`Server: ${ctx.guild?.name}`);
		this.client.logger.info(`Channel:${ctx.channel?.name}`);
		this.client.logger.info(`Username: ${username}`);
		this.client.logger.info(`UserId: ${ctx.author?.id}`);
		this.client.logger.info(``);
		this.client.logger.info(`${msg}`);
		this.client.logger.info(`${space}`);
		*/
	}

	private getSlashData(data: CommandInteractionOption<CacheType>[]) {
		const result = data.reduce((accumulator: string, item) => {
			accumulator += item.name;

			if (item.options) {
				item.options.forEach(option => {
					accumulator += " " + option.name;

					if (option.value) accumulator += ":" + option.value;

					if (option.options) option.options.forEach((nestedOption: any) => {
						accumulator += " " + nestedOption.name;
						if (nestedOption.value) accumulator += ":" + nestedOption.value;
					});
				});
			} else if (item.value) {
				accumulator += ":" + item.value;
			}

			accumulator += " ";

			return accumulator;
		}, "");
		return result;
	}
}