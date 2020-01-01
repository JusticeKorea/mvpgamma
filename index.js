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
    if (message.content.startsWith("2")) {
     message.channel.send("```CSS
🔰 [De manière générale]
```");
  }
     if (message.content.startsWith("3")) {
     message.channel.send("```
• Votre comportement se doit d’être respectueux de tous.
• Les contenus pornographiques, religieux et politiques ainsi que les propos discriminatoires sont strictement interdits.
• Votre langage devra rester correct sur l'ensemble du serveur. 
• Les pseudonymes ou noms de jeux inappropriés (pornographie, publicité, insultes ...) sont strictement interdits.
• Vous serez tenus seul responsable du contenu que vous postez.
• Il vous est interdit d'enregistrer les salons écrits et vocaux
```");
  }
   if (message.content.startsWith("4")) {
     message.channel.send("```CSS
✏️ [Dans les salons écrits]
```");
  }
   if (message.content.startsWith("5")) {
     message.channel.send("```
• Le spam, flood, spoil et abus d'emojis sera sanctionné.
• La diffusion d'informations privées ou de photos sans l'accord de la personne est interdite.
• La publicité n'est autorisée que dans le salon textuel #partages. Mais celle-ci reste interdite en Messages Privés.
• Les commandes doivent être effectuées dans le #commandes-bots.
• Il est strictement interdit de mentionner FuzeIII ou tout autre Youtubeur Ami. Les mentions de rôles sont à éviter sauf en cas de nécessité. Privilégiez les mentions uniques.
```");
  }
  if (message.content.startsWith("6")) {
    message.channel.send("```CSS
🔊 [Dans les salons vocaux]
```");
  }
   if (message.content.startsWith("7")) {
     message.channel.send("```
• Souffler dans son micro, utiliser un modificateur de voix ou des soundboards est interdit.
• Le changement répétitif de channel vocal est interdit.
• Le spam auditif ainsi que les screamers audios sont strictement interdits.
• La musique n’est autorisée que dans les channels prévus à cet effet.
```");
  }
   if (message.content.startsWith("8")) {
     message.channel.send(```CSS
📢 [Informations complémentaires]
```);
  }
   if (message.content.startsWith("9")) {
     message.channel.send("```
• Vous êtes susceptibles d'être sanctionné en cas de manquement à l'une ou plusieurs de ces règles, et ce sans avertissement préalable. 
• La modération se réserve le droit de vous sanctionner pour une raison n'étant pas précisée dans le règlement si votre comportement est inapproprié
• Seuls les modérateurs sont en mesure de faire respecter le règlement.
```");
  }


});

client.login(process.env.TOKEN);
