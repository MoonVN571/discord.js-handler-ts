import { AutocompleteInteraction, Interaction } from "discord.js";
import dotenv from "dotenv";
import { Bot } from "../../struct/Bot";
import { CommandData } from "../../struct/Commands";
import Context from "../../struct/Context";
dotenv.config();

export async function execute(client: Bot, interaction: Interaction) {
	if (interaction.isAutocomplete()) {
		const cmd: CommandData = client.commands.get(interaction.commandName);
		if (cmd) cmd.autoComplete(interaction as AutocompleteInteraction);
	}

	if (interaction.isButton()) {
		const cmdName = interaction.customId.split(".")[0];
		const cmd: CommandData = client.commands.get(cmdName);
		if (cmd) cmd.buttonRun(interaction);
	}

	if (interaction.isChatInputCommand()) {
		const ctx = new Context(interaction, interaction.options.data.slice());
		ctx.setArgs(interaction.options.data.slice());

		const cmd: CommandData = client.commands.get(interaction.commandName + (client.dev ? "dev" : ""));
		if (!cmd) return;

		client.cmds.sendCmdLog(ctx);
		if (!await client.cmds.canUserRunCommand(ctx, cmd)) return;
		cmd.execute(ctx, ctx.args);
	}
}