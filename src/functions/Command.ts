import dotenv from "dotenv";
dotenv.config();

import { Bot } from "../struct/Bot";
import Context from "../struct/Context";

import { Command, CommandData } from "../struct/Commands";
import { GuildMember } from "discord.js";

export class Commands {
	public client: Bot;
	constructor(client: Bot) {
		this.client = client;
	}

	public registerSlash(guildId?: string) {
		const guild = this.client.guilds.cache.get(guildId as string);
		const commands: Command[] = [];
		this.client.commands.forEach((cmd: CommandData) => {
			if (cmd.data.command?.prefix) return;
			commands.push(cmd.data as Command);
		});
		if (guild) return guild.commands.set(commands);
		this.client.application?.commands.set([]);
		this.client.guilds.cache.forEach(guild => {
			guild.commands.set(commands);
		});
	}

	public async canUserRunCommand(ctx: Context, cmd?: CommandData, type?: "prefix" | undefined): Promise<boolean> {
		const isDeveloper: boolean = this.client.config.developers.indexOf(ctx.author?.id as string) > -1;
		const hasRole = async (roleId: string) => (ctx.member as GuildMember).roles.cache.has(roleId);
		const noPerm = () => ctx.sendMessage({
			embeds: [{
				description: "Bạn không thể dùng lệnh này!",
				color: ctx.config.color.error
			}],
			ephemeral: true
		});
		if (type == "prefix" && cmd.data.command?.slash) return false;
		if (!isDeveloper && cmd.data.whitelist?.developer) {
			noPerm();
			return false;
		}
		return true;
	}

	/* eslint-disable @typescript-eslint/no-explicit-any */
	public async sendCmdLog(ctx: Context, msg?: string): Promise<void> {
		if (!msg) msg = this.getSlashData(ctx.interaction.options.data as any);
		this.client.logger.info(`[${ctx.guild?.name}][${ctx.channel?.name}] - ${ctx.author?.tag} (${ctx.author?.id}) : ${msg} `);
	}

	private getSlashData(data: any[]) {
		let result = "";

		data.forEach((item: any) => {
			result += item.name;

			if (item.options) {
				item.options.forEach((option: any) => {
					result += " " + option.name;

					if (option.value) {
						result += ":" + option.value;
					}

					if (option.options) {
						option.options.forEach((nestedOption: any) => {
							result += " " + nestedOption.name;

							if (nestedOption.value) {
								result += ":" + nestedOption.value;
							}
						});
					}
				});
			} else if (item.value) {
				result += ":" + item.value;
			}

			result += " ";
		});

		// Xóa khoảng trắng cuối cùng
		result = result.trim();

		return result;
	}
}