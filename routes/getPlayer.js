'use strict'
const queryPlayer = require('./queryPlayer')
const statCalc = require('./statCalc')
const formatPlayer = (player = {}, stats = {})=>{
  try{
    player = {...player,...stats}
    player.allyCode = +player.allyCode
    player.arena = {
      char:{
        rank: '',
        squad: []
      },
      ship:{
        rank: '',
        squad: []
      }
    }
    player.gp = +(player.profileStat.find(x=>x.index === 1)?.value || 0)
    player.gpChar = +(player.profileStat.find(x=>x.index === 2)?.value || 0)
    player.gpShip = +(player.profileStat.find(x=>x.index === 3)?.value || 0)
    if(player.pvpProfile){
      const charObj = player.pvpProfile.find(x=>x.tab === 1)
      const shipObj = player.pvpProfile.find(x=>x.tab === 2)
      if(charObj){
        player.arena.char.rank = charObj.rank || 0
        if(charObj.squad) player.arena.char.squad = charObj.squad.cell || []
      }
      if(shipObj){
        player.arena.ship.rank = shipObj.rank || 0
        if(shipObj.squad) player.arena.ship.squad = shipObj.squad.cell || []
      }
      delete player.pvpProfile;
    }
    return player
  }catch(e){
    throw(e)
  }
}
module.exports = async(opts = {})=>{
  try{
    let res = await queryPlayer(opts)
    if(!res?.rosterUnit) return
    let stats = await statCalc('calcRosterStats', res.rosterUnit)
    if(!stats || !stats?.roster[res.rosterUnit[0].definitionId.split(':')[0]]) return
    return await formatPlayer(res, stats)
  }catch(e){
    throw(e)
  }
}
