import { CommandData } from "../../types";
import { Context } from "../../structures";

export const data: CommandData = {
	name: "ping",
	description: "độ trễ của bot"
};

export async function execute(ctx: Context) {
	ctx.sendMessage(`${ctx.client.ws.ping}ms`);
}
