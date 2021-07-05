const express = require("express");
const app = express();
app.use(express.json())
//app.use(bodyParser.json())
 const bodyParser = require('body-parser')
app.use(bodyParser.json())


const mongoose = require('mongoose');
const { ObjectId } = require("mongodb");
const { Int32 } = require("mongodb");
mongoose.connect('mongodb://localhost:27017/dblivresenfolie', {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we''re connected!");
});

let auteurschema=new mongoose.Schema({
id:{
  type:Number,
  require:true
},
nom:String,
prenom:String,
sexe:String,
pays:String,
adresse:{
  numero:Number,
  rue:String,
  commune:String,
  departement:String
},
email:String,
telephone:String
})


/**********************************************************
 * ENDPOINTS POUR AUTEURS
 * 
 *********************************************************/


/** endpoint pour obtenir les auteusrs  */

app.get('/api/auteurs',async(req,res)=>{
try
 {
     const docs=await db.collection('Auteurs').find().toArray()
    res.status(200).json(docs)
  }catch(err){
     console.log(err) 
    throw err
  }
})


/** endpoint pour obtenir un auteur par son id  */
app.get('/api/auteurs/:id',async(req,res)=>{
  var id=parseInt(req.params.id)
  try
   {
       const docs=await db.collection('Auteurs').find({id}).toArray()
      res.status(200).json(docs)
    }catch(err){
       console.log(err) 
      throw err
    }
  })

/** endpoint pour ajouter un auteur */
app.post('/api/auteurs/insert', function (req, res) {
  db.collection('Auteurs').insertOne(req.body, function (err, newauteur) {
       if (err) {
           console.log("ERROR!");
       } else {
           res.redirect("/api/auteurs");
       }
   });
 });

 /** endpoint pour modifier un auteur par son id  */
 app.put('/api/auteurs/update/:id',function(req,res,rest){
db.collection("Auteurs").findOneAndUpdate({id:parseInt(req.params.id)},{$set:{
"Nom":req.body.Nom,
"Prenom":req.body.Prenom
}}).then(function(auteur){
  db.collection('Auteurs').findOne({id:parseInt(req.params.id)}).then(function(auteur){
    res.send(auteur);
  });
 
});

 })


 /** endpoint pour supprimer un auteur par son id  */
app.delete('/api/auteurs/delete/:id',async(req,res)=>{
  var id=parseInt(req.params.id)
       const docs=await db.collection('Auteurs').deleteOne({id})
       res.redirect("/api/auteurs");
    
  })

 /** endpoint pour ajouter un auteur */



/**********************************************************
 * ENDPOINTS POUR LIVRES
 * 
 *********************************************************/


/** endpoint pour obtenir les auteusrs  */

app.get('/api/livres',async(req,res)=>{
  try
   {
       const docs=await db.collection('Livres').find().toArray()
      res.status(200).json(docs)
    }catch(err){
       console.log(err) 
      throw err
    }
  })
  
  
  app.get('/api/livres/:id',async(req,res)=>{
    var id=parseInt(req.params.id)
    try
     {
         const docs=await db.collection('Livres').find({id}).toArray()
        res.status(200).json(docs)
      }catch(err){
         console.log(err) 
        throw err
      }
    })
  
  
  /** endpoint pour ajouter un auteur */
  app.post('/api/livres/insert', function (req, res) {
    db.collection('Livres').insertOne(req.body, function (err,livre) {
         if (err) {
             console.log("ERROR!");
         } else {
             res.redirect("/livres");
         }
     });
   });


    /** endpoint pour modifier un auteur par son id  */
 app.put('/api/livres/update/:id',function(req,res,rest){
  db.collection("Livres").findOneAndUpdate({id:parseInt(req.params.id)},{$set:{
  "titre":req.body.titre,
  "categorie":req.body.categorie,
  "prix":req.body.prix,
  "stock":req.body.stock
  }}).then(function(auteur){
    db.collection('Livres').findOne({id:parseInt(req.params.id)}).then(function(livre){
      res.send(livre);
    
       });
   });
  
   })
       /** endpoint pour retouner des livres par categorie  */
     app.get('/api/livres/categorie/:cat',(req,res)=>{
     var query={categorie: req.params.cat}
     db.collection("Livres").find(query).toArray(function(err,result){
     if(err)throw err;
    res.status(200).json(result);
    });
    
    })
  
 /** endpoint pour supprimer un auteur par son id  */
 app.delete('/api/livres/delete/:id',async(req,res)=>{
  var id=parseInt(req.params.id)
       const docs=await db.collection('Livres').deleteOne({id})
       res.redirect("/api/livres");
    
  })

/**********************************************************
 * ENDPOINTS POUR PANIER
 * 
 *********************************************************/
/** endpoint pour obtenir les auteusrs  */

app.get('/api/paniers',async(req,res)=>{
  try
   {
       const docs=await db.collection('Paniers').find().toArray()
      res.status(200).json(docs)
    }catch(err){
       console.log(err) 
      throw err
    }
  })

  
/** endpoint pour obtenir un panier par son id  */
app.get('/api/paniers/:id',async(req,res)=>{
  var id=parseInt(req.params.id)
  try
   {
       const docs=await db.collection('Paniers').find({id}).toArray()
      res.status(200).json(docs)
    }catch(err){
       console.log(err) 
      throw err
    }
  })

/** endpoint pour ajouter un panier */
app.post('/api/paniers/insert', function (req, res) {
  db.collection('Paniers').insertOne(req.body, function (err) {
       if (err) {
           console.log("ERROR!");
       } else {
           res.redirect("/api/paniers");
       }
   });
 });




 /** endpoint pour supprimer un auteur par son id  */
app.delete('/api/paniers/delete/:id',async(req,res)=>{
  var id=parseInt(req.params.id)
       const docs=await db.collection('Paniers').deleteOne({id})
       res.redirect("/api/paniers");
    
  })


app.listen(9000, () => {
  console.log('Serveur à l\'écoute')
})