const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

const baseUrl = 'https://www.laxcrossword.com/';


request(baseUrl, function(error, response, html) {
    if (!error) {
        var $ = cheerio.load(html);
        $("#clue_list").filter(function (){
            var rawData = $(this).children().eq(2).text() + "\n" + $(this).children().eq(4).text().trim();
            var clues = rawData.split(/\r?\n/); //splits scraped data into array based on carriage returns
            clues = clues.map(function(elem) { //removes numbers of clues from array
                return elem.replace(/\d{1,2}\. /, "");
            });
            //TODO: Remove spaces and punctuation from clue answers
            console.log(clues);
        })
    } else {
        console.log("Error Encountered: " + error);
    }
});


app.listen('8080');
console.log('Server is listening on port 8080');

module.exports = app;
