const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('candy')
        .setDescription('start drawing a candy!'),
    async execute(Bot, interaction) {
        const message = await interaction.reply({ content: 'drawing...', fetchReply: true, ephemeral: true });
        let Delay = (Math.floor(Math.random() * 10000) + 1000);
        console.log(Delay);
        setTimeout(()=>{
            const jsonData = fs.readFileSync("./data/pond.json");
            let pond = JSON.parse(jsonData);
            interaction.editReply({
                content: "",
                embeds: [
                    new EmbedBuilder()
                        .setTitle(":candy: 七七乳加")
                        .setDescription( `獲得一個 ${pond.candy[Math.floor(Math.random() * pond.candy.length)]}口味的七七乳加!`)
                        .setColor("Green")
                ]
            });
            return;
        }, Delay);
    }
};