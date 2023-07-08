const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reboot")
        .setDescription("Literally just reboots the bot")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(Bot, Interaction){
        await Interaction.reply({
            content: "",
            embeds: [
                new EmbedBuilder()
                    .setTitle("Reboot request received")
                    .setDescription("Rebooting...")
                    .setColor("DarkButNotBlack")
            ]
        });
        process.exit(1);
    }
}