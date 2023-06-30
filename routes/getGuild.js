'use strict'
const queryGuild = require('./queryGuild')
const getNewGuild = async(opts = {})=>{
  try{
    let guild = await queryGuild(opts)
    if(guild){
      guild.updated = Date.now()
      guild.id = guild.profile.id
      guild.name = guild.profie.name
      mongo.set(opts.collection, {_id: opts.guildId}, JSON.parse(JSON.stringify(guild)))
    }
    return guild
  }catch(e){
    throw(e);
  }
}
module.exports = async(opts = {})=>{
  try{
    let collection = opts.collection || 'guildCache'
    let guild = (await mongo.find(collection, {_id: opts.guildId}))[0]
    if(!guild) guild = await getNewGuild({guildId: opts.guildId, includeActivity: true, collection: collection})
    return guild
  }catch(e){
    throw(e)
  }
}
