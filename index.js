const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

function temperatureConverter(valNum) {
    valNum = parseFloat(valNum);
    let temp =(valNum-32)/1.8;
    return temp.toFixed(1);
  }

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", temperatureConverter(orgVal.main.temp));
     temperature = temperature.replace("{%tempmax%}", temperatureConverter(orgVal.main.temp_min));
     temperature = temperature.replace("{%tempmin%}", temperatureConverter(orgVal.main.temp_max));
     temperature = temperature.replace("{%location%}", orgVal.name);
     temperature = temperature.replace("{%country%}", orgVal.sys.country);
     temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
 return temperature;
}



const server = http.createServer((req,res) => {
   if(req.url === "/"){
    requests('https://api.openweathermap.org/data/2.5/weather?q=Bengaluru&appid=cca9a849e180bfd08517d45e1276ab1b')
.on('data', (chunk) => {
    // console.log(chunk);
    const objdata = JSON.parse(chunk)
    const arrData = [objdata];
//   console.log(arrData[0].main.temp);
     const realTimeData = arrData.map(val => replaceVal(homeFile,val)).join("");
        res.write(realTimeData);
        // console.log(realTimeData);    
     })
     .on('end', (err) => {
        if(err) return console.log("Connection closed due to errors", err);
        res.end();
     });  
   } 
});

server.listen(8000, "127.0.0.1")