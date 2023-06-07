import { ActivityType, GatewayIntentBits, Partials } from "discord.js";
import { Bot } from "./struct/Bot";

const bot = new Bot({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates
	],
	presence: {
		status: "online",
		activities: [{ type: ActivityType.Watching, name: "" }]
	},
	partials: [Partials.Message, Partials.Message, Partials.GuildMember, Partials.User]
});

bot.start();