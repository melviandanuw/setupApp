const jwt=require('jsonwebtoken');
function signSession(uid){return jwt.sign({uid},process.env.JWT_SECRET,{expiresIn:'12h'});}
function requireAuth(req,res,next){const t=req.cookies?.wenits;if(!t)return res.status(401).json({error:'NO_SESSION'});try{req.uid=jwt.verify(t,process.env.JWT_SECRET).uid;next();}catch{return res.status(401).json({error:'BAD_SESSION'});}}
module.exports={signSession,requireAuth};
