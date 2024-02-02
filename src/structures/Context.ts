import {
	CommandInteraction,
	Message,
	Guild,
	GuildMember,
	User,
	ChatInputCommandInteraction,
	ClientUser,
	TextChannel
} from "discord.js";
import { DiscordBot } from ".";
import { Utils, Commands } from "../functions";
import emojis from "../assets/emojis.json";
import config from "../config.json";

export default class Context {
	public ctx: CommandInteraction | Message;
	public isInteraction: boolean;
	public interaction: ChatInputCommandInteraction | null;
	public message: Message | null;
	public client: DiscordBot;
	public author: User;
	public channel: TextChannel;
	public guild: Guild | null;
	public member: GuildMember;
	public user: ClientUser;
	public args: string[] = [];
	public msg: Message;

	public utils: Utils;
	public cmds: Commands;

	public readonly emotes = emojis;
	public config = config;
	public readonly color = config.color;

	/* eslint-disable @typescript-eslint/no-explicit-any */

	constructor(ctx: any) {
		this.ctx = ctx;
		this.isInteraction = ctx instanceof CommandInteraction;
		this.interaction = this.isInteraction ? ctx : null;
		this.message = this.isInteraction ? null : ctx;
		this.client = ctx.client;
		this.author = ctx instanceof Message ? ctx.author : ctx.user;
		this.channel = ctx.channel;
		this.guild = ctx.guild;
		this.member = ctx.member;
		this.user = ctx.client.user;

		this.utils = this.client.utils;
		this.cmds = this.client.cmds;

		if (this.isInteraction) this.setArgs(this.cmds.getCmdData(this.interaction.options.data.slice()));
	}

	setArgs(args: any[]) {
		if (this.isInteraction) {
			this.args = args.map((arg: { value: any }) => arg.value);
		} else {
			this.args = args;
		}
	}

	public sendDev(err: string) {
		const msg = "Thông tin lỗi này đã được gửi đến dev, nếu bạn nghĩ đây là lỗi vui lòng liên hệ. \n**Lỗi:** ";
		if (this.deferred) {
			this.sendFollowUp(msg + err);
		} else if (this.message) {
			this.sendMessage(msg + err);
		}
	}

	public async getMember(userId: string): Promise<any> {
		const regex = /^<@!?(\d+)>$/;
		const match = userId.match(regex);
		if (match) userId = match[1];
		return new Promise((res) => {
			const member = this.guild?.members.cache.get(userId);
			if (member) res(member);
			else this.guild?.members.fetch(userId).then(res).catch(() => res(undefined));
		});
	}

	public async sendMessage(content: any) {
		if (this.isInteraction) {
			this.msg = await this.interaction?.reply(this.handleContent(content));
			return this.msg;
		} else if (this.message) {
			this.msg = await this.message.reply(this.handleContent(content));
			return this.msg;
		}
	}

	public async editMessage(content: any) {
		if (this.isInteraction) {
			if (this.msg) this.msg = await this.interaction?.editReply(this.handleContent(content));
			return this.msg;
		} else {
			if (this.msg) this.msg = await this.msg.edit(this.handleContent(content));
			return this.msg;
		}
	}

	public async sendDeferMessage(ephemeral: boolean) {
		if (this.isInteraction) {
			this.msg = await this.interaction?.deferReply({ fetchReply: true, ephemeral });
			return this.msg;
		}
	}

	public async sendFollowUp(content: any) {
		if (this.isInteraction) {
			await this.interaction?.followUp(content);
		} else if (this.message) {
			this.msg = await this.message.reply(this.handleContent(content));
		}
	}

	private handleContent(data: any) {
		if (typeof data === "string") {
			return { content: data, allowedMentions: { repliedUser: false } };
		}

		return { ...data, allowedMentions: { repliedUser: false } };
	}

	public get deferred() {
		if (this.isInteraction && this.interaction) {
			return this.interaction.deferred;
		}

		if (this.msg) return true;

		return false;
	}
}
