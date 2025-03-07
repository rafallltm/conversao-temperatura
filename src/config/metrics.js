const prometheus = require('prom-client');

// Coleta métricas padrão do Node.js
const collectDefaultMetrics = prometheus.collectDefaultMetrics;

// Coleta métricas padrão a cada 5 segundos
collectDefaultMetrics({ timeout: 5000 });

// Crie um histograma para medir o tempo de resposta das requisições
const httpRequestDurationMicroseconds = new prometheus.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duração das requisições HTTP em ms',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500], // Define os buckets para o histograma
});

// Crie um contador para contar o número de requisições
const httpRequestsTotal = new prometheus.Counter({
    name: 'http_requests_total',
    help: 'Total de requisições HTTP',
    labelNames: ['method', 'route', 'code'],
});

// Exporte as métricas e o prometheus
module.exports = {
    httpRequestDurationMicroseconds,
    httpRequestsTotal,
    prometheus, // Exportando o prometheus
};
