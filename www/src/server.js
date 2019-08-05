import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import cookieSession from "cookie-session";
import bodyParser from "body-parser";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka() // You can also use Express
	.use(
		compression({ threshold: 0 }),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    cookieSession({
      name: "session",
      secret: "SECRET",
      keys:['VAHE','ASDFASDF','123123'],
      maxAge: 24 * 60 * 60 * 1000
    }),
		sirv('static', { dev }),
		sapper.middleware({
      session:(req,res)=>({
        user:'zeo'
      })
    })
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
