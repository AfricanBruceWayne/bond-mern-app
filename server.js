/*
*   Module dependencies
*/

const express     =   require('express'),
      session     =   require('express-session'),
      bodyParser  =   require('body-parser'),
      chalk       =   require('chalk'),
      flash       =   require('express-flash'),
      MongoStore  =   require('connect-mongo')(session),
      path        =   require('path'),
      mongoose    =   require('mongoose'),
      multer      =   require('multer');




/*
* Create Express server
*/

const app = express();

/*
* Connect to MongoDB
*/
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost:27017/bond_mern_app`);
mongoose.connection.on('error', (err) => {
  console.log(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/*
* Express configuration
*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: '343ji43j4n3jn4jk3n',
  cookie: { maxAge: 1209600000 },
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
  })
}));

app.use(flash());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
  
    const path = require('path');
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
  
  }

const upload = multer({
    dest: path.join(__dirname, 'uploads')
});


/*
* Contollers
*/

/*
* Error Handler
*/
if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorHandler());
  } else {
    app.use((err, req, res, next) => {
      console.error(err);
      res.status(500).send('Server Error');
    });
  }

/*
* Start Express Server
*/

app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
  });
  
  module.exports = app;
  







