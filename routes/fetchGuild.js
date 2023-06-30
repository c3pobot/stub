'use strict'
const fetchPlayer = require('./fetchPlayer')
const getGuild = require('./getGuild')
const getGuildId =  require('./getGuildId')
const { eachLimit } = require('async')
const MAX_SYNC = +process.env.MAX_CLIENT_SYNC || 10
const playerCollectionEnum = {guildCache: 'playerCache', twGuildCache: 'twPlayerCache'}
const getPlayers = async(members = [], collection = 'playerCache', project)=>{
  try{
    let res = []
    await eachLimit(members, MAX_SYNC, async(p)=>{
      let player = await fetchPlayer({playerId: p?.playerId, allyCode: p?.allyCode, collection: collection, project: project})
      if(player?.roster){
        player.memberContribution = p.memberContribution
        delete player.rosterUnit
        res.push(player)
      }
    })
    if(res.length === members.length) return res
  }catch(e){
    throw(e)
  }
}
const formatGuild = (g = {}) => {
  try{
    g.gp = 0, g.gpChar = 0, g.gpShip = 0, g.zetaCount = 0, g.omiCount = { total: 0, tb: 0, tw: 0, ga: 0, cq: 0, raid: 0}, g.modCount = {10: 0, 15:0, 20: 0, 25: 0, r6: 0}, g.glCount = {}
    for(let i in g.member){
      g.gp += g.member[i].gp || 0
      g.gpChar += g.member[i].gpChar || 0
      g.gpShip += g.member[i].gpShip || 0
      g.zetaCount += g.member[i].zetaCount || 0
      for(let s in g.member[i].omiCount){
        if(g.omicount[s]) g.omicount[s] += g.member[i].omiCount[s] || 0
      }
      for(let s in g.member[i].modCount){
        if(g.modCount[s]) g.modCount[s] += g.member[i].modCount[s] || 0
      }
      for(let s in g.member[i].glCount){
        if(!s) continue
        if(!g.glCount[s]) g.glCount[s] = 0
        g.glCount[s] += g.member[i].glCount[s] || 0
      }
    }
    return g
  }catch(e){
    throw(e);
  }
}
module.exports = async(opts = {})=>{
  try{
    let guildId = await getGuildId(opts)
    if(!guildId) return
    let collection = opts.collection || 'guildCache'
    let playerCollection = playerCollectionEnum[collection] || 'playerCache'
    let guild = await getGuild({guildId: guildId, collection: collection})
    if(!guild || !guild?.member ) return
    let players = await getPlayers(guild.member, playerCollection, opts.project)
    if(!players) return
    guild.member = players
    return await formatGuild(guild)
  }catch(e){
    console.error(e);
  }
}
