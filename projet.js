var http = require('http');
const fs = require('fs');
let meDictionnary = ['je','me','j\'','mon','ma','mes','moi']
let youDictionnary = ['tu','te','t\'','ton','ta','tes','mes','toi']
let usDictionnary = ['on','nous','nos',]
let day = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi','Vendredi','Samedi','Dimanche']
let hour = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,34,24]
var plotly = require('plotly')("sylvain147", "Ey5ARmoTBY04VqSVTa7b")
let truc = []
let dic = ['a','c\'est','c’est','ai','aie','aient','aies','ait','alors','as','au','aucun','aura','aurai','auraient','aurais','aurait','auras','aurez','auriez','aurions','aurons','auront','aussi','autre','aux','avaient','avais','avait','avant','avec','avez','aviez','avions','avoir','avons','ayant','ayez','ayons','bon','car','ce','ceci','cela','ces','cet','cette','ceux','chaque','ci','comme','comment','d','dans','de','dedans','dehors','depuis','des','deux','devoir','devrait','devrez','devriez','devrions','devrons','devront','dois','doit','donc','dos','droite','du','dès','début','dù','elle','elles','en','encore','es','est','et','eu','eue','eues','eurent','eus','eusse','eussent','eusses','eussiez','eussions','eut','eux','eûmes','eût','eûtes','faire','fais','faisez','fait','faites','fois','font','force','furent','fus','fusse','fussent','fusses','fussiez','fussions','fut','fûmes','fût','fûtes','haut','hors','ici','il','ils','j','je','juste','l','la','le','les','leur','leurs','lui','là','m','ma','maintenant','mais','me','mes','moi','moins','mon','mot','même','n','ne','ni','nom','nommé','nommée','nommés','nos','notre','nous','nouveau','nouveaux','on','ont','ou','où','par','parce','parole','pas','personne','personnes','peu','peut','plupart','pour','pourquoi','qu','quand','que','quel','quelle','quelles','quels','qui','sa','sans','se','sera','serai','seraient','serais','serait','seras','serez','seriez','serions','serons','seront','ses','seulement','si','sien','soi','soient','sois','soit','sommes','son','sont','sous','soyez','soyons','suis','sujet','sur','t','ta','tandis','te','tellement','tels','tes','toi','ton','tous','tout','trop','très','tu','un','une','valeur','voient','vois','voit','vont','vos','votre','vous','vu','y','à','ça','étaient','étais','était','étant','état','étiez','étions','été','étés','êtes','être']
var Buffer = require('buffer').Buffer;
usedWords = []
var Iconv  = require('iconv').Iconv;
var express = require('express');
var app = express();

