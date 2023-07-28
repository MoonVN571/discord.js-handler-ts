import { Schema, model } from "mongoose";
const schema = new Schema({
	guildId: String
}, { id: false });
export const serverModel = model("servers", schema);