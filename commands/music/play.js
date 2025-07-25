const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { formatTime } = require('../../utils/utils');

const autocompleteMap = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Reproduce una canción o playlist de diferentes fuentes')

    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('Nombre de la canción o URL')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption((option) =>
      option
        .setName('source')
        .setDescription('La fuente desde donde quieres reproducir la música')
        .addChoices(
          { name: 'Youtube', value: 'ytsearch' },
          { name: 'Youtube Music', value: 'ytmsearch' },
          { name: 'Spotify', value: 'spsearch' },
          { name: 'Soundcloud', value: 'scsearch' },
          { name: 'Deezer', value: 'dzsearch' }
        )
    ),

  async autocomplete(interaction) {
    try {
      const query = interaction.options.getFocused();
      const member = interaction.member;
      if (!member.voice.channel) {
        return await interaction.respond([
          {
            name: '⚠️ ¡Únete a un canal de voz primero!',
            value: 'join_vc',
          },
        ]);
      }
      if (!query.trim()) {
        return await interaction.respond([
          {
            name: 'Comienza a escribir para buscar canciones...',
            value: 'start_typing',
          },
        ]);
      }

      const source = 'spsearch';

      player = interaction.client.lavalink.createPlayer({
        guildId: interaction.guildId,
        textChannelId: interaction.channelId,
        voiceChannelId: interaction.member.voice.channel.id,
        selfDeaf: true,
      });

      try {
        const results = await player.search({ query, source });

        if (!results?.tracks?.length) {
          return await interaction.respond([
            { name: 'No se encontraron resultados', value: 'no_results' },
          ]);
        }

        let options = [];

        if (results.loadType === 'playlist') {
          options = [
            {
              name: `📑 Lista de reproducción: ${results.playlist?.title || 'Desconocida'} (${results.tracks.length} pistas)`,
              value: `${query}`,
            },
          ];
        } else {
          options = results.tracks.slice(0, 25).map((track) => ({
            name: `${track.info.title} - ${track.info.author}`,
            value: track.info.uri,
          }));
        }

        return await interaction.respond(options);
      } catch (searchError) {
        console.error('Search error:', searchError);
        return await interaction.respond([
          { name: 'Error al buscar pistas', value: 'error' },
        ]);
      }
    } catch (error) {
      console.error('Autocomplete error:', error);
      return await interaction.respond([
        { name: 'Ocurrió un error', value: 'error' },
      ]);
    }
  },

  async execute(interaction) {
    const client = interaction.client;
    const query = interaction.options.getString('query');
    const member = interaction.member;
    const source = interaction.options.getString('source') || 'spsearch';

    if (query === 'join_vc' || query === 'start_typing' || query === 'error') {
      return interaction.reply({
        content: '❌ ¡Por favor únete a un canal de voz y selecciona una canción válida!',
        ephemeral: true,
      });
    }

    if (query === 'no_results') {
      return interaction.reply({
        content: '❌ ¡No se encontraron resultados! Intenta con un término de búsqueda diferente.',
        ephemeral: true,
      });
    }

    if (!member.voice.channel) {
      return interaction.reply({
        content: '❌ ¡Necesitas unirte a un canal de voz primero!',
        ephemeral: true,
      });
    }

    let player = client.lavalink.players.get(interaction.guild.id);
    if (!player) {
      player = client.lavalink.createPlayer({
        guildId: interaction.guild.id,
        voiceChannelId: member.voice.channel.id,
        textChannelId: interaction.channel.id,
        selfDeaf: true,
      });
    }
    await player.connect();

    await interaction.deferReply();

    if (query.startsWith('playlist_')) {
      const actualQuery = query.replace('playlist_', '');
      search = await player.search({ query: actualQuery, source });
    } else {
      const isURL = query.startsWith('http://') || query.startsWith('https://');
      search = await player.search({ query, source });
    }

    if (!search?.tracks?.length) {
      return interaction.editReply({
        content: '❌ ¡No se encontraron resultados! Intenta con un término de búsqueda diferente.',
        ephemeral: true,
      });
    }

    if (search.loadType === 'playlist') {
      for (const track of search.tracks) {
        track.userData = { requester: interaction.member };
        await player.queue.add(track);
      }

      const playlistEmbed = new EmbedBuilder()
        .setColor('#DDA0DD')
        .setAuthor({
          name: 'Lista de Reproducción Agregada a la Cola 📃',
          iconURL: client.user.displayAvatarURL(),
        })
        .setTitle(search.playlist?.title)
        .setThumbnail(search.tracks[0].info.artworkUrl)
        .setDescription(
          `Se agregaron \`${search.tracks.length}\` pistas de la lista de reproducción\n\n` +
            `**Primera Pista:** [${search.tracks[0].info.title}](${search.tracks[0].info.uri})\n` +
            `**Última Pista:** [${search.tracks[search.tracks.length - 1].info.title}](${search.tracks[search.tracks.length - 1].info.uri})`
        )
        .addFields([
          {
            name: '👤 Autor de la Lista',
            value: `\`${search.tracks[0].info.author}\``,
            inline: true,
          },
          {
            name: '⌛ Duración Total',
            value: `\`${formatTime(search.tracks.reduce((acc, track) => acc + track.info.duration, 0))}\``,
            inline: true,
          },
        ])
        .setFooter({
          text: `Agregado por ${interaction.user.tag} • Posición en cola: #${player.queue.tracks.length - search.tracks.length + 1}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();

      if (!player.playing) {
        await player.play();
      }

      return interaction.editReply({ embeds: [playlistEmbed] });
    } else {
      const track = search.tracks[0];
      track.userData = { requester: interaction.member };
      await player.queue.add(track);

      const trackEmbed = new EmbedBuilder()
        .setColor('#DDA0DD')
        .setAuthor({
          name: 'Agregado a la Cola 🎵',
          iconURL: client.user.displayAvatarURL(),
        })
        .setTitle(track.info.title)
        .setURL(track.info.uri)
        .setThumbnail(track.info.artworkUrl)
        .addFields([
          {
            name: '👤 Artista',
            value: `\`${track.info.author}\``,
            inline: true,
          },
          {
            name: '⌛ Duración',
            value: `\`${formatTime(track.info.duration)}\``,
            inline: true,
          },
          {
            name: '🎧 Posición en Cola',
            value: `\`#${player.queue.tracks.length}\``,
            inline: true,
          },
        ])
        .setFooter({
          text: `Agregado por ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();

      if (!player.playing) {
        await player.play();
      }

      return interaction.editReply({ embeds: [trackEmbed] });
    }
  },
};
