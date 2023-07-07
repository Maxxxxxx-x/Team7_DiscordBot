const { SlashCommandBuilder, EmbedBuilder, REST, Routes } = require("discord.js");
const { API_KEY, BOT_TOKEN, BOT_ID } = require("./../config");
const { Configuration, OpenAIApi } = require("openai");
const path = require("node:path");
const fs = require("node:fs");

const AI_COMMAND_FOLDER = path.join(__dirname, "..", "/Commands", "AI_Commands");

function LoadCommand(Bot, Name, NewCommand){
    const Command = require(AI_COMMAND_FOLDER + `/${Name}.js`);
    console.log(Command);
    Bot.commands.set(Name, Command);
    const CommandList = [];
    CommandList.push(Command.data.toJSON());
    const Rest = new REST({version: "10"}).setToken(BOT_TOKEN);

    Rest.put(Routes.applicationCommand(BOT_ID), { body: CommandList })
        .then((Data) => console.log(`✅ Successfully registered ${Name}`))
        .catch(console.error);
    return;
}

function WriteToFile(Bot, Name, Code){
    console.log(Code);
    // const NewCommand = fs.writeFileSync(path.join(AI_COMMAND_FOLDER_FULLPATH, `${Name}.js`, Code));
    console.log(AI_COMMAND_FOLDER + `/${Name}.js`);
    const NewCommand = fs.writeFileSync(AI_COMMAND_FOLDER + `/${Name}.js`, Code);
    LoadCommand(Bot, Name, NewCommand);
}

module.exports = {
    data: new SlashCommandBuilder()
            .setName("create_command")
            .setDescription("Tries to create a comand with OpenAI, functionality is not guaranteed")
            .addStringOption( option => option.setName("cmd_name").setDescription("name of the command").setRequired(true) )
            .addStringOption( option => option.setName("cmd_desc").setDescription("Describe the command").setRequired(true) ),
    
    async execute(Bot, Interaction){
        const CommandName = Interaction.options.getString("cmd_name");
        const CommandPrompt = Interaction.options.getString("cmd_desc");
        const prompt = `Here is a sample Slash Command code
        const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('annoy')
        .setDescription('Annoy everyone in the channel!'),
    async execute(Bot, Interaction) {
        const Message = await Interaction.reply({ content: 'Ready to be annoyed?!', fetchReply: true });
        await Interaction.editReply({
            content: "",
            embeds: [
                new EmbedBuilder()
                    .setTitle("")
                    .addFields(
                        {
                            name: ":stopwatch: Uptime",
                            value: \`\$\{Math.round(Interaction.client.uptime / 60000)} minutes\`,
                            inline: false
                        },
                        {
                            name: ":sparkling_heart: Websocket heartbeat",
                            value: \`\$\{Interaction.client.ws.ping\}ms\`,
                            inline: false
                        },
                        {
                            name: ":round_pushpin: Roundtrip Latency",
                            value: \`\$\{Message.createdTimestamp - Interaction.createdTimestamp}ms\`,
                            inline: false
                        }
                    )
                    .setColor("Random")
            ]
        });
    }
};
Write Javascript code that uses DiscordJS v14 to create the following modular slash command (one that uses module.exports = {data: //JSON DATA, async execute(Bot, Interaction) }): ${CommandPrompt}. Only return the code as a simple string that I can directly have node:fs write into a file and execute. 
dont do const code = \`\`. and make sure I can require it and execute it immediately. No need to do const code = " at the start
make sure the code is not wrapped n a string
`;
        const Config = new Configuration({ apiKey: API_KEY });
        const OpenAI = new OpenAIApi(Config);
        await Interaction.reply({
            content: "",
            embeds: [
                new EmbedBuilder()
                    .setTitle("Working on it...")
                    .setColor("Green")
            ]
        });
        let Response = await OpenAI.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });
        if (Response.status !== 200){
            return await Interaction.editReply({
                content: "",
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Faild to create command`)
                        .setDescription(`Status Code: ${Response.status}`)
                ]
            })
        }
        Response = Response.data.choices[0].message.content;
        if (Response.length == 0){
            return await Interaction.editReply({
                content: "",
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Failed to get any response")
                        .setColor("Red")
                ]
            });
        }
        const Regex = /```javascript(.*?)```/s;
        const matches = Response.match(Regex);
        if (matches && matches.length > 1) {
            Response = matches[1];
            if (Response.substr(0, 14) === "const code = `"){
                Response.split("const code = `").pop();
            }
            if (Response[Response.length - 1] === "`"){
                Response[Response.length - 1] = "";
            }
            if (Response.substr(0, 18) === "module.exports = `"){
                Response.split("module.exports = `").pop();
            }
            if (Response.substr(Response.length - 2, Response.length - 1) === "`;"){
                Response[Response.length - 1] = "";
                Response[Response.length - 1] = "";
            }
        }
        WriteToFile(Bot,CommandName, Response);
        return await Interaction.editReply({
            content: "",
            embeds: [
                new EmbedBuilder()
                    .setTitle("Command should be created and registered!")
                    .setColor("Green")
            ]
        });
    }
}