'use strict';
const settings = require('./config/settings')
const axios = require('axios')
const cheerio = require('cheerio')
const AWS  = require('aws-sdk')
const uuid = require('uuid')
// salvando no dynamon
const dynamoDB = new AWS.DynamoDB.DocumentClient()
module.exports.schedueler = async (event) => {
  // sempre iniciando com log da aplicação
  console.log('at',new Date().toISOString(),JSON.stringify(event,null,2))
  const {data} = await axios.get(settings.commitMessageUrl)
  const $ = cheerio.load(data)
  const  [commitMessage]  = await $('#content').text().trim().split('\n')
  const params = {
    TableName: settings.dbTableName,
    Item:{
      id:uuid.v1(),
      commitMessage,
      createdAt: new Date().toISOString()
    }

  }
  await dynamoDB.put(params).promise()
  console.log('Process finished at', new Date().toISOString())
  return{
    statusCode:200
  }
};
