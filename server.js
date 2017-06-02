var express = require('express');
var bp = require('body-parser');
var _ = require('underscore');

var mypendings = [];
var pid=1;

var app = express();
app.use(bp.json());
app.post('/postmydata',function(req,res){
    var body = req.body ;
    body.id=pid++;
    mypendings.push(body);
    res.json(body);
})

app.use(express.static('public'));
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
    var todoId=parseInt(req.params.id,10);
    var matchtodoId=_.findWhere(mypendings,{id:todoId});
    if (!matchtodoId){
        res.status(404).json({"error":"id not found"});
    } else{
        task=_.without(mypendings,matchtodoId);
        res.json(matchtodoId);
    }
    
})
app.listen(3000,function(){
    console.log('server was started-- test');

})