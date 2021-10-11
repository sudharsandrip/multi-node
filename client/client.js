const express = require('express');
const path = require('path')

const app = express();

app.use('/static', express.static(path.join(__dirname, 'public')));

app.listen(4000, () => {
    console.log('Client at 4000...');
});

app.get('*', (req, res) => {
    return res.sendFile(`${__dirname}/public/index.html`);
});
