import { Context } from "../../structures";
import { CommandData, CommandOptions } from "../../types";
import { EmbedField } from "discord.js";

export const data: CommandData = {
	name: "help",
	description: "xem danh sách lệnh"
};

export async function execute(ctx: Context) {
	function sortCommandsByCategory(commands: CommandOptions[]): Record<string, string[]> {
		const sortedCommands: Record<string, string[]> = {};

		commands.forEach((command) => {
			const { name, category } = command.data;

			if (!sortedCommands[category])
				sortedCommands[category] = [];

			sortedCommands[category].push(name);
		});

		return sortedCommands;
	}

	const fields: EmbedField[] = [];
	const cmds = sortCommandsByCategory(ctx.client.commands.map(cmd => cmd));

	for (const category in cmds)
		fields.push({
			name: category.charAt(0).toUpperCase() + category.slice(1),
			value: `\`${cmds[category].join("`, `")}\``,
			inline: false,
		});

	ctx.sendFollowUp({
		embeds: [{
			author: {
				name: "Help Menu",
				iconURL: ctx.user.displayAvatarURL()
			},
			fields,
			color: ctx.color.default,
			timestamp: new Date().toISOString()
		}]
	});
}
