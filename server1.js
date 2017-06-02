var express = require('express');


var mypendings = [
    {
        task:"go to garden",
        finished: false
    },
    {
        task: "go home",
        finished: false
    }
]
var app = express();
app.use(express.static('public'));
app.get('/showdata',function(req,res){
    res.json(mypendings);
})
app.listen(3000,function(){
    console.log('server was started-- test');

})