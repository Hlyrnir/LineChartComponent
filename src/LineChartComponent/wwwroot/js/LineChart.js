// see https://github.com/vikramlearning/blazorbootstrap/blob/main/blazorbootstrap/wwwroot/blazor.bootstrap.js

if (!window.lineChart) {
    window.lineChart = {};
}

window.lineChart = {
    addDatasetData: (elementId, dataLabel, data) => {
        let chart = window.lineChart.get(elementId);
        if (chart) {
            const chartData = chart.data;
            const chartDatasetData = data;

            if (!chartData.labels.includes(dataLabel))
                chartData.labels.push(dataLabel);

            const chartDatasets = chartData.datasets;

            if (chartDatasets.length > 0) {
                let datasetIndex = chartDatasets.findIndex(dataset => dataset.label === chartDatasetData.datasetLabel);
                if (datasetIndex > -1) {
                    chartDatasets[datasetIndex].data.push(chartDatasetData.data);
                    chart.update();
                }
            }
        }
    },
    addDatasetsData: (elementId, dataLabel, data) => {
        let chart = window.lineChart.get(elementId);
        if (chart && data) {
            const chartData = chart.data;

            if (!chartData.labels.includes(dataLabel)) {
                chartData.labels.push(dataLabel);

                if (chartData.datasets.length > 0 && chartData.datasets.length === data.length) {
                    data.forEach(chartDatasetData => {
                        let datasetIndex = chartData.datasets.findIndex(dataset => dataset.label === chartDatasetData.datasetLabel);
                        chartData.datasets[datasetIndex].data.push(chartDatasetData.data);
                    });
                    chart.update();
                }
            }
        }
    },
    addDataset: (elementId, newDataset) => {
        let chart = window.lineChart.get(elementId);
        if (chart) {
            chart.data.datasets.push(newDataset);
            chart.update();
        }
    },
    create: (elementId, type, data, options, plugins) => {
        let chartEl = document.getElementById(elementId);
        let _plugins = [];

        if (plugins && plugins.length > 0) {
            // register `ChartDataLabels` plugin
            if (plugins.includes('ChartDataLabels')) {
                _plugins.push(ChartDataLabels);

                // set datalabel background color
                options.plugins.datalabels.backgroundColor = function (context) {
                    return context.dataset.backgroundColor;
                };
            }
        }

        const config = {
            type: type,
            data: data,
            options: options,
            plugins: _plugins
        };

        if (type === 'line') {
            const tooltipLine = {
                id: 'tooltipLine',
                beforeDraw: (chart, args, plugins) => {
                    if (chart.tooltip?._active && chart.tooltip?._active.length && plugins.display) {
                        const ctx = chart.ctx;
                        ctx.save();
                        const activePoint = chart.tooltip._active[0];

                        ctx.beginPath();
                        ctx.setLineDash([5, 5]);
                        ctx.moveTo(activePoint.element.x, chart.chartArea.top);
                        ctx.lineTo(activePoint.element.x, activePoint.element.y);
                        ctx.linewidth = 2;
                        ctx.strokeStyle = 'grey';
                        ctx.stroke();
                        ctx.restore();

                        ctx.beginPath();
                        ctx.setLineDash([5, 5]);
                        ctx.moveTo(activePoint.element.x, activePoint.element.y);
                        ctx.lineTo(activePoint.element.x, chart.chartArea.bottom);
                        ctx.linewidth = 2;
                        ctx.strokeStyle = 'grey';
                        ctx.stroke();
                        ctx.restore();

                        ctx.beginPath();
                        ctx.setLineDash([5, 5]);
                        ctx.moveTo(chart.chartArea.left, activePoint.element.y);
                        ctx.lineTo(activePoint.element.x, activePoint.element.y);
                        ctx.linewidth = 2;
                        ctx.strokeStyle = 'grey';
                        ctx.stroke();
                        ctx.restore();

                        ctx.beginPath();
                        ctx.setLineDash([5, 5]);
                        ctx.moveTo(activePoint.element.x, activePoint.element.y);
                        ctx.lineTo(chart.chartArea.right, activePoint.element.y);
                        ctx.linewidth = 2;
                        ctx.strokeStyle = 'grey';
                        ctx.stroke();
                        ctx.restore();
                    }
                },
            };

            config.plugins.push(tooltipLine);
        }

        const chart = new Chart(
            chartEl,
            config
        );
    },
    get: (elementId) => Chart.getChart(elementId),
    initialize: (elementId, type, data, options, plugins) => {
        let chart = window.lineChart.get(elementId);

        if (chart)
            return;
        else
            window.lineChart.create(elementId, type, data, options, plugins);
    },
    resize: (elementId, width, height) => {
        let chart = window.lineChart.get(elementId);
        if (chart) {
            chart.canvas.parentNode.style.height = height;
            chart.canvas.parentNode.style.width = width;
        }
    },
    update: (elementId, type, data, options) => {
        let chart = window.lineChart.get(elementId);
        if (chart) {
            if (chart.config.plugins && chart.config.plugins.findIndex(x => x.id == 'datalabels') > -1) {
                // set datalabel background color
                options.plugins.datalabels.backgroundColor = function (context) {
                    return context.dataset.backgroundColor;
                };
            }

            chart.data = data;
            chart.options = options;
            chart.update();
        }
        else {
            console.warn(`The chart is not initialized. Initialize it and then call update.`);
        }
    },
}