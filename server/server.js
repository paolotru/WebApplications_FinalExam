'use strict';
const express = require('express');
const morgan = require('morgan'); 
const {check, validationResult} = require('express-validator'); 
const dao = require('./dao'); 
const userdao=require('./user_dao');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy; 

passport.use(new LocalStrategy(
  function(username,password,done){
    userdao.getUser(username,password).then((user)=>{
      if(!user)
        return done(null,false,{message:'Incorrect username and/or password.'});
      return done(null,user);
    });
  }
));
passport.serializeUser((user,done)=>{
  done(null,user.id);
});
passport.deserializeUser((id,done)=>{
  userdao.getUserById(id).then((user)=>{
    done(null,user);
  })
  .catch((err)=>{
    done(err,null);
  });
});

// init express
const app = new express();
const port = 3001;
app.use(morgan('dev'));
app.use(express.json()); 
app.use(session({
  secret: 'una frase segreta ma cambiata per far sembrare che non si faccia copia e incolla del back-end set-up',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn=(req,res,next)=>{
  if(req.isAuthenticated())
    return next();
  return res.status(400).json({error:'Not authorized'});
}

app.post('/api/sessions',  function(req, res, next) {
  const errors = validationResult(req);    
  if ( !errors.isEmpty() || req.body.password.length <= 6) {
    return res.status(401).json({message: "Username/password not valid! Try again!"});
  }
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) 
      return res.status(401).json(info);
    req.login(user, (err) => {
      if (err)
        return next(err);
    return res.json(req.user);
    });
  })(req, res, next);
});

//LOGOUT
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

app.get('/api/sessions/current',(req,res)=>{
  if(req.isAuthenticated())
    res.json(req.user);
  else
    res.status(401).json({error:'Not authenticated'});
})

app.get('/api/qs',(req, res) => {
  if(req.query.admin)
    dao.getQsbyAdmin(req.query.admin)   //O req.user.id?
    .then(qs => res.json(qs))
    .catch(()=> res.status(500).end());   
  else
    dao.getallQs()
      .then(qs => res.json(qs))
      .catch(()=> res.status(500).end());   
});
app.get('/api/q',(req, res) => {
    dao.getQbyId(req.query.id) 
    .then(qs => res.json(qs))
    .catch(()=> res.status(500).end());    
});
app.get('/api/ds',(req, res) => {
  dao.getDsbyQId(req.query.qId)
      .then(ds => res.json(ds))
      .catch(()=> res.status(500).end());
});
app.get('/api/r',(req, res) => {
  dao.getRbyQ_user(req.query.qId,req.query.user)
      .then(ds => res.json(ds))
      .catch(()=> res.status(500).end());
});
app.get('/api/mulr',(req, res) => {
  dao.getMultipleRbyD(req.query.dId)
      .then(ds => res.json(ds))
      .catch(()=> res.status(500).end());
});
app.get('/api/ucompilazioni',(req, res) => {
  dao.getUtentibyQId(req.query.qId)
      .then(ds => res.json(ds))
      .catch(()=> res.status(500).end());
});

app.post('/api/q',isLoggedIn,[
  check('name').notEmpty(),
  check('authId').notEmpty(),
  check('authN').notEmpty()
],  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
    return res.status(422).json({errors: errors.array()});
  const q = req.body;
  try{
    dao.createQ(q).then(id=>res.json(id));
  }catch(err){
    res.status(503).json({error:`Generic error`});
  }
});
app.post('/api/d',isLoggedIn,[
  check('text').notEmpty(),
  check('qId').isNumeric(),
  check('min').isNumeric(),
  check('ordine').isNumeric(),
  check('close').notEmpty()
],  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
    return res.status(422).json({errors: errors.array()});
  const d = req.body;
  try{
    dao.createD(d).then(id=>res.json(id));
  }catch(err){
    res.status(503).json({error:`Generic error`});
  }
});
app.post('/api/r',[
  check('user').notEmpty(),
  check('text').notEmpty(),
  check('dId').isNumeric(),
  check('qId').isNumeric(),
],  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
    return res.status(422).json({errors: errors.array()});
  const r = req.body;
  try{
    await dao.createR(r);
    res.status(201).end();
  }catch(err){
    res.status(503).json({error:`Generic error`});
  }
});
app.post('/api/rmultiple',[
  check('text').notEmpty(),
  check('dId').isNumeric(),
],  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
    return res.status(422).json({errors: errors.array()});
  const r=req.body;
  try{
    await dao.createRmult(r);
    res.status(201).end();
  }catch(err){
    res.status(503).json({error:`Generic error`});
  }
});
app.post('/api/compilazione',[
  check('user').notEmpty(),
  check('qId').isNumeric(),
],  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
    return res.status(422).json({errors: errors.array()});
  const comp=req.body;
  try{
    await dao.createCompilazione(comp);
    res.status(201).end();
  }catch(err){
    res.status(503).json({error:`Generic error`});
  }
});
app.post('/api/compilazioneQ',[
  check('qId').isNumeric(),
],  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
    return res.status(422).json({errors: errors.array()});
  const q=req.body;
  try{
    await dao.addCompilazioneQ(q.qId);
    res.status(201).end();
  }catch(err){
    res.status(503).json({error:`Generic error`});
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});