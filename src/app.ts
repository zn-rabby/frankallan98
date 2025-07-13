import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import session from 'express-session';
import router from './routes';
import { Morgan } from './shared/morgen';
import globalErrorHandler from './globalErrorHandler/globalErrorHandler';
import { notFound } from './app/middleware/notFound';
import { welcome } from './utils/welcome';
import config from './config';
import path from 'path';
import passport from './config/passport';

const app: Application = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//morgan
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);

//body parser
app.use(
     cors({
          origin: config.allowed_origins || '*',
          credentials: true,
     }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration for OAuth
app.use(
     session({
          secret: config.express_sessoin as string,
          resave: false,
          saveUninitialized: false,
          cookie: {
               secure: config.node_env === 'production',
               httpOnly: true,
               maxAge: 24 * 60 * 60 * 1000, // 24 hours
          },
     })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

//file retrieve
app.use(express.static('uploads'));
app.use(express.static('public'));

//router
app.use('/api/v1', router);
//live response
app.get('/', (req: Request, res: Response) => {
     res.send(welcome());
});

//global error handle
app.use(globalErrorHandler);

//handle not found route;
app.use(notFound);

export default app;
