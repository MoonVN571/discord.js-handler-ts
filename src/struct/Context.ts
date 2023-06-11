import {
	CommandInteraction,
	Message,
	APIInteractionGuildMember,
	Guild,
	GuildMember,
	User,
	ChatInputCommandInteraction,
	AutocompleteInteraction,
	ClientUser,
	GuildBasedChannel
} from "discord.js";
import { Bot } from "./Bot";
import emojis from "../assets/emojis.json";
import config from "../config.json";

import { Utils } from "../functions/Utils";

export default class Context {
	public ctx: CommandInteraction | Message | AutocompleteInteraction;
	public isInteraction: boolean;
	public interaction: ChatInputCommandInteraction | null;
	public message: Message | null;
	public id: string;
	public channelId: string;
	public client: Bot;
	public author: User;
	public channel: GuildBasedChannel;
	public guild: Guild | null;
	public member: APIInteractionGuildMember | GuildMember;
	public user: ClientUser;
	/* eslint-disable @typescript-eslint/no-explicit-any */
	public args: any[] = [];
	public msg: any;

	public utils: Utils;

	public readonly emotes = emojis;
	public config = config;
	public readonly color = config.color;

	constructor(ctx: any, args: any[]) {
		this.ctx = ctx;
		this.isInteraction = ctx instanceof CommandInteraction;
		this.interaction = this.isInteraction ? ctx : null;
		this.message = this.isInteraction ? null : ctx;
		this.id = ctx.id;
		this.channelId = ctx.channelId;
		this.client = ctx.client;
		this.author = ctx instanceof Message ? ctx.author : ctx.user;
		this.channel = ctx.channel;
		this.guild = ctx.guild;
		this.member = ctx.member;
		this.user = ctx.client.user;

		this.utils = this.client.utils;

		this.setArgs(args);
	}

	setArgs(args: any[]) {
		if (this.isInteraction) {
			this.args = args.map((arg: { value: any }) => arg.value);
		} else {
			this.args = args;
		}
	}

	public sendError(err: string) {
		const msg = "Thông tin lỗi này đã được gửi đến dev, nếu bạn nghĩ đây là lỗi vui lòng liên hệ. \n**Lỗi:**";
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
			else this.guild?.members.fetch(userId as string).then(res).catch(() => res(undefined));
		});
	}

	public async sendMessage(content: any) {
		if (this.isInteraction) {
			this.msg = this.interaction?.reply(this.handleContent(content));
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

	private handleContent(data: any): { content?: string, embeds?: any[], allowedMentions: { repliedUser: boolean } } {
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
