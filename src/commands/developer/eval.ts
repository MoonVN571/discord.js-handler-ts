import { ApplicationCommandOptionType } from "discord.js";
import { Command, Context, DiscordBot } from "../../structures";

export default class EvalCommand extends Command {
	constructor(client: DiscordBot) {
		super(client, {
			name: "eval",
			description: "đoạn code (dev only)",
			options: [{
				name: "code",
				description: "thực thi một đoạn code",
				type: ApplicationCommandOptionType.String,
				required: true
			}],
			whitelist: { developer: true }
		});
	}

	async execute(ctx: Context) {
		const str = ctx.args.join(" ");
		await ctx.sendDeferMessage(false);
		if (!str)
			return ctx.sendFollowUp({
				embeds: [{
					description: "Hãy nhập code cần chạy.",
					color: ctx.client.config.color.error
				}],
				ephemeral: true
			});
		try {
			const e = await eval(str);
			ctx.sendFollowUp({
				embeds: [{
					description: `\`\`\`${e}\`\`\``,
					color: ctx.client.config.color.success
				}]
			});
		} catch (err) {
			ctx.sendFollowUp({
				embeds: [{
					description: `\`\`\`${err}\`\`\``,
					color: ctx.client.config.color.error
				}]
			});
		}
	}	
};