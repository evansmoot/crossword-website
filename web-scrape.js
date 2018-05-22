const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

app.listen('8080');
console.log('Server is listening on port 8080');

module.exports = app;
