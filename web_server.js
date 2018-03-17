const express = require('express');


const app = express();
const PORT = process.env.WEB_PORT || 3000;
// const port = 8080;

// app.use('/subtitles', express.static(__dirname + '/subtitles'));
// app.use('/public', express.static(__dirname + '/public'));
// app.use(fileUpload());
// app.use(express.json()); 

app.listen(PORT, () => {
    console.log('Server started on port', port);
});

app.get('/', (req, res) => {
    
    res.end('sdmsldkmsdkmf');
});

app.post('/incoming_message', (req, res) => {
    console.log(req);
    res.end('Success');
});
