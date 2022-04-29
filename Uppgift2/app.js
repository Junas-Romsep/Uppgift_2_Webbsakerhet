const Express = require("express");
const BodyParser = require("body-parser");
const Speakeasy = require("speakeasy");
const { request, response } = require("express");

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: true}));


app.post("/totp-secret" ,(request , response , next) =>{
    var Secret = Speakeasy.generateSecret({length:20})
    response.send({"secret" : Secret.base32})
} )

app.post("/totp-generate", (request, response, next) => { 
    response.send({
        "token": Speakeasy.totp({
            secret: request.body.secret,
            encoding: "base32"
        }),
        "remaining": (30 - Math.floor((new Date()).getTime() / 1000.0 % 30))
    });
});

app.post("/totp-validate", (request, response, next) => {
    response.send({
        "valid": Speakeasy.totp.verify({
            secret: request.body.secret,
            encoding: "base32",
            token: request.body.token,
            window: 0
        })
    });
});

app.listen(3000,() => {

    console.log("Port 3000: is upp and running");
})

