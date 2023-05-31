import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../struct/Commands";
import Context from "../../struct/Context";

export const data: Command = {
	name: "eval",
	description: "run a code",
	options: [{
		name: "code",
		description: "execute a code",
		type: ApplicationCommandOptionType.String,
		required: true
	}],
	whitelist: { developer: true }
};

export async function execute(ctx: Context, args: string[]) {
	const str = args.join(" ");
	if (!str)
		return ctx.sendMessage({
			embeds: [{
				description: "Hãy nhập code cần chạy.",
				color: ctx.client.config.color.error
			}],
			ephemeral: true
		});
	try {
		const e = await eval(str);
		ctx.sendMessage({
			embeds: [{
				description: `\`\`\`${e}\`\`\``,
				color: ctx.client.config.color.success
			}]
		});
	} catch (err) {
		ctx.sendMessage({
			embeds: [{
				description: `\`\`\`${err}\`\`\``,
				color: ctx.client.config.color.error
			}]
		});
	}
}
