import dotenv from "dotenv";
dotenv.config();

import { Bot } from "../struct/Bot";
import Context from "../struct/Context";

import { Command, CommandData } from "../struct/Commands";
import axios from "axios";
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
		const needSetup = () => ctx.sendMessage({
			embeds: [{
				description: "Server chưa thiết lập roles.",
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

	public async sendCmdLog(ctx: Context, msg: string | object): Promise<void> {
		this.client.logger.info(`[${ctx.guild?.name}][${ctx.channel?.name}] - ${ctx.author?.tag} (${ctx.author?.id}) : ${msg} `);
		if (ctx.client.dev) return;

		const post = () => axios({ /* eslint-disable no-undef */
			method: "post",
			url: process.env.LOGS_URL,
			headers: {
				"Content-Type": "application/json"
			},
			params: {
				send_to: ctx.client.config.logs.commands,
				dev: ctx.client.dev,
				log_level: "commands",
				bot_user: { id: ctx.client.user?.id, tag: ctx.client.user?.tag },
				user: { id: ctx.author?.id, tag: ctx.author?.tag },
				channel: { id: ctx.channel?.id, name: ctx.channel?.name },
				guild: { id: ctx.guild?.id, name: ctx.guild?.name, iconURL: ctx.guild?.iconURL() },
				msg: `${msg} `,
				time: Date.now()
			}
		}).catch(err => this.client.logger.error(err.message));

		post();
	}
}