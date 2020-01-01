const Discord = require("discord.js");
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL"] });
const fs = require("fs");
const enmap = require("enmap");

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
     if (message.content.startsWith("1")) {
     message.channel.send("```💡 Afin de conserver une atmosphère agréable dans le discord, nous vous demanderons de suivre ces quelques règles```");
  }
  
});

client.login(process.env.TOKEN);
