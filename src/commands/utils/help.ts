import Context from "../../struct/Context";
import { readdirSync } from "fs";

export const data = {
	name: "help",
	description: "bot commands list"
};
/* eslint-disable @typescript-eslint/no-unused-vars */
export async function execute(ctx: Context, args: string[]) {
	const fields: { name: string, value: string }[] = [];
	await ctx.sendDeferMessage(false);

	await Promise.all(readdirSync("./src/commands").map(async (category: string) => {
		const cmdList: string[] = [];
		if (category == "developer") return;
		await Promise.all(readdirSync(`./${ctx.client.dev ? "src" : "dist"}/commands/${category}`).map(async (cmdName: string) => {
			const cmd = await import(`../${category}/${cmdName}`);
			if (cmd.hide) return;
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
