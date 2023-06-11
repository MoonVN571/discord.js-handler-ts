import Context from "../../struct/Context";
import { readdirSync } from "fs";
import { Command, CommandData } from "../../struct/Commands";

export const data: Command = {
	name: "help",
	description: "list commands"
};

export async function execute(ctx: Context) {
	const fields: { name: string, value: string }[] = [];
	await ctx.sendDeferMessage(false);

	await Promise.all(readdirSync("./src/commands").map(async (category: string) => {
		const cmdList: string[] = [];
		await Promise.all(readdirSync(`./src/commands/${category}`).map(async (cmdName: string) => {
			const cmd: CommandData = await import(`../${category}/${cmdName.split(".")[0]}`);
			cmdList.push(cmd.data.name);
		}));
		if (cmdList.length === 0) return;
		fields.push({
			name: category.charAt(0).toLocaleUpperCase() + category.slice(1),
			value: cmdList.join(", ")
		});
	}));

	ctx.sendFollowUp({
		embeds: [{
			fields,
			color: ctx.color.default,
			timestamp: new Date().toISOString()
		}]
	});
}
