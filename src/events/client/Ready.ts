import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { DiscordBot } from "../../structures";
import { Events } from "discord.js";
import { EventOptions } from "../../types";

export const data: EventOptions = {
	name: Events.ClientReady,
};

export async function execute(client: DiscordBot) {
	client.logger.info(`Logged in as ${client.user.tag}`);

	client.application.commands.set(client.commands.map(cmd => cmd.data).filter(cmd => !cmd.command?.prefix));

	await mongoose.connect(process.env.MONGO_STRING).then(() => {
		client.logger.info("Connected to MongoDB!");
	});
}