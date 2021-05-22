discord = require('discord.js')
var activevar = [`BurnKnuckle Comrade!`, "Try +help Command!"];
var activities = activevar[Math.floor(Math.random()*activevar.length)];
module.exports = client => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(activities, {type: 'WATCHING'})

}