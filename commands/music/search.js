const {
  SlashCommandBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
} = require('discord.js');
const { formatTime } = require('../../utils/utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Buscar una canción para agregar a la cola')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('Nombre de la canción o URL')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('source')
        .setDescription('La fuente desde la que quieres buscar')
        .addChoices(
          { name: 'Youtube', value: 'ytsearch' },
          { name: 'Youtube Music', value: 'ytmsearch' },
          { name: 'Spotify', value: 'spsearch' },
          { name: 'Soundcloud', value: 'scsearch' },
          { name: 'Deezer', value: 'dzsearch' }
        )
    ),
  async execute(interaction) {
    const client = interaction.client;
    const query = interaction.options.getString('query');
    const member = interaction.member;
    const source = interaction.options.getString('source') || 'spsearch';

    if (!member.voice.channel) {
      return interaction.reply({
        content: '❌ ¡Necesitas unirte a un canal de voz primero!',
        ephemeral: true,
      });
    }

    const permissions = member.voice.channel.permissionsFor(client.user);
    if (!permissions.has('Connect') || !permissions.has('Speak')) {
      return interaction.reply({
        content:
          '❌ ¡Necesito permisos para unirme y hablar en tu canal de voz!',
        ephemeral: true,
      });
    }

    try {
      let player = client.lavalink.players.get(interaction.guild.id);
      if (!player) {
        player = await client.lavalink.createPlayer({
          guildId: interaction.guild.id,
          voiceChannelId: member.voice.channel.id,
          textChannelId: interaction.channel.id,
          selfDeaf: true,
          selfMute: false,
          volume: 100,
        });
        await player.connect();
      }

      await interaction.deferReply();
      const search = await player.search({ query, source });

      if (!search?.tracks?.length) {
        return interaction.editReply({
          content: '❌ ¡No se encontraron resultados! Intenta con un término de búsqueda diferente.',
          ephemeral: true,
        });
      }

      const tracks = search.tracks.slice(0, 10);

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('search_select')
        .setPlaceholder('Selecciona una canción para agregar a la cola')
        .addOptions(
          tracks.map((track, index) =>
            new StringSelectMenuOptionBuilder()
              .setLabel(`${index + 1}. ${track.info.title.slice(0, 95)}`)
              .setDescription(
                `Por ${track.info.author} • ${formatTime(track.info.duration)}`
              )
              .setValue(track.info.uri)
          )
        );

      const row = new ActionRowBuilder().addComponents(selectMenu);

      const searchEmbed = new EmbedBuilder()
        .setColor('#DDA0DD')
        .setAuthor({
          name: `Resultados de búsqueda para "${query}"`,
          iconURL: client.user.displayAvatarURL(),
        })
        .setDescription(
          `🔍 Se encontraron ${tracks.length} resultados de ${getSourceEmoji(source)} ${getSourceName(source)}\n\n` +
            tracks
              .map(
                (track, index) =>
                  `**${index + 1}.** [${track.info.title}](${track.info.uri})\n` +
                  `${getSourceEmoji(source)} \`${track.info.author}\` • ⌛ \`${formatTime(track.info.duration)}\``
              )
              .join('\n\n')
        )
        .setThumbnail(tracks[0].info.artworkUrl)
        .addFields({
          name: '📝 Instrucciones',
          value:
            'Selecciona una pista del menú desplegable de abajo\nEste menú expirará en 30 segundos',
        })
        .setFooter({
          text: `Solicitado por ${interaction.user.tag} • Selecciona una pista para agregar a la cola`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();

      const response = await interaction.editReply({
        embeds: [searchEmbed],
        components: [row],
      });

      const filter = (i) => i.user.id === interaction.user.id;
      const collector = response.createMessageComponentCollector({
        filter,
        time: 30000,
      });

      collector.on('collect', async (i) => {
        const selectedTrack = search.tracks.find(
          (track) => track.info.uri === i.values[0]
        );
        if (!selectedTrack) {
          return i.reply({
            content: '❌ ¡Pista no encontrada! Por favor intenta buscar de nuevo.',
            ephemeral: true,
          });
        }

        try {
          player.requester = interaction.user;
          await player.queue.add(selectedTrack);

          if (!player.playing && !player.paused) {
            await player.play();
          }

          const addedEmbed = new EmbedBuilder()
            .setColor('#DDA0DD')
            .setAuthor({
              name: 'Agregado a la Cola 🎵',
              iconURL: client.user.displayAvatarURL(),
            })
            .setTitle(selectedTrack.info.title)
            .setURL(selectedTrack.info.uri)
            .setThumbnail(selectedTrack.info.artworkUrl)
            .addFields([
              {
                name: '👤 Artist',
                value: `\`${selectedTrack.info.author}\``,
                inline: true,
              },
              {
                name: '⌛ Duration',
                value: `\`${formatTime(selectedTrack.info.duration)}\``,
                inline: true,
              },
              {
                name: '🎧 Position in Queue',
                value: `\`#${player.queue.tracks.length}\``,
                inline: true,
              },
              {
                name: '🎵 Source',
                value: `${getSourceEmoji(source)} \`${getSourceName(source)}\``,
                inline: true,
              },
            ])
            .setFooter({
              text: `Added by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp();

          await i.update({ embeds: [addedEmbed], components: [] });
        } catch (error) {
          console.error('Error adding track:', error);
          await i.reply({
            content: '❌ Error adding track to queue. Please try again.',
            ephemeral: true,
          });
        }
      });

      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          interaction.editReply({
            content: '⏱️ Search timed out. Please try again.',
            components: [],
          });
        }
      });
    } catch (error) {
      console.error('Search command error:', error);
      return interaction.editReply({
        content: '❌ An error occurred while processing your request.',
        ephemeral: true,
      });
    }
  },
};

function getSourceEmoji(source) {
  const emojis = {
    ytsearch: '📺',
    ytmsearch: '🎵',
    spsearch: '💚',
    scsearch: '🟠',
    dzsearch: '💿',
  };
  return emojis[source] || '🎵';
}

function getSourceName(source) {
  const names = {
    ytsearch: 'YouTube',
    ytmsearch: 'YouTube Music',
    spsearch: 'Spotify',
    scsearch: 'SoundCloud',
    dzsearch: 'Deezer',
  };
  return names[source] || 'Unknown Source';
}
