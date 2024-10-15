import { Events } from "discord.js";
import DiscordBot from "./DiscordBot";


export interface EventOptions {
    once?: boolean;
    name?: Events;
}

export default class Event {
	public once: boolean;
	public event: string;
	public client: DiscordBot;

	constructor(client: DiscordBot, event: EventOptions) {
		this.client = client;
		this.once = event?.once || false;
		this.event = event.name;
	}

	/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
	execute(_client: DiscordBot, ..._any: any[]) {

	}

	register(client:DiscordBot) {
		if (this?.once) client.once(this.event, (...p) => this.execute(this.client, ...p));
		else client.on(this.event, (...p) => this.execute(this.client, ...p));
	}

	unregister(client:DiscordBot) {
		client.off(this.event, (...p) => this.execute(this.client, ...p));
	}
}