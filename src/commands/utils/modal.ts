import { Command, Context, DiscordBot } from "../../structures";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";

export default class ModalCommand extends Command {
	constructor(client: DiscordBot) {
		super(client, {
			name: "modal",
			description: "Modal example",
		});
	}

	async execute(ctx: Context) {
		const Components = (disabled: boolean) => [new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId(this.name + ".button")
				.setLabel("Button")
				.setDisabled(disabled)
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId(this.name + ".modal")
				.setLabel("Modal")
				.setDisabled(disabled)
				.setStyle(ButtonStyle.Primary)
		)];

		await ctx.sendMessage({
			components: Components(false),
		});
	}

	async buttonExecute(interaction: ButtonInteraction<CacheType>): Promise<void> {
		const type = interaction.customId.split(".")[1];
		switch (type) {
			case "button": {
				await interaction.deferReply({ ephemeral: true });
				interaction.followUp("Hello button!");
			}
				break;
			case "modal": {
				const modal = new ModalBuilder()
					.setCustomId(`${this.name}.modal`)
					.setTitle("My Modal");

				modal.addComponents(
					new ActionRowBuilder<TextInputBuilder>().addComponents(
						new TextInputBuilder()
							.setCustomId(`${this.name}.modal.input`)
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

	async modalExecute(interaction: ModalSubmitInteraction): Promise<void> {
		const value = interaction.fields.fields.at(0).value;
		await interaction.deferReply({ ephemeral: true });
		interaction.followUp(`Your input is **${value}**!`);
	}
}