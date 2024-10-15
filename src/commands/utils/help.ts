import { Command, Context, DiscordBot } from "../../structures";
import { EmbedField } from "discord.js";


export default class HelpCommand extends Command {
	constructor(client: DiscordBot) {
		super(client, {
			name: "help",
			description: "Help command.",
		});
	}

	async execute(ctx: Context) {
		function sortCommandsByCategory(commands: Command[]): Record<string, string[]> {
			const sortedCommands: Record<string, string[]> = {};
	
			commands.forEach((command) => {
				const { name, category } = command;
	
				if (!sortedCommands[category])
					sortedCommands[category] = [];
	
				sortedCommands[category].push(name);
			});
	
			return sortedCommands;
		}
	
		const fields: EmbedField[] = [];
		const cmds = sortCommandsByCategory(ctx.client.commands.map(cmd=>cmd));
	
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
					icon_url: ctx.user.displayAvatarURL()
				},
				fields,
				color: ctx.color.default,
				timestamp: new Date().toISOString()
			}]
		});
	}	
}
