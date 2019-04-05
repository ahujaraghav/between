function generateMongooseError(err){

    const errors = {errors:{}}
    for(let key in err.errors){
        errors.errors[key] = err.errors[key].message
    }

    return errors
}

module.exports = {
    generateMongooseError
}