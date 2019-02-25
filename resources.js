const serverless = require('serverless-http');
const express = require('express');
const app = express();
const cors = require('cors');
const dbService = require('./dbservice');