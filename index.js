const discord = require("discord.js");
const botConfig = require("./botconfig.json");
 
const client = new discord.Client();
client.login(process.env.token);
 
client.on("ready", async () => {
 
    console.log(`${client.user.username} is online.`);
 
    client.user.setActivity("*help", { type: "PLAYING" });
 
});
 
 
client.on("message", async message => {
 
    if(message.author.bot) return;
 
    if(message.channel.type === "dm") return;
 
    var prefix = botConfig.prefix;
 
    var messageArray = message.content.split(" ");
 
    var command = messageArray[0];

    if (command === `${prefix}hello`){

        return message.reply("hello")

    }

    if (command === `${prefix}invite`){

        return message.reply("here is the invite link off the bot: https://discordapp.com/oauth2/authorize?client_id=704013464712118372&scope=bot")

    }

    if (command === `${prefix}help`){

        var embedHelp = new discord.MessageEmbed()
        .setColor("#3481ed")
        .setTitle("these are the comands of the bot")
        .setDescription(`**for the visitors**
        ** ${prefix}hello:** have the bot send hello back
        ** ${prefix}invite:** show the invite link
        ** ${prefix}help:** has all the comands on
        **for the staff members who can kick people**
        ** ${prefix}kick:** do you want to kick someone because he does not comply with the rules, for example (are still errors)`);

         return message.reply(embedHelp)

    }
 
    if (command === `${prefix}kick`) {
 
        const args = message.content.slice(prefix.length).split(/ +/);
 
        if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("sorry jij kan dit niet");
 
        if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("Geen perms");
 
        if (!args[1]) return message.reply("Geen gebruiker opgegeven.");
 
        if (!args[2]) return message.reply("Gelieve een redenen op te geven.");
 
        var kickUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));
 
        var reason = args.slice(2).join(" ");
 
        if (!kickUser) return message.reply("Kan de gebruiker niet vinden.");
 
        var embed = new discord.MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(kickUser.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(`** Gekickt:** ${kickUser} (${kickUser.id})
            **Gekickt door:** ${message.author}
            **Redenen: ** ${reason}`);
 
        var embedPrompt = new discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor("Gelieve te reageren binnen 30 sec.")
            .setDescription(`Wil je ${kickUser} kicken?`);
 
 
        message.channel.send(embedPrompt).then(async msg => {
 
            var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);
 
 
            // We kijken dat het de gebruiker is die het als eerste heeft uitgevoerd.
            // message.channel.awaitMessages(m => m.author.id == message.author.id,
            //     { max: 1, time: 30000 }).then(collected => {
 
            //         if (collected.first().content.toLowerCase() == 'yes') {
            //             message.reply('Kick speler.');
            //         }
            //         else
            //             message.reply('Geanuleerd');
 
            //     }).catch(() => {
            //         message.reply('Geen antwoord na 30 sec, geanuleerd.');
            //     });
 
 
            if (emoji === "✅") {
 
                msg.delete();
 
                kickUser.kick(reason).catch(err => {
                    if (err) return message.channel.send(`Er is iets foutgegaan.`);
                });
 
                message.reply(embed);
 
            } else if (emoji === "❌") {
 
                msg.delete();
 
                message.reply("Kick geanuleerd").then(m => m.delete(5000));
 
            }
 
        });
    }
 
 
    if (command === `${prefix}ban`) {
 
        const args = message.content.slice(prefix.length).split(/ +/);
 
        if (!args[1]) return message.reply("Geen gebruiker opgegeven.");
 
        if (!args[2]) return message.reply("Gelieve een redenen op te geven.");
 
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply("sorry jij kan dit niet");
 
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.reply("Geen perms");
 
        var banUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));
 
        var reason = args.slice(2).join(" ");
 
        if (!banUser) return message.reply("Kan de gebruiker niet vinden.");
 
        var embed = new discord.MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(banUser.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(`** Geband:** ${banUser} (${banUser.id})
            **Geband door:** ${message.author}
            **Redenen: ** ${reason}`);
 
        var embedPrompt = new discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor("Gelieve te reageren binnen 30 sec.")
            .setDescription(`Wil je ${banUser} bannen?`);
 
 
        message.channel.send(embedPrompt).then(async msg => {
 
            var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);
 
 
            // We kijken dat het de gebruiker is die het als eerste heeft uitgevoerd.
            // message.channel.awaitMessages(m => m.author.id == message.author.id,
            //     { max: 1, time: 30000 }).then(collected => {
 
            //         if (collected.first().content.toLowerCase() == 'yes') {
            //             message.reply('Kick speler.');
            //         }
            //         else
            //             message.reply('Geanuleerd');
 
            //     }).catch(() => {
            //         message.reply('Geen antwoord na 30 sec, geanuleerd.');
            //     });
 
 
            if (emoji === "✅") {
 
                msg.delete();
 
               
                banUser.ban(reason).catch(err => {
                    if (err) return message.channel.send(`Er is iets foutgegaan.`);
                });
 
                message.reply(embed);
 
            } else if (emoji === "❌") {
 
                msg.delete();
 
                message.reply("Ban geanuleerd").then(m => m.delete(5000));
 
            }
 
        });
    }
 
// Emojis aan teksten kopellen.
async function promptMessage(message, author, time, reactions) {
    // We gaan eerst de tijd * 1000 doen zodat we seconden uitkomen.
    time *= 1000;
 
    // We gaan ieder meegegeven reactie onder de reactie plaatsen.
    for (const reaction of reactions) {
        await message.react(reaction);
    }
 
    // Als de emoji de juiste emoji is die men heeft opgegeven en als ook de auteur die dit heeft aangemaakt er op klikt
    // dan kunnen we een bericht terug sturen.
    const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id;
 
    // We kijken als de reactie juist is, dus met die filter en ook het aantal keren en binnen de tijd.
    // Dan kunnen we bericht terug sturen met dat icoontje dat is aangeduid.
    return message.awaitReactions(filter, { max: 1, time: time }).then(collected => collected.first() && collected.first().emoji.name);
}
 
});