// server setup
var express = require('express'),
 http = require('http'),
 ent = require('ent'),
 app = express(),
 server = http.createServer(app),
 io = require('socket.io').listen(server),
 my_array = [], //array vide
 position;    
 
// Affichage de la page principale todolist
app.get('/todolist', function(request, response)
{
    response.render('todolist.ejs');
})
 
// Reroutage vers la page todolist si la page demandée reste introuvable
.use(function(request, response, next)
{
    response.redirect('/todolist');
});
 
 io.sockets.on('connection', function(socket){
    console.log('User is connected'); //debug
     
    // présentation de la liste mise à jour à l'utilisateur est connecté
    socket.emit('updateArray', my_array);
         
    // Ajout d'un élément à la liste
    socket.on('addToArray', function(task){
       task = ent.encode(task);
       my_array.push(task);         
       position = my_array.length -1;
              
       // diffusion de la liste aux clients connectés
       socket.broadcast.emit('addToArray', {task:task, position:position});
        console.log(my_array); //debug
    });
     
    // Suppression d'un élément de la liste
    socket.on('deleteFromArray', function(position){
        my_array.splice(position, 1);
        io.sockets.emit('updateArray', my_array);
        console.log(my_array); //debug
    });
});

server.listen(8080); //localhost:8080