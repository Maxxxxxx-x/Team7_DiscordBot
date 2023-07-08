const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("annoy")
        .setDescription("Literally spam pings everyone in this channel for 1 minute"),
    async execute(Bot, Interaction){
        const StartTime = Date.now()
        setInterval(async () => {
            if (Date.now - StartTime >= 60000){
                return clearInterval(this);
            }
            await Interaction.channel.send("@everyone");
        }, 10000 / 25);
    }
}