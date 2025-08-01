const { Events, EmbedBuilder } = require('discord.js');
const { activeGames } = require('../commands/fun/GuessNumber');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    const game = activeGames.get(message.channel.id);

    if (!game || message.author.bot) return;

    const guess = parseInt(message.content);

    if (isNaN(guess)) return;

    game.guesses.push({ userId: message.author.id, guess });

    if (guess === game.number) {
      activeGames.delete(message.channel.id);

      const winnerEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('¡Tenemos un Ganador!')
        .setDescription(
          `¡${message.author} adivinó el número **${game.number}** y ganó!`
        )
        .setFooter({ text: '¡El juego ha terminado!' })
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

      await message.channel.send({ embeds: [winnerEmbed] });
    }
  },
};
