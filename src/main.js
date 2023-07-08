const { GatewayIntentBits, Client, EmbedBuilder, PermissionFlagsBits, InteractionCollector } = require("discord.js");
const LoadCommands = require("./Modules/LoadCommands");
const { BOT_TOKEN } = require("./config");

const Bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
}); 

let Reboot = false;
let RebootChannel;

LoadCommands(Bot, "./Commands");

Bot.on("interactionCreate", async (Interaction) => {
    if (!Interaction.isChatInputCommand()) return;
    const Command = Bot.commands.get(Interaction.commandName);
    if (!Command) return;
    try {
        await Command.execute(Bot, Interaction);
    } catch (error) {
        console.error(error);
    }
});

Bot.on("guildMemberAdd", async (Member) => {

});

Bot.on("guildMemberRemove", async (Member) => {

})

Bot.on("ready", () => {
    console.log(`✅ Logged in as ${Bot.user.tag} successfully!`);
    if (Reboot){
        Reboot = false;
        RebootChannel.send({
            content: "",
            embeds: [
                new EmbedBuilder()
                    .setTitle("Successfully rebooted bot")
                    .setColor("Green")
            ]
        })
    }
});

Bot.on("messageCreate", (message) => {
    if (message.content !== "!reset_ws") return;
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)){
        message.channel.send({
            content: "",
            embeds: [
                new EmbedBuilder()
                    .setTitle("Nah I don't think I will")
                    .setColor("DarkButNotBlack")
            ]
        });
    }
    try{
        message.channel.send({
            content: "",
            embeds: [
                new EmbedBuilder()
                    .setTitle("Reconnecting websocket connections...")
                    .setColor("Green")
            ]
        })
        .then(console.log("================================================================="))
        .then(Bot.destroy())
        .then(LoadCommands(Bot, "./Commands"))
        .then(Bot.login(BOT_TOKEN))
        .then(message.channel.send({
            content: "",
            embeds: [
                new EmbedBuilder()
                    .setTitle("Reconnected")
                    .setColor("Green")
            ]
        }));
    } catch(error){
        console.error(error);
        message.channel.send({
            content: "",
            embeds: [
                new EmbedBuilder()
                    .setTitle("Failed to reboot the bot")
                    .setColor("Red")
            ]
        });
    }
});

Bot.login(BOT_TOKEN);