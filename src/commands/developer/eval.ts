import { ApplicationCommandOptionType } from "discord.js";
import { CommandData } from "../../types";
import Context from "../../struct/Context";

export const data: CommandData = {
	name: "eval",
	description: "đoạn code (dev only)",
	options: [{
		name: "code",
		description: "thực thi một đoạn code",
		type: ApplicationCommandOptionType.String,
		required: true
	}],
	whitelist: { developer: true }
};

export async function execute(ctx: Context) {
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
