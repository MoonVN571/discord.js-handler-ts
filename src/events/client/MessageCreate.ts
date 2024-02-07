import { Events, Message } from "discord.js";
import { DiscordBot, Context } from "../../structures";
import type { EventOptions } from "../../types";

export const data: EventOptions = {
	name: Events.MessageCreate,
};

export async function execute(client: DiscordBot, message: Message) {
	if (message.author.bot) return;

	const prefix = client.config.prefix;
	if (!message.content.toLowerCase().startsWith(prefix))
		return;

	const args = message.content.trim().slice(prefix.length).split(/ +/);
	const cmdName = args.shift().toLowerCase();

	const cmd = client.commands.get(cmdName)
		|| client.commands.find((cmd) => cmd.data.aliases?.indexOf(cmdName) > -1);
	if (!cmd) return;

	const ctx = new Context(message);
	ctx.setArgs(args);

	client.cmds.sendCmdLog(ctx, message.content);
	if (!await client.cmds.canUserRunCommand(ctx, cmd)) return;

	cmd.execute(ctx, args);
}