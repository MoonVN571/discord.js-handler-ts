import { Bot } from "../struct/Bot";

export class Utils {
	public client: Bot;
	constructor(client: Bot) {
		this.client = client;
	}
	public static random(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	public static formatNum(number: number): string {
		return Intl.NumberFormat().format(number);
	}

	public static sleep(time: number): Promise<void> {
		return new Promise((res) => setTimeout(res, time));
	}

	public isDev(userId: string | undefined): boolean {
		return this.client.config.developers.indexOf(userId as string) > -1;
	}
}