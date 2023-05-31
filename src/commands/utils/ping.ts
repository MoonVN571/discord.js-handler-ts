import Context from "../../struct/Context";

export const data = {
	name: "ping",
	description: "bot latency ms"
};
/* eslint-disable @typescript-eslint/no-unused-vars */
export async function execute(ctx: Context, args: string[]) {
	ctx.sendMessage(`${ctx.client.ws.ping}ms`);
}
