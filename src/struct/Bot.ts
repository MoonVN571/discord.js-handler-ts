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
	public commands: Collection<string, CommandData> = new Collection();
	public logger: Logger = new Logger();

	public dev = process.env.NODE_ENV == "development";
	public readonly emotes = emojis;
	public config = config;

	public utils = new Utils(this);
	public cmds = new Commands(this);

	public async start(): Promise<string> {
		this.loadCommands();
		this.loadEvents();
		process.on("uncaughtException", (error) => {
			this.logger.error(error);
		});
		return await this.login(process.env.TOKEN);
	}

	public async loadCommands(): Promise<void> {
		const categories = readdirSync((this.dev ? "./src" : "./src") + "/commands");
		categories.map((category: "utils" | "developer") => {
			const commands = readdirSync((this.dev ? "./src" : "./src") + "/commands/" + category);
			commands.forEach(async cmdFile => {
				const cmdName = cmdFile.split(".")[0];
				const cmd: CommandData = await import(`../commands/${category}/${cmdName}`);
				cmd.data.category = category;
				if (this.dev) cmd.data.name = `${cmdName}dev`;
				this.commands.set(cmd.data.name, cmd);
			});
		});
	}

	public loadEvents(): void {
		readdirSync((this.dev ? "./src" : "./src") + "/events/Bot").forEach(async event => {
			const eventName = event.split(".")[0];
			const data = await import(`../events/Bot/${eventName}`);
			this.on(eventName, (...p) => data.execute(this, ...p));
		});
	}
}
