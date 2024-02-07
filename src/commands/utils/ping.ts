import { CommandData } from "../../types";
import { Context } from "../../structures";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";

export const data: CommandData = {
	name: "ping",
	description: "độ trễ của bot"
};

export async function execute(ctx: Context) {
	const Components = (disabled: boolean) => [new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId(data.name + ".button")
			.setLabel("Button")
			.setDisabled(disabled)
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId(data.name + ".modal")
			.setLabel("Modal")
			.setDisabled(disabled)
			.setStyle(ButtonStyle.Primary)
	)];

	await ctx.sendMessage({
		content: `${ctx.client.ws.ping}ms`,
		components: Components(false),
	});
}

export async function buttonExecute(interaction: ButtonInteraction) {
	const type = interaction.customId.split(".")[1];
	switch (type) {
		case "button": {
			await interaction.deferReply({ ephemeral: true });
			interaction.followUp("Hello button!");
		}
			break;
		case "modal": {
			const modal = new ModalBuilder()
				.setCustomId(`${data.name}.modal`)
				.setTitle("My Modal");

			modal.addComponents(
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					new TextInputBuilder()
						.setCustomId(`${data.name}.modal.input`)
						.setLabel("Input")
						.setPlaceholder("Something")
						.setStyle(TextInputStyle.Short)
						.setRequired(true),
				)
			);

			await interaction.showModal(modal);
		}
			break;
	}
}

export async function modalExecute(interaction: ModalSubmitInteraction) {
	const value = interaction.fields.fields.at(0).value;
	await interaction.deferReply({ ephemeral: true });
	interaction.followUp(`Your input is **${value}**!`);
}