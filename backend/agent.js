const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
  dangerouslyAllowBrowser: true,
});

async function getLocation(ip) {
  const response = await fetch(`https://ipapi.co/${ip}/json/`);
  const locationData = await response.json();
  return locationData;
}

async function getCurrentWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=apparent_temperature`;
  const response = await fetch(url);
  const weatherData = await response.json();
  return weatherData;
}

module.exports = async function generateSuggestions(ipAddress) {
  const locationData = await getLocation(ipAddress);
  const { city, latitude, longitude } = locationData;
  console.log(city, latitude, longitude);
  const weatherData = await getCurrentWeather(latitude, longitude);
  console.log(weatherData);
  const currentWeather = weatherData?.hourly?.apparent_temperature[0];
  console.log(currentWeather);

  const messages = [
    {
      role: "system",
      content: `You are a helpful assistant. Provide suggestions based on the location and weather.`,
    },
    {
      role: "user",
      content: `Given I'm in ${city} and the current weather is ${currentWeather} degree centigrade, can you list the names of three restaurants, three sports events, and three music concerts ideal for this setting? make sure that headers are going to be Restaurants, Sports Events, Music Concerts. Just the names, please.`,
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: messages,
  });

  return response.choices[0].message.content;
};
