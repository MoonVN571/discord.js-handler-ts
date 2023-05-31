import { Guild } from "discord.js";
import { Bot } from "../../struct/Bot";

export async function execute(client: Bot, guild: Guild) {
	client.cmds.registerSlash(guild.id);
}