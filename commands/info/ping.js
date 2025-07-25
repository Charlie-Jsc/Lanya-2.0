const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription("Muestra la API del bot y el ping del cliente."),

  async execute(interaction) {
    const apiPing = Math.round(interaction.client.ws.ping);
    const sent = await interaction.reply({
      content: 'Pinging...',
      fetchReply: true,
    });
    const clientPing = sent.createdTimestamp - interaction.createdTimestamp;

    const pingEmbed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('🏓 Pong!')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .addFields(
        {
          name: '📡 API Ping',
          value: `\`${apiPing}ms\``,
          inline: true,
        },
        {
          name: '⏱️ Client Ping',
          value: `\`${clientPing}ms\``,
          inline: true,
        }
      )
      .setDescription('Aquí está la información de latencia para el bot:')
      .setFooter({
        text: `Solicitado por ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    await interaction.editReply({ content: null, embeds: [pingEmbed] });
  },
};
