const express = require('express')
const app = express()
// const $path = require('path') ##uninstall :)
const port = process.env.PORT || 5000
const fs = require('fs')

app.get('/classes', (request, response) => {
  const data = fs.readFileSync('./json/classes.json');
  const json = JSON.parse(data);
  response.type('json').send(json)
})

app.post('/classes',
  express.json(),
  (request, response) => {
    fs.writeFileSync('./json/classes.json', JSON.stringify(request.body));
    response.status(201).send('Success')
})

app.listen(port, () => console.log(`Listening on port ${port}!`))