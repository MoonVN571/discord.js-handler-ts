import { Command } from "../../struct/Commands";
import Context from "../../struct/Context";

export const data: Command = {
	name: "ping",
	description: "bot delay"
};

export async function execute(ctx: Context) {
	ctx.sendMessage(`${ctx.client.ws.ping}ms`);
}
