function ROUTER(req, res){
    console.log('in router');
    res.statusCode = 200;
    res.end('OK');
}

module.exports = {
    ROUTER : ROUTER
}