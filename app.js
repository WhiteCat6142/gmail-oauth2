const http = require('http');
const express = require('express');
const app = express();
const logger = require("morgan");

const crypto = require('crypto');

let client_id=process.argv[2];
let client_secret=process.argv[3];

const buf = Buffer.alloc(16);
const code_verifier=crypto.randomFillSync(buf).toString('hex');
const code_challenge=crypto.createHash('sha256').update(code_verifier).digest('base64url');


app.use(logger('dev'));

app.get('/oauth2',token);

app.use(function(req, res, next){res.sendStatus(404);});

http.createServer(app).listen(9004, function(){
  console.log("Open https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//mail.google.com/&response_type=code&redirect_uri=http%3A//localhost%3A9004/oauth2&client_id="+client_id+"&code_challenge="+code_challenge+"&code_challenge_method=S256");
});

const https = require('https');

function token(req, res) {

const options = {
  protocol: 'https:',
  host: 'oauth2.googleapis.com',
  path: '/token',
  port: 443,
  method:"POST",
  headers:{'Content-Type':'application/x-www-form-urlencoded'}
};
const str='code='+req.query.code+'&\
client_id='+client_id+'&\
client_secret='+client_secret+'&\
redirect_uri=http%3A//localhost%3A9004/oauth2&\
code_verifier='+code_verifier+'&\
grant_type=authorization_code';

const req2=https.request(options, (res2) => {
  res2.setEncoding('utf8');
  res2.on('data', (chunk) => {
    console.log(chunk);
  });
  res2.on('end', () => {
  });
  res2.on('error', (e) => {
  console.error(e.message);
  });
});
req2.on('error', (e) => {
  console.error(e.message);
});
req2.write(str);
req2.end();

res.end("");
}
