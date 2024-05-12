function addRoutePrefix(prefix) {
    console.log(prefix);
    return (req, res, next) =>{
        req.url = req.originalUrl  + prefix;
        next();
    }
}

export { addRoutePrefix };