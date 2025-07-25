const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Obtener el clima actual de una ubicación.')
    .addStringOption((option) =>
      option
        .setName('location')
        .setDescription('La ubicación para obtener el clima')
        .setRequired(true)
    ),
  async execute(interaction) {
    const location = interaction.options.getString('location');

    const apiKey = process.env.WEATHER_API;

    if (!apiKey) {
      return await interaction.reply('La clave de API del clima no está configurada.');
    }

    const weatherResponse = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}`
    );

    if (!weatherResponse.ok) {
      return await interaction.reply(
        'No se pudo obtener el clima. Verifica la ubicación e inténtalo de nuevo.'
      );
    }

    const data = await weatherResponse.json();

    if (data.error) {
      return await interaction.reply(
        'No se pudo encontrar ninguna ubicación que coincida con ese nombre. Prueba con otro.'
      );
    }

    const weatherEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(
        `Clima Actual en ${data.location.name}, ${data.location.region}, ${data.location.country}`
      )
      .addFields(
        {
          name: 'Temperatura',
          value: `${data.current.temp_c}°C`,
          inline: true,
        },
        {
          name: 'Condición',
          value: `${data.current.condition.text}`,
          inline: true,
        },
        {
          name: 'Velocidad del Viento',
          value: `${data.current.wind_kph} kph`,
          inline: true,
        },
        {
          name: 'Humedad',
          value: `${data.current.humidity}%`,
          inline: true,
        },
        {
          name: 'Hora Local',
          value: `${data.location.localtime}`,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({ text: 'Datos meteorológicos proporcionados por WeatherAPI' });

    await interaction.reply({ embeds: [weatherEmbed] });
  },
};
