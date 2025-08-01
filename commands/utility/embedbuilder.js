const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embedbuilder')
    .setDescription('Crear un embed personalizado usando un modal interactivo'),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('embed_builder')
      .setTitle('Constructor de Embed');

    const titleInput = new TextInputBuilder()
      .setCustomId('embed_title')
      .setLabel('Título (opcional)')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Ingresa el título del embed')
      .setRequired(false)
      .setMaxLength(256);

    const descriptionInput = new TextInputBuilder()
      .setCustomId('embed_description')
      .setLabel('Descripción (requerida)')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Ingresa la descripción del embed')
      .setRequired(true)
      .setMaxLength(4000);

    const colorInput = new TextInputBuilder()
      .setCustomId('embed_color')
      .setLabel('Color (opcional, valor hex)')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('#FF0000 para rojo')
      .setRequired(false)
      .setMaxLength(7);

    const authorInput = new TextInputBuilder()
      .setCustomId('embed_author')
      .setLabel('Autor (opcional, formato: nombre|url|icono_url)')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(
        'Juan Pérez|https://ejemplo.com|https://ejemplo.com/icono.png'
      )
      .setRequired(false)
      .setMaxLength(300);

    const fieldsInput = new TextInputBuilder()
      .setCustomId('embed_fields')
      .setLabel('Fields (optional, format: name|value|inline)')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Field1|Value1|true\nField2|Value2|false')
      .setRequired(false)
      .setMaxLength(1000);

    const rows = [
      new ActionRowBuilder().addComponents(titleInput),
      new ActionRowBuilder().addComponents(descriptionInput),
      new ActionRowBuilder().addComponents(colorInput),
      new ActionRowBuilder().addComponents(authorInput),
      new ActionRowBuilder().addComponents(fieldsInput),
    ];

    modal.addComponents(...rows);
    await interaction.showModal(modal);
  },

  async interactionCreate(interaction) {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId !== 'embed_builder') return;
    if (!interaction.member.permissions.has('ManageMessages')) {
      return interaction.reply({
        content:
          'You do not have `ManageMessages` permission to use Embed Builder!',
        ephemeral: true,
      });
    }

    try {
      const title = interaction.fields.getTextInputValue('embed_title');
      const description =
        interaction.fields.getTextInputValue('embed_description');
      const color = interaction.fields.getTextInputValue('embed_color');
      const authorInput = interaction.fields.getTextInputValue('embed_author');
      const fieldsInput = interaction.fields.getTextInputValue('embed_fields');

      const embed = new EmbedBuilder()
        .setDescription(description)
        .setTimestamp();

      if (title) embed.setTitle(title);
      if (color) embed.setColor(color);

      if (authorInput) {
        const [authorName, authorUrl, authorIconUrl] = authorInput.split('|');
        embed.setAuthor({
          name: authorName,
          url: authorUrl || null,
          iconURL: authorIconUrl || null,
        });
      }

      if (fieldsInput) {
        const fields = fieldsInput.split('\n').map((field) => {
          const [name, value, inline] = field.split('|');
          return {
            name: name || '\u200b',
            value: value || '\u200b',
            inline: inline || true,
          };
        });
        embed.addFields(fields);
      }

      await interaction.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error creating embed:', error);
      await interaction.reply({
        content: 'Error creating embed. Check your inputs and try again.',
        ephemeral: true,
      });
    }
  },
};
