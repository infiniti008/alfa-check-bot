function ROUTER(req, res){
    console.log('in router');
    console.log(req);
    res.statusCode = 200;
    res.end('OK');
}

module.exports = {
    ROUTER : ROUTER
}