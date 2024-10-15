import { Command, Context, DiscordBot } from "../../structures";

export default class PingCOmmand extends Command {
	constructor(client: DiscordBot) {
		super(client, {
			name: "ping",
			description: "Ping command.",
		});
	}

	async execute(ctx: Context) {
		await ctx.sendMessage({
			content: `${ctx.client.ws.ping}ms`,
		});
	}
}