import { DiscordBot } from "../structures";

export class Utils {
	public client: DiscordBot;
	constructor(client: DiscordBot) {
		this.client = client;
	}

	public random(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	public formatNum(number: number) {
		return Intl.NumberFormat().format(number);
	}

	public sleep(time: number) {
		return new Promise((res) => setTimeout(res, time));
	}
}