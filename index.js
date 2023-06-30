'use strict'
const clientRoutes = require('./routes')
module.exports = async(uri, payload = {}, identity = null)=>{
  try{
    if(clientRoutes[uri]) return await clientRoutes[uri](payload, identity)
    return await clientRoutes.apiFetch(uri, payload, identity)
  }catch(e){
    throw(e)
  }
}
