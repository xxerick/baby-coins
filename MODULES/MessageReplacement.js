module.exports.ToReadableMessage = async function(String, Inviter, Member, Guild){
    let message = String;
    let inviter = Inviter;
    let member = Member;
    let guild = Guild;

    /////* GUILD */////
    if(message.content.includes("${guild.id}")){
        message = await message.replace("${guild.id}", guild.id);
    } if(message.content.includes("${guild.name}")){
        message = await message.replace("${guild.name}", guild.name);
    } if(message.content.includes("${guild.icon}")){
        message = await message.replace("${guild.icon}", guild.iconURL());
    } if(message.content.includes("${guild.membercount}")){
        message = await message.replace("${guild.membercount}", guild.memberCount);
    } if(message.content.includes("${guild.membercount}")){
        message = await message.replace("${guild.membercount}", guild.memberCount);
    }

    /////* MEMBER */////
    if(message.content.includes("${member.tag}")){
        message = await message.replace("${member.tag}", member.user.tag);
    } if(message.content.includes("${member.username}")){
        message = await message.replace("${member.username}", member.user.username);
    } if(message.content.includes("${member.ping}")){
        message = await message.replace("${member.ping}", `<@${member.user.id}>`);
    } if(message.content.includes("${member.id}")){
        message = await message.replace("${member.id}", member.user.id);
    }

    /////* INVITER */////
    if(message.content.includes("${inviter.tag}")){
        message = await message.replace("${inviter.tag}", inviter.user.tag);
    } if(message.content.includes("${inviter.username}")){
        message = await message.replace("${inviter.username}", inviter.user.username);
    } if(message.content.includes("${inviter.ping}")){
        message = await message.replace("${inviter.ping}", `<@${inviter.user.id}>`);
    } if(message.content.includes("${inviter.id}")){
        message = await message.replace("${inviter.id}", inviter.user.id);
    }

    return message;
    
}