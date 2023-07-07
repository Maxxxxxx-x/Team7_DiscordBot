const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fish')
        .setDescription('start fishing!'),
    async execute(Bot, interaction) {
        const message = await interaction.reply({ content: 'fishing...', fetchReply: true, ephemeral: true });
        setInterval(()=>{
            const jsonData = fs.readFileSync("./data/pond.json");
            let pond = JSON.parse(jsonData);
            interaction.editReply({
                content: "",
                embeds: [
                    new EmbedBuilder()
                        .setTitle(":fishing_pole_and_fish: Fishing!")
                        .addFields(
                            {
                                name: ":fish: Fish",
                                value: `You caught a ${pond.fishes[Math.floor(Math.random() * pond.fishes.length)]}!`,
                                inline: false
                            }
                        )
                        .setColor("Green")
                ]
            });
        }, (Math.floor(Math.random() * 10000) + 1000));
    }
};