//Dependencies
const express = require('express');
const path = require('fs');

//Sets the Express App
const app = express();
const PORT = process.env.PORT || 8080;

//To enable middleware body parsing
app.use(express.urlencoded({extended: true}));
app.use(express.json());




app.listen(PORT, () =>{
    console.log(`App listening on PORT ${PORT}`);
});
