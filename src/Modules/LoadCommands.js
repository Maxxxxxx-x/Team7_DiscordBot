const { Collection, REST, Routes} = require("discord.js");
const path = require("node:path");
const fs = require("node:fs");
const { BOT_TOKEN, BOT_ID } = require("./../config");


function LoadCommands(Bot, CommandsDirectory){
    CommandsDirectory = path.join(__dirname, "..", CommandsDirectory)
    Bot.commands = new Collection();
    const CommandFiles = fs.readdirSync(CommandsDirectory).filter((File) => File.endsWith(".js"));
    const Commands = [];
    for (const File of CommandFiles){
        const Command = require(`${CommandsDirectory}/${File}`);
        if (!("data" in Command && "execute" in Command)){
            console.log(`❌ Failed to load normal commands:  ${File}`);
            continue;
        }
        Bot.commands.set(Command.data.name, Command);
        Commands.push(Command.data.toJSON());
        console.log(`✅ Successfully loaded normal command: ${File}`);
    }
    const AICommandPath = path.join(CommandsDirectory, "AI_Commands");
    const AICommandFiles = fs.readdirSync(AICommandPath).filter((File) => File.endsWith(".js"));
    for (const File of AICommandFiles){
        const Command = require(`${AICommandPath}/${File}`);
        if (!("data" in Command && "execute" in Command)){
            console.log(`❌ Failed to load AI Commands: ${File}`);
            continue;
        }
        Bot.commands.set(Command.data.name, Command);
        Commands.push(Command.data.toJSON());
        console.log(`✅ Successfully loaded AI Command: ${File}`);
    }

    const Rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

    Rest.put(Routes.applicationCommands(BOT_ID), { body: Commands })
        .then((Data) => console.log(`✅ Successfully registered ${Data.length} slash commands`))
        .catch(console.error);
    return;
}

module.exports = LoadCommands;