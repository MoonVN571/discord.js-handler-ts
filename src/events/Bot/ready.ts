import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { Bot } from "../../structures";

export async function execute(client: Bot) {
	client.logger.info(`Logged in as ${client.user.tag}`);

	client.application.commands.set(client.commands.map(cmd => cmd.data).filter(cmd => !cmd.command?.prefix));

	await mongoose.connect(process.env.MONGO_STRING).then(() => {
		client.logger.info("Connected to MongoDB!");
	});
}