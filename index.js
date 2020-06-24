var express=require("express");
var app =express();
var fs=require('fs')
var bodyParser=require('body-parser');
const { parse } = require("path");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));
app.set('view engine','ejs');
app.get('/',(req,res)=>{
    res.render('index.html');
})
app.post('/solve',(req,res)=>{
    let c=0;
    let h=parseFloat(req.body.height),ini=0.0,prevTime=0.0,t,e=parseFloat(req.body.coeff);
    let g=10.0;
    let ans={
        coor:[[0,0]],
        bounces:0
    }
    // let t=(2*h)/g;
    // t=parseFloat(Math.sqrt(t))
    // console.log(t)
    if(req.body.coeff==="1"){
        console.log("coeff should ne less than 1");
        res.json({});
    }
    while(1){
        if(h===0){
            if(ini===0){
                break;
            }
            h=parseFloat((ini*ini)/(2*g))
            t=parseFloat(ini/g);
            let vel=ini;
            while(vel>0){
                let time=parseFloat((ini-vel)/g);
                let height=parseFloat(0.5*g*time*time);
                ans.coor.push([prevTime+time,height]);
                vel=vel-0.1;
            }
            prevTime+=t;
            ini=0.0;

        }
        else{
            if(h<0.05){
                break;
            }
            t=parseFloat(2*h)/g;
            t=parseFloat(Math.sqrt(t));
            ini=parseFloat(g*t);
            let vel=0;
            while(vel<=ini){
                let time=parseFloat(vel/g);
                let height=parseFloat(0.5*g*time*time);
                ans.coor.push([prevTime+time,h-height]);
                vel=vel+0.1;
            }
            h=0.0
            ini=ini*e;
            prevTime+=t;
            ans.bounces++;
        }
        
    }
    // console.log(ans);
    var jsonContent = JSON.stringify(ans);
    fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        } console.log("JSON file has been saved.");
    });
    res.send("success");
})
app.listen(3000);