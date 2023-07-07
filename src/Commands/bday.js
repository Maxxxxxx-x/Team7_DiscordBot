const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Client } = require('discord.js');
const fs = require('node:fs');

//[建立/回覆 button] -> [建立 collector] -> [輸贏啦] -> [讀檔] -> [解析] -> [做事]  -> [回應] -> [存檔]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bday')
        .setDescription('為頻道裡的用戶慶祝生日'),
    async execute(client, interaction) {

        //建立 embed 和 button
        const buttonEmbed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(`今日壽星是...`);

        const scissorButton = new ButtonBuilder()
            .setCustomId('')
            .setLabel('生日快樂🥳')
            .setStyle(ButtonStyle.Primary);

        //將 button 都放入 row 中並回覆 embed 和 row
        const buttonRow = new ActionRowBuilder()
            .addComponents(
                celebrateButton
            );
        
        //回覆
        interaction.reply({ embeds: [buttonEmbed], components: [buttonRow] });

        //建立 collector
        const collector = interaction.channel.createMessageComponentCollector({ time: 180000 });

        //等待 collector 蒐集到玩家按的按鈕
        collector.on('collect', async collected => {
            await interaction.reply(``);
        });
    }
    //如果符合:發送通知(Embed+button)

    //A按下button:A祝壽星生日快樂!
};
setColor("Random")
