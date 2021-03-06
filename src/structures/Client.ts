import fs from "fs";
import path from "path";
import { promisify } from "util";
import Discord from "discord.js";
import Database from "../utils/database/Database";

const readdir = promisify(fs.readdir);

export default class Client extends Discord.Client {
  prefix = "c!";
  version = "2.12.1";
  commands = new Discord.Collection();
  aliases = new Discord.Collection();

  constructor() {
    super({
      disableMentions: "everyone",
      partials: ["GUILD_MEMBER", "USER", "MESSAGE", "REACTION", "CHANNEL"],
    });

    Database.initialize(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`);
  }

  async loadEvents(eventsDir: string) {
    const eventFiles = await readdir(eventsDir);

    eventFiles.forEach((file: string, i: number) => {
      const eventName = file.split(".")[0];
      const event = require(path.join(eventsDir, file));
      this.on(eventName, event.bind(null, this));

      console.log(`Loaded event: ${eventName}`);
    });
  }

  async loadCommands(commandsDir: string) {
    const commandFiles = await readdir(commandsDir);

    commandFiles.forEach((file: string, i: number) => {
      const commandName = file.split(".")[0];
      const command = require(path.join(commandsDir, file));
      this.commands.set(commandName, command);
      if (command.aliases) {
        command.aliases.forEach((alias: any) => {
          this.aliases.set(alias, command);
        });
      }

      console.log(`Loaded command: ${commandName} ${command.aliases ? `with aliases: ${command.aliases.join(", ")}` : ""}`);
    });
  }
}
