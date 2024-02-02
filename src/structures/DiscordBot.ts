import dotenv from "dotenv";
dotenv.config();

import { Client, Collection } from "discord.js";
import { readdirSync } from "fs";
import winston from "winston";

import config from "../config.json";
import emojis from "../assets/emojis.json";

import { CommandOptions, Event } from "../types";
import { Utils, Commands } from "../functions";
import DailyRotateFile from "winston-daily-rotate-file";

export class DiscordBot extends Client {
	public commands: Collection<string, CommandOptions> = new Collection();
	public logger: winston.Logger;

	public dev = process.env.NODE_ENV == "development";
	public readonly emotes = emojis;
	public config = config;

	public utils = new Utils(this);
	public cmds = new Commands(this);

	public async start(): Promise<string> {
		const { timestamp, align, printf } = winston.format;
		this.logger = winston.createLogger({
			level: "debug",
			format: winston.format.combine(
				timestamp({ format: "DD-MM-YYYY hh:mm:ss.SSS A" }),
				align(),
				printf(info => `${info.timestamp} [${info.level}] ${info.message}`),
			),
			transports: [
				new DailyRotateFile({
					filename: "logs/log-%DATE%.log",
					datePattern: "DD-MM-YYYY",
					zippedArchive: true,
					maxSize: "20m",
					maxFiles: "14d",
				}),
				new winston.transports.Console(),
			]
		});

		this.loadCommands();
		this.loadEvents();
		this.antiCrash();

		return await this.login(process.env.TOKEN);
	}

	private antiCrash() {
		process.on("uncaughtException", (error) => {
			this.logger.error(error);
		});

		process.on("unhandledRejection", (reason, promise) => {
			this.logger.error(promise);
			this.logger.error(reason);
		});
	}

	private loadCommands() {
		const categories = readdirSync("./dist/commands");
		categories.forEach(category => {
			const commands = readdirSync(`./dist/commands/${category}`);
			commands.forEach(async cmdFile => {
				const cmdName = cmdFile.split(".")[0];
				const cmd: CommandOptions = await import(`../commands/${category}/${cmdName}`);
				cmd.data.category = category;
				this.commands.set(cmd.data.name, cmd);
			});
		});
	}

	private loadEvents() {
		readdirSync("./dist/events/client").forEach(async eventFile => {
			const eventName = eventFile.split(".")[0];
			const event: Event = await import(`../events/client/${eventName}`);
			if (!event) return this.logger.warn("Event " + eventName + " not found any data");
			this.on(event.data.name, (...p) => event.execute(this, ...p));
		});
	}
}
