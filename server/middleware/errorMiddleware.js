//Unsupported Endpoints

const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`)
    res.status(404)
    next(error);
}

//Error Middleware
const errorHandler=(error, req, res, next)=> {
    if(res.headerSent){
        return next(error);
    }
    res.Error
}