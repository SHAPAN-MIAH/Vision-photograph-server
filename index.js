const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5500

const app = express()
app.use(cors());
app.use(bodyParser.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zpujg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const photographyServicesCollection = client.db("Vision-Photograph").collection("photography-services");
  const teamsCollection = client.db("Vision-Photograph").collection("team-members");
  const appointmentsCollection = client.db("Vision-Photograph").collection("appointments");
  const reviewsCollection = client.db("Vision-Photograph").collection("Reviews");
  const adminCollection = client.db("Vision-Photograph").collection("admin");


      app.post('/addServices', (req, res) => {
           const newServices = req.body;
           console.log('adding services', newServices)
           photographyServicesCollection.insertOne(newServices)
           .then(result => {
               console.log("service added successfully", result.insertedCount)
              res.send(result.insertedCount > 0)
           })
      })

      app.post('/addReview', (req, res) => {
        const newReview = req.body;
        console.log('adding services', newReview)
        reviewsCollection.insertOne(newReview)
        .then(result => {
            console.log("review added successfully", result.insertedCount)
           res.send(result.insertedCount > 0)
        })
   })

      app.post('/addTeam', (req, res) => {
        const newTeam = req.body;
        teamsCollection.insertOne(newTeam)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/teams', (req, res) => {
        teamsCollection.find()
        .toArray((err, teams) => {
            res.send(teams)
        })
    })

    app.get('/services', (req, res) => {
        photographyServicesCollection.find()
        .toArray((err, services) => {
            res.send(services)
        })
    })

    app.get('/reviews', (req, res) => {
      reviewsCollection.find()
      .toArray((err, reviews) => {
          res.send(reviews)
      })
    })

    app.get('/services/:id', (req, res) => {
            const id = ObjectID(req.params.id);
            photographyServicesCollection.find(id)
            .toArray((err, services) => {
              res.send(services)
            })
    })

      app.post('/addAppointment', (req, res) => {
        const newAppointment = req.body;
        console.log('adding appointment', newAppointment)
        appointmentsCollection.insertOne(newAppointment)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
        
      })

      app.get('/appointments', (req, res) => {
        appointmentsCollection.find()
        .toArray((err, appointments) => {
            res.send(appointments)
        })
      })

    
      app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        console.log('adding admin', newAdmin)
        adminCollection.insertOne(newAdmin)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
        
      })

      app.post('/isAdmin', (req, res) => {
          const email = req.body;
          adminCollection.find({email: email})
          .toArray((err, admin) => {
            res.send(admin.length > 0)
          })
        
      })

      app.delete('/deleteAppointment/:id', (req, res)=> {
            const id = ObjectID(req.params.id);
            appointmentsCollection.findOneAndDelete({_id: id})
            .then(result => {
              res.send(result.deletedCount > 0)
            })
      })

  
});

app.get('/', (req, res) => {
  res.send('Hello vision photography  world')
})

app.listen(port)