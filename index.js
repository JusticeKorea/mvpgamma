const Discord = require("discord.js");
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL"] });
const fs = require("fs");
const enmap = require("enmap");
const config = require("./config.json");

client.once("ready", () => {
  console.log("Ready!");
  client.user.setActivity(".rien ➜ 🔎", { type: "WATCHING" });
});

client.commands = new Discord.Collection();
client.reactionroles = new enmap({ name: "reactionroles" });
fs.readdir("./commands/", (err, files) => {
  if (err) return console.log(err);

  files.forEach(file => {
    if (!file.endsWith(".js")) return;

    let props = require(`./commands/${file}`);

    let commandName = file.split(".")[0];

    client.commands.set(commandName, props);
  });
});

let prefix = "!";

client.on("message", msg => {
  if (msg.author.bot) return;

  client.reactionroles.ensure(msg.guild.id, {
    roles: [],
    ids: []
  });
  if (msg.content.indexOf(prefix) !== 0) return;

  const args = msg.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  const cmd = client.commands.get(command);

  if (!cmd) return;

  cmd.run(client, msg, args);
});

client.on("guildCreate", guild => {
  client.reactionroles.ensure(guild.id, {
    roles: [],
    ids: []
  });
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.partial) {
    try {
      await reaction.message.fetch();
    } catch (err) {
      console.log("error fetching the message " + err);
    }
  }

  let array = client.reactionroles.get(reaction.message.guild.id, "roles");
  let index = array.findIndex(obj => obj.emojiid == reaction.emoji.id);
  if (
    client.reactionroles
      .get(reaction.message.guild.id, "ids")
      .includes(reaction.message.id) &&
    index > -1
  ) {
    if (
      reaction.message.guild
        .member(user)
        .roles.has(
          reaction.message.guild.roles.find(r => r.name == array[index].role).id
        )
    )
      return;
    reaction.message.guild
      .member(user)
      .roles.add(
        reaction.message.guild.roles.find(r => r.name == array[index].role).id
      );
  }
});
client.on("messageReactionRemove", async (reaction, user) => {
  if (reaction.message.partial) {
    try {
      await reaction.message.fetch();
    } catch (err) {
      console.log("error fetching the message " + err);
    }
  }

  let array = client.reactionroles.get(reaction.message.guild.id, "roles");
  let index = array.findIndex(obj => obj.emojiid == reaction.emoji.id);
  if (
    client.reactionroles
      .get(reaction.message.guild.id, "ids")
      .includes(reaction.message.id) &&
    index > -1
  ) {
    if (
      !reaction.message.guild
        .member(user)
        .roles.has(
          reaction.message.guild.roles.find(r => r.name == array[index].role).id
        )
    )
      return;
    reaction.message.guild
      .member(user)
      .roles.remove(
        reaction.message.guild.roles.find(r => r.name == array[index].role).id
      );
  }
});

client.on("message", message => {
  if (message.content.startsWith("auto")) {
    message.channel.send({ files: ["./image/auto.png"] });
  }
  if (message.content.startsWith("vert")) {
    message.channel.send({ files: ["./image/vert.png"] });
  }
  if (message.content.startsWith("reglement")) {
    message.channel.send({ files: ["./image/reglement.png"] });
  }
  if (message.content.startsWith("team")) {
     message.channel.send({ files: ["./image/dd.png"] });
  }

});
client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if (message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use.
    // To get the "message" itself we join the `args` back into a string with spaces:
    const botmessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o => {});
    // And we get the bot to say the thing:
    message.channel.send(botmessage);
  }
});

var reqTimer = setTimeout(function wakeUp() {
   request("https://dashboard.heroku.com/apps/mvpbeta1", function() {
      console.log("WAKE UP DYNO");
   });
   return reqTimer = setTimeout(wakeUp, 1200000);
}, 1200000);

client.login(process.env.TOKEN);
