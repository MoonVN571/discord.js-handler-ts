import { Context } from "../../structures";
import { readdirSync } from "fs";
import { CommandData, CommandOptions } from "../../types";

export const data: CommandData = {
	name: "help",
	description: "xem danh sách lệnh"
};

export async function execute(ctx: Context) {
	const fields: { name: string, value: string }[] = [];
	await ctx.sendDeferMessage(false);

	await Promise.all(readdirSync("./dist/commands").map(async (category: string) => {
		const cmdList: string[] = [];
		await Promise.all(readdirSync(`./dist/commands/${category}`).map(async (cmdName: string) => {
			const cmd: CommandOptions = await import(`../${category}/${cmdName.split(".")[0]}`);
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
