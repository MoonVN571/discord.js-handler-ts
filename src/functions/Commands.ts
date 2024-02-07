import { CommandOptions } from "../types";
import { DiscordBot, Context } from "../structures";
import { CacheType, CommandInteractionOption } from "discord.js";

export class Commands {
	public client: DiscordBot;
	constructor(client: DiscordBot) {
		this.client = client;
	}

	public async canUserRunCommand(ctx: Context, cmd?: CommandOptions): Promise<boolean> {
		const { whitelist } = cmd.data;
		const isDeveloper = this.client.config.developers.includes(ctx.author.id);
		const isAdmin = isDeveloper || ctx.member.permissions.has("Administrator");

		// No perm requirement
		if (!whitelist) return true;

		// Perm 
		if (isDeveloper && whitelist?.developer)
			return true;

		if (isAdmin && whitelist.admin)
			return true;

		ctx.sendMessage({
			embeds: [{
				description: "Bạn không thể dùng lệnh này!",
				color: ctx.config.color.error
			}],
			ephemeral: true
		});
		return false;
	}

	public async sendCmdLog(ctx: Context, msg?: string): Promise<void> {
		if (!msg) msg = `/${ctx.interaction.commandName} ${this.getSlashData(ctx.interaction.options.data.slice())}`;
		const username = `${ctx.author.displayName}`;
		this.client.logger.info(`[${ctx.guild?.name}] [${ctx.channel.name}] - ${username} (${ctx.author?.id}) : ${msg}`);
	}

	public getCmdData(data: CommandInteractionOption<CacheType>[]) {
		const result = data.reduce((accumulator: string, item) => {
			accumulator += item.name;
			if (item.options) {
				item.options.forEach(option => {
					if (option.value) accumulator += " " + option.value;

					if (option.options) option.options.forEach(nestedOption => {
						if (nestedOption.value) accumulator += " " + nestedOption.value;
					});
				});
			} else if (item.value) accumulator += " " + item.value;
			accumulator += " ";
			return accumulator;
		}, "");
		return result.trim().split(" ");
	}

	private getSlashData(data: CommandInteractionOption<CacheType>[]) {
		const result = data.reduce((accumulator: string, item) => {
			accumulator += item.name;
			if (item.options) {
				item.options.forEach(option => {
					accumulator += " " + option.name;
					if (option.value) accumulator += ":" + option.value;

					if (option.options) option.options.forEach(nestedOption => {
						accumulator += " " + nestedOption.name;
						if (nestedOption.value) accumulator += ":" + nestedOption.value;
					});
				});
			} else if (item.value || !isNaN(+item.value)) accumulator += ":" + item.value;
			accumulator += " ";
			return accumulator;
		}, "");
		return result;
	}
}