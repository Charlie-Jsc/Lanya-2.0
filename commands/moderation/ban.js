const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { t } = require('../../utils/translations');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server.')
    .addUserOption((option) =>
      option.setName('user').setDescription('The user to ban').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('Reason for banning the user')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('duration')
        .setDescription('Duration for temporary ban (e.g., "2d1h30m40s")')
        .setRequired(false)
    ),

  async execute(interaction) {
    const { default: prettyMs } = await import('pretty-ms');
    const user = interaction.options.getUser('user');
    const reason =
      interaction.options.getString('reason') || t('ban.noReasonProvided');
    const duration = interaction.options.getString('duration');
    const member = interaction.guild.members.cache.get(user.id);
    if (!member) {
      return interaction.reply({
        content: t('ban.userNotInServer'),
        ephemeral: true,
      });
    }
    const executor = interaction.member;
    const botMember = interaction.guild.members.cache.get(
      interaction.client.user.id
    );

    if (!interaction.member.permissions.has('BanMembers')) {
      return interaction.reply({
        content: t('ban.noPermission'),
        ephemeral: true,
      });
    }

    if (member.roles.highest.position >= executor.roles.highest.position) {
      return interaction.reply({
        content: t('ban.cannotBanHigherRole'),
        ephemeral: true,
      });
    }
    if (member.roles.highest.position >= botMember.roles.highest.position) {
      return interaction.reply({
        content: t('ban.botCannotBanHigherRole'),
        ephemeral: true,
      });
    }

    const durationRegex = /^(?:\d+d)?(?:\d+h)?(?:\d+m)?(?:\d+s)?$/;
    let durationInMs = null;

    if (duration) {
      if (!durationRegex.test(duration)) {
        return interaction.reply({
          content: t('ban.invalidDuration'),
          ephemeral: true,
        });
      }
      durationInMs = parseDuration(duration);
    }

    await member.ban({ reason });

    const banEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle(t('ban.memberBanned'))
      .setDescription(t('ban.userBannedDescription', { user: user.tag }))
      .addFields(
        { name: t('ban.reason'), value: reason, inline: true },
        {
          name: t('ban.bannedBy'),
          value: `<@${interaction.user.id}>`,
          inline: true,
        },
        {
          name: t('ban.duration'),
          value: durationInMs
            ? prettyMs(durationInMs, { verbose: true })
            : t('ban.permanent'),
          inline: true,
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [banEmbed] });

    if (durationInMs) {
      setTimeout(async () => {
        try {
          await interaction.guild.members.unban(
            user.id,
            'Temporary ban duration expired'
          );
        } catch (error) {
          console.error(`Failed to unban ${user.tag}:`, error);
        }
      }, durationInMs);
    }
  },
};

function parseDuration(duration) {
  const days =
    (duration.match(/(\d+)d/) ? parseInt(duration.match(/(\d+)d/)[1], 10) : 0) *
    24 *
    60 *
    60 *
    1000;
  const hours =
    (duration.match(/(\d+)h/) ? parseInt(duration.match(/(\d+)h/)[1], 10) : 0) *
    60 *
    60 *
    1000;
  const minutes =
    (duration.match(/(\d+)m/) ? parseInt(duration.match(/(\d+)m/)[1], 10) : 0) *
    60 *
    1000;
  const seconds =
    (duration.match(/(\d+)s/) ? parseInt(duration.match(/(\d+)s/)[1], 10) : 0) *
    1000;

  return days + hours + minutes + seconds;
}
