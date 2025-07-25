const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { t } = require('../../utils/translations');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription("Displays the bot's API and client ping."),

  async execute(interaction) {
    const apiPing = Math.round(interaction.client.ws.ping);
    const sent = await interaction.reply({
      content: t('ping.pinging'),
      fetchReply: true,
    });
    const clientPing = sent.createdTimestamp - interaction.createdTimestamp;

    const pingEmbed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(t('ping.pong'))
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .addFields(
        {
          name: t('ping.apiPing'),
          value: `\`${apiPing}ms\``,
          inline: true,
        },
        {
          name: t('ping.clientPing'),
          value: `\`${clientPing}ms\``,
          inline: true,
        }
      )
      .setDescription(t('ping.description'))
      .setFooter({
        text: `${t('ping.requestedBy')} ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    await interaction.editReply({ content: null, embeds: [pingEmbed] });
  },
};
