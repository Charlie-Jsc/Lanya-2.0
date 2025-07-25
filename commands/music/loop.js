const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Establecer el modo de bucle')
    .addStringOption((option) =>
      option
        .setName('mode')
        .setDescription('Modo de bucle')
        .setRequired(true)
        .addChoices(
          { name: 'Desactivado', value: 'off' },
          { name: 'Pista', value: 'track' },
          { name: 'Cola', value: 'queue' }
        )
    ),
  async execute(interaction) {
    client = interaction.client;
    const player = client.lavalink.players.get(interaction.guild.id);

    if (!player) {
      return interaction.reply({
        content: '¡No se está reproduciendo nada!',
        ephemeral: true,
      });
    }

    const mode = interaction.options.getString('mode');
    player.setRepeatMode(mode);

    interaction.reply(`🔄 Modo de bucle establecido a: **${mode}**`);
  },
};
