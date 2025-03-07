const express = require('express');
const os = require('os');
const app = express();
const conversor = require('./convert');
const bodyParser = require('body-parser');
const config = require('./config/system-life');
const path = require('path');
const { httpRequestDurationMicroseconds, httpRequestsTotal, prometheus } = require('./config/metrics'); // Importando o prometheus

app.use(config.middlewares.healthMid);
app.use('/', config.routers);
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware para coletar métricas de cada requisição
app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const routePath = req.route ? req.route.path : req.path; // Usa req.path se req.route não existir

        httpRequestDurationMicroseconds
            .labels(req.method, routePath, res.statusCode)
            .observe(duration);

        httpRequestsTotal
            .labels(req.method, routePath, res.statusCode)
            .inc();
    });

    next();
});

app.get('/fahrenheit/:valor/celsius', (req, res) => {
    let valor = req.params.valor;
    let celsius = conversor.fahrenheitCelsius(valor);
    res.json({ "celsius": celsius, "maquina": os.hostname() });
});

app.get('/celsius/:valor/fahrenheit', (req, res) => {
    let valor = req.params.valor;
    let fahrenheit = conversor.celsiusFahrenheit(valor);
    res.json({ "fahrenheit": fahrenheit, "maquina": os.hostname() });
});

app.get('/', (req, res) => {
    res.render('index', { valorConvertido: '', maquina: os.hostname() });
});

app.post('/', (req, res) => {
    let resultado = '';

    if (req.body.valorRef) {
        if (req.body.selectTemp == 1) {
            resultado = conversor.celsiusFahrenheit(req.body.valorRef);
        } else {
            resultado = conversor.fahrenheitCelsius(req.body.valorRef);
        }
    }

    res.render('index', { valorConvertido: resultado, "maquina": os.hostname() });
});

// Rota para expor as métricas para o Prometheus
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', prometheus.register.contentType);
    res.end(await prometheus.register.metrics());
});

app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080");
});
