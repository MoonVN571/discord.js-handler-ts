import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { Bot } from "../../struct/Bot";

export async function execute(client: Bot) {
	client.logger.start(`Logged in as ${client.user.tag}`);

	/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
	client.application.commands.set(client.commands.map(cmd => cmd.data as any));

	await mongoose.connect(process.env.MONGO_STRING).then(() => {
		client.logger.start("Connected to MongoDB!");
	});
}