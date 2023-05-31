import dotenv from "dotenv";
dotenv.config();

import { Client, Collection } from "discord.js";
import { readdirSync } from "fs";

import Logger from "./Logger";
import config from "../config.json";
import emojis from "../assets/emojis.json";

import { CommandData } from "./Commands";
import { Commands } from "../functions/Command";
import { Utils } from "../functions/Utils";

export class Bot extends Client {
	/* eslint-disable @typescript-eslint/no-explicit-any */
	public commands: Collection<string, any> = new Collection();
	public logger: Logger = new Logger();

	public dev = process.env.NODE_ENV == "development";
	public readonly emotes = emojis;
	public config = config;

	public utils = new Utils(this);
	public cmds = new Commands(this);

	public async start(): Promise<string> {
		this.loadCommands();
		this.loadEvents();
		/* eslint-disable no-undef */
		process.on("uncaughtException", (error) => {
			this.logger.error(error);
		});
		return await this.login(process.env.TOKEN);
	}

	public async loadCommands(): Promise<void> {
		const categories: string[] = readdirSync("./src/commands");
		await Promise.all(categories.map(async (category: string) => {
			const commands = readdirSync("./src/commands/" + category);
			await Promise.all(commands.map(async (cmd: string) => {
				let cmdName = cmd.split(".")[0];
				if (!this.dev) cmdName = cmdName + ".js";
				const data: CommandData = await import(`../commands/${category}/${cmdName}`);
				if (!data) return;
				const command: any = { ...data, category };
				this.commands.set(data.data.name, command);
			}));
		}));
	}

	public loadEvents(): void {
		readdirSync("./src/events/Bot").forEach(async (event: any) => {
			const eventName = event.split(".")[0];
			const { execute } = await import(`../events/Bot/${eventName}`);
			if (typeof execute !== "function") return;
			this.on(eventName, (...p) => execute(this, ...p));
		});
	}
}
