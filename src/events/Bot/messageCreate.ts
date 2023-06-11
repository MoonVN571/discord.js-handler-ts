import { Message } from "discord.js";
import { Bot } from "../../struct/Bot";
import type { CommandData } from "../../struct/Commands";
import Context from "../../struct/Context";

export async function execute(client: Bot, message: Message) {
	if (message.author.bot) return;

	const prefix: string = (client.dev ? "dev" : "") + client.config.prefix;
	if (!message.content.toLowerCase().startsWith(prefix)) {
		return;
	}

	const args: string[] = message.content.trim().slice(prefix.length).split(" ");
	const cmdName: string = args.shift().toLowerCase();

	const cmd: CommandData = client.commands.get(cmdName)
		|| client.commands.find((cmd: CommandData) => cmd.data.aliases && cmd.data.aliases.indexOf(cmdName) > -1);
	if (!cmd) return;

	const ctx = new Context(message, args);
	ctx.setArgs(args);

	client.cmds.sendCmdLog(ctx, message.content);
	if (!await client.cmds.canUserRunCommand(ctx, cmd, "prefix")) return;

	cmd.execute(ctx, args);
}
