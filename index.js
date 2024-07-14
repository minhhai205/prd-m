const express = require('express');
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const cookieParser= require("cookie-parser")
const flash = require("express-flash")
const session = require("express-session")
require('dotenv').config();

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const systemConfig = require("./config/system");

const database = require("./config/database");
database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodOverride('_method')) // ghi đè phương thức gửi lên

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended:  false }))

app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')

// Flash
app.use(cookieParser("JHKSHFKJSDHF"));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End Flash

// App Locals
app.locals.prefixAdmin = systemConfig.prefixAdmin


app.use(express.static(`${__dirname}/public`));

route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})