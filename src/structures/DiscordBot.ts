import dotenv from "dotenv";
dotenv.config();

import { Client, Collection } from "discord.js";
import { readdirSync } from "fs";
import winston from "winston";

import config from "../config.json";
import emojis from "../assets/emojis.json";

import { Utils, Commands } from "../functions";
import DailyRotateFile from "winston-daily-rotate-file";
import Command from "./Command";
import { Event } from ".";

export default class DiscordBot extends Client {
	public commands: Collection<string, Command> = new Collection();
	public logger: winston.Logger;

	public dev = process.env.NODE_ENV == "development";
	public readonly emotes = emojis;
	public config = config;

	public utils = new Utils(this);
	public cmds = new Commands(this);

	public async start(): Promise<string> {
		const { timestamp, align } = winston.format;
		const print = winston.format.printf((info) => {
			const log = `${info.timestamp} [${info.level}] ${info.message}`;

			return info.stack
				? `${log}\n${info.stack}`
				: log;
		});
		const transports: winston.transport[] = [
			new winston.transports.Console(),
		];
		if (process.env.NODE_ENV !== "development") {
			transports.push(
				new DailyRotateFile({
					filename: "logs/log-%DATE%.log",
					datePattern: "DD-MM-YYYY",
					zippedArchive: true,
					maxSize: "20m",
					maxFiles: "14d",
				})
			);
		}
		this.logger = winston.createLogger({
			level: "debug",
			format: winston.format.combine(
				winston.format.errors({ stack: true }),
				timestamp({ format: "DD-MM-YYYY hh:mm:ss.SSS A" }),
				align(),
				print,
			),
			transports,
		});

		await this.loadCommands();
		await this.loadEvents();
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

	private async loadCommands() {
		const categories = readdirSync("./dist/commands");
		for (const category of categories) {
			const commands = readdirSync(`./dist/commands/${category}`);
			for (const cmdFile of commands) {
				const cmdName = cmdFile.split(".")[0];
				const cmdStruct = await import(`../commands/${category}/${cmdName}.js`);
				const cmd = new cmdStruct.default(this) as Command;

				cmd.category = category;
				this.commands.set(cmd.name, cmd);
			}
		}
	}

	private async loadEvents() {
		const events = readdirSync("./dist/events/client");
		for (const eventFile of events) {
			const eventName = eventFile.split(".")[0];
			const eventStruct = await import(`../events/client/${eventName}.js`);
			const event = new eventStruct.default(this) as Event;

			if (!event) {
				this.logger.warn("Event " + eventName + " not found any data");
			} else {
				event.register(this);
			}
		}
	}
}
