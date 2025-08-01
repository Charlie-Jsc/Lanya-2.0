const { Events, EmbedBuilder } = require('discord.js');
const ServerLog = require('../../models/serverlogs');

module.exports = {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member) {
    const logSettings = await ServerLog.findOne({
      guildId: member.guild.id,
    });
    if (
      !logSettings ||
      !logSettings.logChannel ||
      !logSettings.categories.memberEvents
    )
      return;

    const logChannel = member.guild.channels.cache.get(logSettings.logChannel);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL(),
      })
      .setTitle('Miembro Se Unió')
      .setDescription(`<@${member.id}> se ha unido al servidor.`)
      .addFields({
        name: 'Cuenta Creada',
        value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:F>`,
      })
      .setFooter({ text: `ID del Usuario: ${member.id}` })
      .setTimestamp();

    logChannel.send({ embeds: [embed] });
  },
};
