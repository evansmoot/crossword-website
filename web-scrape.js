const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

const baseUrl = 'https://www.laxcrossword.com/';
// const baseUrl = 'https://www.laxcrossword.com/2018/05/la-times-crossword-answers-26-may-2018-saturday.html';

request(baseUrl, function (error, response, html) {
    if (!error) {
        var $ = cheerio.load(html);
        var scrapedCluesArr;
        var themedCluesNums;
        $("#clue_list").filter(function () {
            var rawCluesData = $(this).children().eq(2).text() + "\n" + $(this).children().eq(4).text().trim();
            scrapedCluesArr = cluesTextToArray(rawCluesData);
        })

        $("#theme_explanation").filter(function () {
            var themeSection = $(this).text();
            var themeName = themeSection.split('\n')[1].split(':')[1].trim();
            if (themeName === "None") { //there is no theme for the day
                return;
            }
            var themeHint = themeSection.split('\n')[2].split(':')[0].trim();
            var themedAnswersText = $("#theme_explanation").find("ul").text();
            themedCluesNums = themeCluesTextToArray(themedAnswersText);
        })

        for (var i = 0; i < scrapedCluesArr.length; i++) {
            themedCluesNums.includes(scrapedCluesArr[i][0]) ? scrapedCluesArr[i].push(1) : scrapedCluesArr[i].push(0);
        }

        //TODO: Store values in database
        console.log(scrapedCluesArr);
    } else {
        console.log("Error Encountered: " + error);
    }
});


//Given a blob of text from the themed answers section, this function returns an array of the clue numbers that relate to the theme
function themeCluesTextToArray(themedAnswersText) {
    var themedAnswersArr = themedAnswersText.split(/\r?\n/); //splits scraped data into array based on carriage returns
    themedAnswersArr = themedAnswersArr.filter(function (entry) { return entry != '' });

    for (var i = 0; i < themedAnswersArr.length; i++) {
        themedAnswersArr[i] = themedAnswersArr[i].substring(0, themedAnswersArr[i].indexOf("."));
    }
    return themedAnswersArr;
}

function cluesTextToArray(rawCluesData) {
    var data = rawCluesData.split(/\r?\n/); //splits scraped data into array based on carriage returns

    var cluesArr = [];
    var answersArr = [];
    var numsArr = [];

    /* The algorithm below using direction and prevNumber allows us to figure out which clues are Across and which are Down */
    var direction = "A";
    var prevNumber = Number.MIN_SAFE_INTEGER;
    for (var i = 0; i < data.length; i++) {
        var colonIndex = data[i].lastIndexOf(":");
        var hintNum = Number(data[i].substring(0, data[i].indexOf(".")));
        
        if (hintNum < prevNumber) {
            direction = "D";
        }
        prevNumber = hintNum;
        numsArr[i] = hintNum + direction;
        cluesArr[i] = data[i].substring(0, colonIndex - 1).replace(/\d*\. /, ""); //removes clue numbers
        answersArr[i] = data[i].substring(colonIndex + 2).replace(/[^A-Z]|[^\x00-\x7F]/g, ""); //removes any non A-Z character
    }

    return cluesAndAnswersArr = cluesArr.map(function (entry, index) {
        return [numsArr[index], answersArr[index], entry, answersArr[index].length, "LA Times"];
    });
}

app.listen('8080');
console.log('Server is listening on port 8080');

module.exports = app;
