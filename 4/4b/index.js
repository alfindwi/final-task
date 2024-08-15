const express = require('express');
const app = express();
const port = 5000;
const path = require('path');
const session = require('express-session');
const flash = require('express-flash');
const bcrypt = require('bcrypt');
const multer = require('multer');

const db = require('./src/lib/db');
const { QueryTypes } = require("sequelize");

app.set('view engine', 'hbs');
app.set('views', 'assets/views')

app.use('/assets', express.static("assets"));
app.use('/uploads', express.static('uploads'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const upload = multer({
  storage: multer.diskStorage({
     destination: (req, file, cb) => {
        cb(null, "uploads/");
     },
     filename: (req, file, cb) => {
        cb(null, Date.now()+ "-" + file.originalname);
     },
  }),
});


app.use(
  session({
    secret: "hungrywhales",
    cookie: { maxAge: 3600000, secure: false, httpOnly: true },
    saveUninitialized: true,
    resave: false,
    store: new session.MemoryStore(),
  })
);
app.use(flash());

app.get('/', renderHome);
app.get('/login', renderLogin);
app.post('/login', login);
app.get('/logout', logout);
app.get('/register', renderRegister);
app.post('/register', register);
app.get('/add-hero', renderAddHero);
app.post('/add-hero',upload.single('photo'), addHero);
app.get('/add-type', renderAddType);
app.post('/add-type', addType);
app.get('/edit-card/:edit_id', renderEditCard);
app.post('/edit-card/:edit_id', upload.single('photo'), editCard);
app.get('/delete-card/:delete_id', deleteCard);
app.get('/detail/:detail_id', renderDetailHero);



async function renderHome(req, res) {
  try {
    const isLogin = req.session.isLogin

    let result = [];
    if(isLogin) {
      const query =`
        SELECT heroes_tb.*, type_tb.name as type_name 
        FROM heroes_tb 
        JOIN type_tb ON heroes_tb.type_id = type_tb.id 
        WHERE heroes_tb.user_id = ${req.session.user.id};
      `;
      result = await db.query(query, { type: QueryTypes.SELECT });
    }

    res.render('index', {
      data : result,
      isLogin : isLogin,
      user : req.session.user
    });
    
  } catch (error) {
    console.log(error);
  }
}

function renderLogin(req, res) {
  const isLogin = req.session.isLogin
  res.render('login', {
    isLogin : isLogin
  });
}


async function login(req, res) {
  try {
    const { email, password } = req.body; 

    const query = `SELECT * FROM users_tb WHERE email = '${email}'`;
    const existUser = await db.query(query, { type: QueryTypes.SELECT });

    if (existUser.length === 0) {
      req.flash('danger', 'Email Salah');
      return res.redirect('/login');
    }

    const validPassword = await bcrypt.compare(password, existUser[0].password);
    
    if (!validPassword) {
      req.flash('danger', 'password salah');
      return res.redirect('/login');
    }
    req.session.user = existUser[0];
    req.session.isLogin = true;
    res.redirect('/'); 
  } catch (error) {
    console.log(error);
    res.render('login');
  }
}

function logout(req, res) {
  req.session.destroy();
  res.redirect('/');
}


function renderRegister(req, res) {
  res.render('register');
} 

async function register(req, res) {
  try {

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const query = `INSERT INTO users_tb (email, username, password) VALUES ('${req.body.email}', '${req.body.username}', '${hashedPassword}')`;
    await db.query(query, { type: QueryTypes.INSERT });

    req.flash('info', 'Register Berhasil');
    res.redirect('/register');
  } catch (error) {
    console.log(error);
  }
}



async function renderAddHero(req, res) {
  try {
    const types = await db.query("SELECT * FROM type_tb", { type: QueryTypes.SELECT });
    res.render('add-hero', { types: types });
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal Server Error');
  }
}

async function addHero(req, res) {
  try {

    const name = req.body.name;
    const userId = req.session.user.id;
    const type_id = req.body.type_id;
    const photo = req.file.filename;

    const query = `INSERT INTO heroes_tb (name, photo, type_id, user_id) 
    VALUES ('${req.body.name}', '${req.file.filename}', '${req.body.type_id}', '${userId}')`;

    await db.query(query, [name, photo, type_id, userId] );
    req.flash('info', 'Berhasil Menambahkan Card Hero');
    res.redirect('/add-hero');
  } catch (error) {
    console.log(error)
  }
}

function renderAddType(req, res) {
  res.render('add-type');
}

async function addType(req, res) { 
  try {
    const { name } = req.body

    const query = `INSERT INTO type_tb (name) VALUES ('${name}')`;
    await db.query(query, { type: QueryTypes.INSERT }); 

    req.flash('info', 'Berhasil Menambahkan Type');
    res.redirect('/add-type');
  } catch (error) {
    console.log(error)
  }
}

async function renderEditCard(req, res) {
  const id = req.params.edit_id;
  try {
    const query = await db.query(
      `SELECT * FROM heroes_tb WHERE id = ${id}`,
      {
        type: QueryTypes.SELECT
      }
    );

    const typesQuery = await db.query('SELECT * FROM type_tb', {
      type: QueryTypes.SELECT
    })

    res.render('edit-card', {
      data: query[0],
      types: typesQuery
    });

  } catch (error) {
    console.error('Error rendering edit card:', error);
    res.status(500).send('Internal Server Error');
  }
}


async function editCard(req, res) {
  try {
    const id = req.params.edit_id;
    const userId = req.session.user.id;

    const hero = await db.query(
      `SELECT * FROM heroes_tb WHERE id = ${id} AND user_id = ${userId}`,
      { type: QueryTypes.SELECT }
    );

    const newImage = req.file ? req.file.filename : hero[0].photo;

    const query = `
      UPDATE heroes_tb 
      SET name = '${req.body.name}', 
          photo = '${newImage}', 
          type_id = '${req.body.type_id}' 
      WHERE id = ${id} AND user_id = ${userId}
    `;
    await db.query(query);

    req.flash('info', 'Berhasil Mengedit Hero');
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
}


async function deleteCard(req, res) {
  const id = req.params.delete_id;
  const userId = req.session.user.id;
  const query = `DELETE FROM heroes_tb WHERE id = ${id} AND user_id = ${userId}`;
  await db.query(query);
  res.redirect('/');
}

async function renderDetailHero(req, res) {
  const isLogin = req.session.isLogin
  const id = req.params.detail_id

  const query = await db.query(
    `SELECT heroes_tb.*, type_tb.name as type_name, users_tb.username as users_username 
     FROM heroes_tb 
     JOIN type_tb ON heroes_tb.type_id = type_tb.id 
     JOIN users_tb ON heroes_tb.user_id = users_tb.id 
     WHERE heroes_tb.id = ${id}`,
    {type: QueryTypes.SELECT}
  );  

  res.render('detail', { 
    isLogin : isLogin,
    data: query[0]
   });
}











app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
