import { Message } from "discord.js";
import { Bot } from "../../struct/Bot";
import type { CommandOptions } from "../../types";
import Context from "../../struct/Context";

export async function execute(client: Bot, message: Message) {
	if (message.author.bot) return;

	const prefix = client.config.prefix;
	if (!message.content.toLowerCase().startsWith(prefix)) {
		return;
	}

	const args = message.content.trim().slice(prefix.length).split(" ");
	const cmdName = args.shift().toLowerCase();

	const cmd: CommandOptions = client.commands.get(cmdName)
		|| client.commands.find((cmd: CommandOptions) => cmd.data.aliases && cmd.data.aliases.indexOf(cmdName) > -1);
	if (!cmd) return;

	const ctx = new Context(message);
	ctx.setArgs(args);

	client.cmds.sendCmdLog(ctx, message.content);
	if (!await client.cmds.canUserRunCommand(ctx, cmd)) return;

	cmd.execute(ctx, args);
}
