import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { Bot } from "../../struct/Bot";

export async function execute(client: Bot) {
	client.logger.start("Bot started!");

	client.cmds.registerSlash();

	/* eslint-disable no-undef */
	await mongoose.connect(process.env.MONGO_STRING as string).then(() => {
		client.logger.start("Connected to MongoDB!");
	});

}