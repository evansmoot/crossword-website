const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

// const baseUrl = 'https://www.laxcrossword.com/';
const baseUrl = 'https://www.laxcrossword.com/2018/05/la-times-crossword-answers-26-may-2018-saturday.html';

request(baseUrl, function(error, response, html) {
    if (!error) {
        var $ = cheerio.load(html);
        // $("#clue_list").filter(function (){
        //     var rawCluesData = $(this).children().eq(2).text() + "\n" + $(this).children().eq(4).text().trim();
        //     cleanData(rawCluesData);
        // })

        $("#theme_explanation").filter(function (){
            var themedAnswers = $(this).text();
            var themeName = themedAnswers.split('\n')[1].split(':')[1].trim();
            if (themeName === "None") { //there is no theme for the day
                return;
            }
            var themeHint = themedAnswers.split('\n')[2].split(':')[0].trim();
            console.log(themeHint);
            //TODO: Deal with themes
        })
    } else {
        console.log("Error Encountered: " + error);
    }
    console.log("exited");
});

function cleanData(rawCluesData) {
    var data = rawCluesData.split(/\r?\n/); //splits scraped data into array based on carriage returns

    var cluesArr = [];
    var answersArr = [];
    for (var i = 0; i < data.length; i++) {
        var colonIndex = data[i].lastIndexOf(":");
        cluesArr[i] = data[i].substring(0, colonIndex - 1).replace(/\d*\. /, ""); //removes clue numbers
        answersArr[i] = data[i].substring(colonIndex + 2).replace(/[^A-Z]|[^\x00-\x7F]/g,""); //removes any non A-Z character
    }
    console.log(cluesArr);
    console.log(answersArr);
}

app.listen('8080');
console.log('Server is listening on port 8080');

module.exports = app;
