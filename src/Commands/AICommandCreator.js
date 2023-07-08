const { SlashCommandBuilder, EmbedBuilder, REST, Routes } = require("discord.js");
const { API_KEY } = require("./../config");
const { Configuration, OpenAIApi } = require("openai");
const path = require("node:path");
const fs = require("node:fs");

const AI_COMMAND_FOLDER = path.join(__dirname, "..", "/Commands", "AI_Commands");

async function RestartBot(Interaction, Name){
    await Interaction.editReply({
        content: "",
        embeds: [
            new EmbedBuilder()
                .setTitle("New command created!")
                .setDescription(`New command, ${Name}, has been saved.\nYou must restart your client in order to use the newly generated commands.\nThe bot will be rebooted now!`)
                .setColor("Red")
        ]
    });
    process.exit(1);
}

function WriteToFile(Bot, Interaction, Name, Code){
    console.log(AI_COMMAND_FOLDER + `/${Name}.js`);
    fs.writeFileSync(AI_COMMAND_FOLDER + `/${Name}.js`, Code);
    RestartBot(Interaction, Name);
}

module.exports = {
    data: new SlashCommandBuilder()
            .setName("create_command")
            .setDescription("Tries to create a comand with OpenAI, functionality is not guaranteed")
            .addStringOption( option => option.setName("cmd_name").setDescription("name of the command").setRequired(true) )
            .addStringOption( option => option.setName("cmd_desc").setDescription("Describe the command").setRequired(true) ),
    
    async execute(Bot, Interaction){
        const CommandName = `AI_${Interaction.options.getString("cmd_name")}`;
        const CommandPrompt = Interaction.options.getString("cmd_desc");
        const prompt = `Here is a sample Slash Command code
//code starts here, no "const code = \`" at the start
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js"); //remember to import the necessary modules

module.exports = {
    data: new SlashCommandBuilder() //used to register slash commands
        .setName('ping') //remember to prepend ai_ to this command name, cannot contain " "
        .setDescription('Ping!'),
    async execute(Bot, Interaction) {
        const Message = await Interaction.reply({ //must have 1 Interaction.reply
            content: "",
            embeds: [
                new EmbedBuilder() //used to create embeds
                    .setTitle("Pinging") //must be filled
                    .setColor("Orange")
            ],
            fetchReply: true
        });
        await Interaction.editReply({
            content: "",
            embeds: [
                new EmbedBuilder()
                    .setTitle("Pong!") //must be filled
                    .addFields(
                        {
                            name: ":stopwatch: Uptime",
                            value: \`\$\{Math.round(Interaction.client.uptime / 60000)} minutes\`,
                            inline: false
                        },
                        {
                            name: ":sparkling_heart: Websocket heartbeat",
                            value: \`\${Interaction.client.ws.ping}ms\`,
                            inline: false
                        },
                        {
                            name: ":round_pushpin: Roundtrip Latency",
                            value: \`\${Message.createdTimestamp - Interaction.createdTimestamp}ms\`,
                            inline: false
                        }
                    )
                    .setColor("Random")
            ]
        });
    }
};
//it ends here, no "\`;" at the end
Write Javascript code that uses DiscordJS v14 to create the following modular slash command (one that uses module.exports = {data: //JSON DATA, async execute(Bot, Interaction) }): ${CommandPrompt}. Only return the code as a simple string that I can directly have node:fs write into a file and execute. 
dont do const code = \`\`. and make sure I can require it and execute it immediately. No need to do const code = " at the start
make sure the code is not wrapped n a string
make sure the .setName() in the SlashCommandBuilder class has "ai_" prepended, for instance
if the command name is "ping", prepend "ai_" to make it .setName("ai_ping")
Make sure to import the necessary modules like the given sample
editReply can only be used
All colors must be written in Pascal case. for instance, .setColor("Green") and .setColor("Orange")
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
        WriteToFile(Bot, Interaction, CommandName, Response);
    }
}