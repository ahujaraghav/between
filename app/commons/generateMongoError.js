function generateMongoError(err){
    const errors = {errors:{}}
    const field = err.errmsg.split('index: ')[1].split('_1')[0]
    errors.errors = {
        [field]: `${field} already registered`
    }
    return errors
}

module.exports = {
    generateMongoError
}