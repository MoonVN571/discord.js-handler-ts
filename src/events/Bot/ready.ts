import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { Bot } from "../../struct/Bot";

export async function execute(client: Bot) {
	client.logger.start("Bot started!");

	client.application.commands.set(client.commands.map(cmd => cmd.data));

	await mongoose.connect(process.env.MONGO_STRING).then(() => {
		client.logger.start("Connected to MongoDB!");
	});
}