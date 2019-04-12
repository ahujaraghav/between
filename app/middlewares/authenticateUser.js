const {User} = require('../models/User');
const jwt = require('jsonwebtoken')

function authenticateUser(req, res, next){
    const token = req.header('x-auth')
    let tokenData;
    try{
    tokenData = jwt.verify(token, 'secret123')
    }
    catch(e){
        res.status(422).send('Provide a valid token')
    }
    // console.log(tokenData)
    User.findById(tokenData.userId)
    .then((user)=>{
        const found = user.tokens.find((userToken)=>{
            return userToken == token
        })
        if(found){
            req.user = user
            next()
        }else{
            res.status(401).send('Request forbidden')
        }
    })
    .catch(()=>{
        res.status(422).send('User not found')
    })

}

module.exports = {
    authenticateUser
}