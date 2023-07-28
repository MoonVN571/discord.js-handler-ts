import { Bot } from "../struct/Bot";

export class Utils {
	public client: Bot;
	constructor(client: Bot) {
		this.client = client;
	}

	public random(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	public formatNum(number: number): string {
		return Intl.NumberFormat().format(number);
	}

	public sleep(time: number): Promise<void> {
		return new Promise((res) => setTimeout(res, time));
	}
}