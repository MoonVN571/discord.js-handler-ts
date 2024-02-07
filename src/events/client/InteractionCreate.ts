import { Events, Interaction } from "discord.js";
import { DiscordBot, Context } from "../../structures";
import { CommandOptions, EventOptions } from "../../types";

export const data: EventOptions = {
	name: Events.InteractionCreate,
};

export async function execute(client: DiscordBot, interaction: Interaction) {
	if (interaction.isAutocomplete()) {
		const cmd: CommandOptions = client.commands.get(interaction.commandName);
		if (cmd) cmd.autocompleteExecute(interaction);
	}

	if (interaction.isButton()) {
		const cmdName = interaction.customId.split(".")[0];
		const cmd = client.commands.get(cmdName);
		if (cmd) cmd.buttonExecute(interaction);
	}

	if (interaction.isModalSubmit()) {
		const cmdName = interaction.customId.split(".")[0];
		const cmd = client.commands.get(cmdName);
		if (cmd) cmd.modalExecute(interaction);
	}

	if (interaction.isChatInputCommand()) {
		const cmd = client.commands.get(interaction.commandName);
		if (!cmd) return;

		const ctx = new Context(interaction);
		client.cmds.sendCmdLog(ctx);

		if (!await client.cmds.canUserRunCommand(ctx, cmd)) return;
		cmd.execute(ctx, ctx.args);
	}
}