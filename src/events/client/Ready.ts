import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { Events } from "discord.js";
import { DiscordBot, Event } from "../../structures";

export default class Ready extends Event {
	public client: DiscordBot;

	constructor(client: DiscordBot) {
		super(client, {
			name: Events.ClientReady,
			once: true,
		});
		this.client = client;
	}

	async execute(client: DiscordBot) {
		client.logger.info(`Logged in as ${client.user.tag}`);

		const commands = client.commands.filter(cmd => !cmd.cmdType?.prefix).map(cmd => cmd.options);
		this.client.application.commands.set(commands);

		await mongoose.connect(process.env.MONGO_STRING).then(() => {
			client.logger.info("Connected to MongoDB!");
		});
	}
}