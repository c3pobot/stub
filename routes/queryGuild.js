'use strict'
const apiFetch = require('./apiFetch')
module.exports = async(opts = {includeActivity = true})=>{
  try{
    if(!opts.guildId) return
    let res = await apiFetch('guild' {guildId: opts.guildId, includeRecentGuildActivityInfo: includeActivity})
    return res?.guild
  }catch(e){
    throw(e)
  }
}
