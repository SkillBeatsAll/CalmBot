import { Message } from "discord.js";
import Client from "../structures/Client";

import urls from "../data/img/bunny.json";

module.exports = {
  name: "bunny",
  description: "Sends a bunny picture!",
  category: "Images",
  usage: "bunny",
  run: async function run(client: Client, message: Message, args: Array<String>) {
    const img = urls[Math.floor(Math.random() * urls.length)];
    message.channel.send(img);
  },
};