var formatData = function (file) {
	var input = fs.readFileSync(file,'UTF-8');
    	var data = JSON.parse(input)
    	var iconv = new Iconv('UTF-8', 'ISO-8859-1');
    	let str =''
    	data['messages'].forEach(element => {
			if(element['content']) {
				var buffer = iconv.convert(element.content);
				var buffer2 = iconv.convert(Buffer.from(element.content));
				str = buffer.toString()
				element['content'] = str
			}
		})
		return data
}
let wordsExamine = function(data) {
	var tab = {
		0 : [],
		1 : [],
		2 : [],
		3 : [],
		4 : [],
	}
	examinedWords = []
	data.firstPersonResults.usedWords.forEach(el => {
		examinedWords.push(el[0])
		if(el[3] <20) {
			tab[0].push(el[0])
		}
		else if (el[3]<40){
			tab[1].push(el[0])
		}
		else  if (el[3]<60){
			tab[2].push(el[0])
		}
		else if (el[3]<80){
			tab[3].push(el[0])
		}
		else{
			tab[4].push(el[0])
		}

	})
	data.secondsPersonResults.usedWords.forEach(el=> {
		if(examinedWords.includes(el[0])) return
		if(el[3] <20) {
			tab[4].push(el[0])
		}
		else if (el[3]<40){
			tab[3].push(el[0])
		}
		else if (el[3]<60){
			tab[2].push(el[0])
		}
		else if (el[3]<80){
			tab[1].push(el[0])
		}
		else{
			tab[0].push(el[0])
		}
	})
	return tab
}
var server = http.createServer(function(req, res) {
	res.writeHead(200);
	var iconv = new Iconv('UTF-8', 'ISO-8859-1');
	var input = fs.readFileSync('message_1.json','UTF-8');
	var data = JSON.parse(input)
	let str =''
	data['messages'].forEach(element => {
		if(element['content']) {
			var buffer = iconv.convert(element.content);
			var buffer2 = iconv.convert(Buffer.from(element.content));
			element['content'] = buffer
			str+=buffer
		}
	})

    res.write('<div>'+str+'</div>')




	
	//res.write(final)

  	res.end();
});
let examine = function (data) {
	let totalMessage = 0
	let tt = data['messages'][0]['timestamp_ms']
	let pastGuy = data['messages'][0]['sender_name']
	let name1 = data["participants"][0]['name'] 
	let name2 = data["participants"][1]['name'] 
	let firstMessage = data['messages'][0]['timestamp_ms']
	let lastMessage = data['messages'][data['messages'].length-1]['timestamp_ms']
	let timeMessage = (lastMessage-firstMessage)
	let results = {
		p1 : {
			name : name1,
			nb_message : 0,
			sizeMessage : 0,
			totalTime : 0,
			nbAnswer : 0,
			meDictionnary : 0,
			youDictionnary : 0,
			usDictionnary : 0,
			timeMessage : timeMessage,
			perDay : [0,0,0,0,0,0,0],
			perHour : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			perDate : [],
			perDateCount : [],
			usedWords : []
		},
		p2 : {
			name : name2,
			nb_message : 0,
			sizeMessage : 0,
			totalTime : 0,
			meDictionnary : 0,
			youDictionnary : 0,
			usDictionnary : 0,
			timeMessage : timeMessage,
			perDay : [0,0,0,0,0,0,0],
			perHour : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			nbAnswer : 0,
			usedWords : [],
			perDate : [],
			perDateCount : [],
		}
	}
	let i = 0;
	data['messages'].forEach((element) => {
		let timePast = 0
		let answer = false
		if (pastGuy != element['sender_name']) {
			timePast =  element['timestamp_ms'] -tt
			answer = true
		}
		tt = element['timestamp_ms']
		pastGuy = element['sender_name']
		totalMessage++
		if(element['sender_name'] ==  name1) {
			results.p1 = examineData(results.p1,element,answer,timePast)
		} 
		else {
			results.p2 = examineData(results.p2,element,answer,timePast)

		}
	})
	usedWords.sort(function(a, b) {
    	return b[1] - a[1];
	});
	let firstPersonResults = getData(results.p1)
	let secondsPersonResults = getData(results.p2)
	results.p1.usedWords.sort(function(a, b) {
    	return b[1] - a[1];
	});
		results.p2.usedWords.sort(function(a, b) {
    	return b[1] - a[1];
	});
	drawChart({firstPersonResults, secondsPersonResults})
	return({firstPersonResults, secondsPersonResults})


}


let examineData = function (data,element,answer,timePast) {
	data.nb_message++
	var date = new Date(element['timestamp_ms']);
	date.setTime(date.getTime() + (60*60*1000));
	let exactDate = `${(date.getFullYear())}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`
	if(exactDate == '2019-08-25' && data['name'] == "Sylvain Attoumani") {
		truc.push(element['content'])
	}
	if(data.perDate.includes(exactDate)){
		data.perDateCount[data.perDate.indexOf(exactDate)]++
	}
	else {
		data.perDate.push(exactDate)
		data.perDateCount.push(1)
	}
	data.perHour[date.getHours()]++
	data.perDay[(date.getDay()+6)%7]++
	if (answer) data.nbAnswer ++
	if(element['type']=='Generic' && element['content']){
		let words = element['content'].split(' ')
		element['content'].split(' ').forEach(element => {
			element = element.toLowerCase().trim().replace(',','').replace('.','').replace('!','').replace('?','').replace('’','\'')
			if(meDictionnary.includes(element)) {  data.meDictionnary ++; return}
			if(youDictionnary.includes(element)) {data.youDictionnary ++; return}
			if(usDictionnary.includes(element)) {data.usDictionnary ++; return}
			if(dic.includes(element) || element.length < 3) return;
			let isIn = false
			data.usedWords.forEach (el => {
				if(el[0] == element) {
					el[1]++
					isIn = true
				}
			})
			if(!isIn) {
				data.usedWords.push([element,1])
			}
			let used = false
			usedWords.forEach (el => {
				if(el[0] == element) {
					el[1]++
					used = true
				}
			})
			if(!used) {
				usedWords.push([element,1])
			}
		})
		data.sizeMessage +=element['content'].length
	} 
	data.totalTime+=timePast
	return data
}

