var express = require('express');
var bp = require('body-parser');
var _ = require('underscore');
var cluster = require('cluster');
var MongoClient = require('mongodb').MongoClient;
var mypendings = [];
var pid=1;
var db
var app = express();
if (cluster.isMaster){
    var cpuCount = require('os').cpus().length;
    for (var i=0; i<cpuCount;i++){
        cluster.fork();
    }
}

else{
MongoClient.connect('mongodb://admin:admin@ds161001.mlab.com:61001/shwedb',(err,database)=>{
    if(err) return console.log(err)
db=database
})


app.use(bp.json());
app.post('/postmydata',function(req,res){

    db.collection('mytasks').save( req.body ,(err,result) => {
         if(err) return console.log(err)
            console.log('saved to database')
    })
})

app.use(express.static('public'));
app.get('/showdata',(req,res)=> {
    db.collection('mytasks').find().toArray((err,result)=>{
        if(err) return console.log(err)
        res.send('Hello from worker'+ cluster.worker.id);
    })
   
})

app.get('/showdata/:id',function(req,res){
    var todoId=parseInt(req.params.id,10);
    var matchtodoId=_.findWhere(mypendings,{id:todoId});
    if (matchtodoId){
        res.json(matchtodoId);
    } else{
        res.status(404).send();
    }
    
})

app.delete('/deletemydata/:id',function(req,res){
    db.collection('mytasks').findOneAndDelete({name:req.body.name},(err,result)=>{
        if(err) return res.send(500,err)
        res.send('Deleted');
    })
       
})
}
app.listen(3000,function(){
    console.log('server was started-- test');

})