export class Logger {
	constructor() { }

	/* eslint-disable @typescript-eslint/no-explicit-any */

	public info(...message: any[]) {
		this.log("INFO", ...message);
	}

	public start(...message: any[]) {
		this.log("START", ...message);
	}

	public error(...message: any[]) {
		this.log("ERROR", ...message);
	}

	public success(...message: any[]) {
		this.log("SUCCESS", ...message);
	}

	private log(level: string, ...message: any[]) {
		const now = new Date();
		const utcOffset = now.getTimezoneOffset();

		const vietnamTimezoneOffset = 7 * 60; // Vietnam timezone is UTC+7
		const offsetMinutes = utcOffset + vietnamTimezoneOffset;

		const vietnamTime = new Date(now.getTime() + offsetMinutes * 60 * 1000);
		const pad = (n: number) => {
			return (n < 10 ? "0" : "") + n;
		};

		const formatTime = `${pad(vietnamTime.getUTCHours())}:${pad(vietnamTime.getUTCMinutes())}:${pad(vietnamTime.getUTCSeconds())}`;
		const formatDate = `${pad(vietnamTime.getUTCDate())}/${pad(vietnamTime.getUTCMonth() + 1)}/${vietnamTime.getUTCFullYear()}`;
		console.log(`[${formatTime}] [${formatDate}] [${level}] ${message.join(" ")}`);
	}
}