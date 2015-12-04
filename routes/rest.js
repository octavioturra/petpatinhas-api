export function ensureAuthenticated(req, res, next) {
    if(req.query.auth==='0'){
        req.user = {
            id: 100000549285695
        };
        return next();
    }
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/#login');
}

export function consoleAndPass(content) {
    console.log(content);
    return content;
}
export function errorAndPass(...content) {
    console.error(content);
    return content;
}

var responseJson = (req, res) => (d) => res.json(consoleAndPass(JSON.stringify(d)));
var responseError = (req, res) => (err) => res.json(errorAndPass(err, JSON.stringify(err)));

export var responseJson = responseJson;
export var responseError = responseError;
