const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const path = require('path');

const app = express();
const port = 3000;

// Configuração da Sessão
app.use(session({
    secret: 'exiladosz_super_secret_key_123', // Em produção, mude para variável de ambiente (.env)
    resave: false,
    saveUninitialized: false
}));

// Inicialização do Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuração da Estratégia da Steam
// Uma API Key da Steam é recomendada. Pegue em: https://steamcommunity.com/dev/apikey
// Para testar localmente sem key, deixe em branco ou coloque uma string qualquer,
// mas alguns dados de avatar podem não ser retornados perfeitamente dependendo da versão.
passport.use(new SteamStrategy({
    returnURL: 'http://localhost:3000/auth/steam/return',
    realm: 'http://localhost:3000/',
    apiKey: 'SUA_STEAM_API_KEY' // TODO: Substituir pela sua API KEY real
  },
  function(identifier, profile, done) {
    // profile contém os dados retornados pela Steam
    process.nextTick(function () {
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Servir arquivos estáticos (HTML, CSS, JS, Imagens)
app.use(express.static(path.join(__dirname, 'public')));
// Rota extra para servir as imagens geradas pela IA localmente
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));

// Rotas de Autenticação Steam
app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  }
);

// API para verificar se o usuário está logado e retornar dados
app.get('/api/user', (req, res) => {
    if (req.user) {
        res.json({
            loggedIn: true,
            steamid: req.user._json.steamid,
            personaname: req.user._json.personaname,
            avatar: req.user._json.avatarfull
        });
    } else {
        res.json({ loggedIn: false });
    }
});

// Rota de Logout
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.listen(port, () => {
  console.log(`[ExiladosZ] Servidor rodando em http://localhost:${port}`);
  console.log(`[ExiladosZ] Acesse no navegador e teste o login da Steam!`);
});
