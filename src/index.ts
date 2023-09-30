import { ActivityType, GatewayIntentBits, Partials } from "discord.js";
import { Bot } from "./structures";

const bot = new Bot({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
	presence: {
		status: "online",
		activities: [{ type: ActivityType.Watching, name: "" }]
	},
	partials: [Partials.Channel, Partials.Reaction, Partials.Message, Partials.GuildMember, Partials.ThreadMember, Partials.User],
});

bot.start();