let getData = function (data) {
	let dictionnaryWord =  data.meDictionnary + data.youDictionnary + data.usDictionnary
	let avgMessage = millisToMinutesAndSeconds(data.timeMessage/data.nb_message)
	let finalUsed = []
	data.usedWords.forEach(element => {
		usedWords.forEach(el => {
			if(element[0] == el[0] && el[1]>20) {
				finalUsed.push([
					element[0],
					element[1],
					el[1],
					Math.round((element[1]/el[1])*100)
					])
			}
		})
	})
	finalUsed.sort(function(a, b) {
    	return b[2] - a[2];
	});
	let weeks = data.timeMessage / (1000*60*60*24*7);
	let days = (data.timeMessage / (1000*60*60*24)) % 7
	let perDays = []
	perHours =[]
	data.perDay.forEach(element=> {
		perDays.push(Math.round(element/weeks))
	})
	data.perHour.forEach(element => {
		perHours.push(Math.round(element/days))
	})
	return {
		name : data.name,
		totalTime : data.timeMessage,
		perDate : data.perDate,
		perDateCount : data.perDateCount,
		nb_message : data.nb_message,
		avgSize : Math.round(data.sizeMessage/data.nb_message),
		avgTime : millisToMinutesAndSeconds(data.totalTime / data.nbAnswer),
		dictionnaryWord : dictionnaryWord,
		meDictionnary : Math.round(data.meDictionnary/dictionnaryWord*100),
		youDictionnary : Math.round(data.youDictionnary/dictionnaryWord*100),
		usDictionnary : Math.round(data.usDictionnary/dictionnaryWord*100),
		perDay : perDays,
		perHour : perHours,
		avgMessage : avgMessage,
		usedWords : finalUsed,
	}
}
function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function drawChart(data){

}

function drawHour(data) {
	var trace1 = {
  		x: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
  		y: data.firstPersonResults.perHour,
  		name: data.firstPersonResults.name,
  		type: "bar"
	};
	var trace2 = {
  		x: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
  		y: data.secondsPersonResults.perHour,
  		name: data.secondsPersonResults.name,
  		type: "bar"
	};
	var data = [trace1, trace2];
	var layout = {barmode: "group"};
	var graphOptions = {layout: layout, filename: "grouped-bar", fileopt: "overwrite"};
	plotly.plot(data, graphOptions, function (err, msg) {
    	console.log(msg);
	});
}

function drawDate(data) {
	var trace1 = {
  		x: data.p1.perDate,
  		y: data.p1.perDateCount,
  		name: data.p1.name,
  		type: "scatter"
	};
	var trace2 = {
  		x: data.p2.perDate,
  		y: data.p2.perDateCount,
  		name: data.p2.name,
  		type: "scatter"
	};
	var data = [trace1, trace2];
	var graphOptions = {filename: "date-axes", fileopt: "overwrite"};
		plotly.plot(data, graphOptions, function (err, msg) {
    	console.log(msg);
	});
}

function drawDay(data) {
	var trace1 = {
  		x: ["Lundi", "Mardi", "Mercredi","Jeudi","Vendredi","Samedi","Dimanche"],
  		y: data.firstPersonResults.perDay,
  		name: data.firstPersonResults.name,
  		type: "bar"
	};
	var trace2 = {
  		x: ["Lundi", "Mardi", "Mercredi","Jeudi","Vendredi","Samedi","Dimanche"],
  		y: data.secondsPersonResults.perDay,
  		name: data.secondsPersonResults.name,
  		type: "bar"
	};
	var data = [trace1, trace2];
	var layout = {barmode: "group"};
	var graphOptions = {layout: layout, filename: "grouped-bar", fileopt: "overwrite"};
	plotly.plot(data, graphOptions, function (err, msg) {
    	console.log(msg);
	});
}
let first = formatData('message_1.json')
let second = formatData('message_2.json')
	    first['messages'] = (first['messages'].concat(second.messages)).reverse();
    	let result = examine(first)
    	let words = wordsExamine(result)
app.get('/', function(req,res) {

    	res.render('all.ejs',{results : result, wordsa: words[0], wordsb: words[1], wordsc: words[2], wordsd: words[3], wordse: words[4]});
})


app.listen(8080);
