$(document).ready(function(){

        hasura.setProject('alike21');

        function makeDropdown(data){
                console.log("Got this data: ");
                console.log(data);

                var sectors = [];

                sel = $("#dropdown-field");
                $.each(data, function(k, v){
                        if (sectors.indexOf(v.sector_name.toString()) < 0){
                                sectors.push(v.sector_name.toString());
                                sel.append('<option value="' + v.sector_name + '">' + v.sector_name + '</option>');
                }});

        }

        hasura.data.query({
                type:'select',
                args: {
                        table: 'stocks',
                        columns: ['*']
                }},
                (data) => {makeDropdown(data)},
                (error) => {console.log(error);});

                console.log("Getting data from database... ");

                $("#dropdown-field").on('change', function(e){
                var sector = $('#dropdown-field').val();
                console.log(sector);
                hasura.data.query({
                        type:'select',
                        args: {
                                table: 'stocks',
                                columns: ['*', {
                                        name : "financials",
                                        columns : ["*","year"],
                                        order_by: "+year"
                                }],
                                where: {
                                        sector_name:sector
                                }
                        }},
                        (data) => {
                                    drawRevenueChart(data);
                                    drawTotalGrossProfitChart(data);
                                    drawNetIncomeChart(data);
                                    drawProfitMarginChart(data);
                                    drawReturnOnEquityChart(data);
                                    drawDebtToTotalCapital(data);
                                    drawEarningsPerShare(data);
                                    drawMarketcap(data);
                                    drawTotalAssets(data);
                                    drawTotalLiabilities(data);
                        },
                        (error) => {console.log(error);}
                );

                function drawRevenueChart(sectors) {

                        $("#canvas-revenue").remove();
                        $("#canvas-container-revenue").append('<canvas id="canvas-revenue"></canvas>');

                        var canvas = document.getElementById('canvas-revenue');
                        var ctx = canvas.getContext('2d');
                        var datasets = [];
                        var index = 0;

                        $.each(sectors,function(k,company) {
                                var color = window.chartColors[Object.keys(window.chartColors)[index%7]];
                                index += 1;
                                var dataset = {
                                        label: company.stock_name,
                                        backgroundColor: color,
                                        borderColor: color,
                                        data : [
                                                company.financials[0].total_revenue,
                                                company.financials[1].total_revenue,
                                                company.financials[2].total_revenue,
                                                company.financials[3].total_revenue
                                        ],
                                        fill:false
                                }
                                datasets.push(dataset);
                        });

                        var data = {
                                labels: ['2013','2014','2015','2016'],
                                datasets: datasets
                        }

                        var opts = {
                                responsive: false,
                                title:{
                                        display:true,
                                        text: sectors[0].sector_name + ' Total Revenue'
                                },
                                tooltips: {
                                        mode: 'index',
                                        intersect: false,
                                },
                                hover: {
                                        mode: 'nearest',
                                        intersect: true
                                },
                                scales: {
                                        xAxes: [{
                                                display: true,
                                                scaleLabel: {
                                                        display: true,
                                                        labelString: 'Year'
                                                }
                                        }],
                                        yAxes: [{
												ticks: {
													beginAtZero: true,
                                                    userCallback: function(value,index,values){
                                                        value = value.toString();
                                                        value = value.split(/(?=(?:...)*$)/);
                                                        value = value.join(',');
                                                        value = '$' + value;
                                                        return value;

                                                    }

												},
                                                display: true,
                                                scaleLabel: {
                                                        display: true,
                                                        labelString: ' Total Revenue'
                                                }

                                        }]
                                }
                        }
                        canvas.width = 600;
                        canvas.height = 400;
                        window.myChart = new Chart(ctx, {type:'line',data: data,options:opts});
                        console.log("Revenue Chart created");
                }

                function drawTotalGrossProfitChart(sectors) {

                        $("#canvas-total-gross-profit").remove();
                        $("#canvas-container-total-gross-profit").append('<canvas id="canvas-total-gross-profit"></canvas>');

                        var canvas = document.getElementById('canvas-total-gross-profit');
                        var ctx = canvas.getContext('2d');
                        var datasets = [];
                        var index = 0;

                        $.each(sectors,function(k,company) {
                                var color = window.chartColors[Object.keys(window.chartColors)[index%7]];
                                index += 1;
                                var dataset = {
                                        label: company.stock_name,
                                        backgroundColor: color,
                                        borderColor: color,
                                        data : [
                                                company.financials[0].total_gross_profit,
                                                company.financials[1].total_gross_profit,
                                                company.financials[2].total_gross_profit,
                                                company.financials[3].total_gross_profit
                                        ],
                                        fill:false
                                }
                                datasets.push(dataset);
                        });

                        var data = {
                                labels: ['2013','2014','2015','2016'],
                                datasets: datasets
                        }

                        var opts = {
                                responsive: false,
                                title:{
                                        display:true,
                                        text: sectors[0].sector_name + ' Total Gross Profit'
                                },
                                tooltips: {
                                        mode: 'index',
                                        intersect: false,
                                },
                                hover: {
                                        mode: 'nearest',
                                        intersect: true
                                },
                                scales: {
                                        xAxes: [{
                                                display: true,
                                                scaleLabel: {
                                                        display: true,
                                                        labelString: 'Year'
                                                }
                                        }],
                                        yAxes: [{
												ticks: {
                                                     beginAtZero: true,
                                                     userCallback: function(value,index,values){
                                                         value = value.toString();
                                                         value = value.split(/(?=(?:...)*$)/);
                                                         value = value.join(',');
                                                         value = '$' + value;
                                                         return value;

                                                     }

                                                 },
                                                display: true,
                                                scaleLabel: {
                                                        display: true,
                                                        labelString: ' Total Gross Profit'
                                                }
                                        }]
                                }
                        }
                        canvas.width = 600;
                        canvas.height = 400;
                        window.myChart = new Chart(ctx, {type:'line',data: data,options:opts});
                        console.log("Total Gross Profit Chart created");
                }

                function drawNetIncomeChart(sectors) {

                        $("#canvas-net-income").remove();
                        $("#canvas-container-net-income").append('<canvas id="canvas-net-income"></canvas>');

                        var canvas = document.getElementById('canvas-net-income');
                        var ctx = canvas.getContext('2d');
                        var datasets = [];
                        var index = 0;

                        $.each(sectors,function(k,company) {
                                var color = window.chartColors[Object.keys(window.chartColors)[index%7]];
                                index += 1;
                                var dataset = {
                                        label: company.stock_name,
                                        backgroundColor: color,
                                        borderColor: color,
                                        data : [
                                                company.financials[0].net_income,
                                                company.financials[1].net_income,
                                                company.financials[2].net_income,
                                                company.financials[3].net_income
                                        ],
                                        fill:false
                                }
                                datasets.push(dataset);
                        });

                        var data = {
                                labels: ['2013','2014','2015','2016'],
                                datasets: datasets
                        }

                        var opts = {
                                responsive: false,
                                title:{
                                        display:true,
                                        text: sectors[0].sector_name + ' Net Income'
                                },
                                tooltips: {
                                        mode: 'index',
                                        intersect: false,
                                },
                                hover: {
                                        mode: 'nearest',
                                        intersect: true
                                },
                                scales: {
                                        xAxes: [{
                                                display: true,
                                                scaleLabel: {
                                                        display: true,
                                                        labelString: 'Year'
                                                }
                                        }],
                                        yAxes: [{
												ticks: {
                                                      beginAtZero: true,
                                                      userCallback: function(value,index,values){
                                                          value = value.toString();
                                                          value = value.split(/(?=(?:...)*$)/);
                                                          value = value.join(',');
                                                          value = '$' + value;
                                                          return value;

                                                      }

                                                },
                                                display: true,
                                                scaleLabel: {
                                                        display: true,
                                                        labelString: ' Net Income'
                                                }
                                        }]
                                }
                        }
                        canvas.width = 600;
                        canvas.height = 400;
                        window.myChart = new Chart(ctx, {type:'line',data: data,options:opts});
                        console.log("Net Income Chart created");
                }

                function drawProfitMarginChart(sectors) {

                        $("#canvas-profit-margin").remove();
                        $("#canvas-container-profit-margin").append('<canvas id="canvas-profit-margin"></canvas>');

                        var canvas = document.getElementById('canvas-profit-margin');
                        var ctx = canvas.getContext('2d');
                        var datasets = [];
                        var index = 0;

                        $.each(sectors,function(k,company) {
                                var color = window.chartColors[Object.keys(window.chartColors)[index%7]];
                                index += 1;
                                var dataset = {
                                        label: company.stock_name,
                                        backgroundColor: color,
                                        borderColor: color,
                                        data : [
                                                company.financials[0].profit_margin,
                                                company.financials[1].profit_margin,
                                                company.financials[2].profit_margin,
                                                company.financials[3].profit_margin
                                        ],
                                        fill:false
                                }
                                datasets.push(dataset);
                        });

                        var data = {
                                labels: ['2013','2014','2015','2016'],
                                datasets: datasets
                        }

                        var opts = {
                                responsive: false,
                                title:{
                                        display:true,
                                        text: sectors[0].sector_name + ' Profit Margin'
                                },
                                tooltips: {
                                        mode: 'index',
                                        intersect: false,
                                },
                                hover: {
                                        mode: 'nearest',
                                        intersect: true
                                },
                                scales: {
                                        xAxes: [{
                                                display: true,
                                                scaleLabel: {
                                                        display: true,
                                                        labelString: 'Year'
                                                }
                                        }],
                                        yAxes: [{
                                                display: true,
                                                scaleLabel: {
                                                        display: true,
                                                        labelString: ' Profit Margin'
                                                }
                                        }]
                                }
                        }
                        canvas.width = 600;
                        canvas.height = 400;
                        window.myChart = new Chart(ctx, {type:'line',data: data,options:opts});
                        console.log("Profit Margin Chart created");
                }

                function drawReturnOnEquityChart(sectors) {

                        $("#canvas-ret-on-equity").remove();
                        $("#canvas-container-ret-on-equity").append('<canvas id="canvas-ret-on-equity"></canvas>');

                        var canvas = document.getElementById('canvas-ret-on-equity');
                        var ctx = canvas.getContext('2d');
                        var datasets = [];
                        var index = 0;

                        $.each(sectors,function(k,company) {
                                var color = window.chartColors[Object.keys(window.chartColors)[index%7]];
                                index += 1;
                                var dataset = {
                                        label: company.stock_name,
                                        backgroundColor: color,
                                        borderColor: color,
                                        data : [
                                                company.financials[0].return_on_equity,
                                                company.financials[1].return_on_equity,
                                                company.financials[2].return_on_equity,
                                                company.financials[3].return_on_equity
                                        ],
                                        fill:false
                                }
                                datasets.push(dataset);
                        });

                        var data = {
                                labels: ['2013','2014','2015','2016'],
                                datasets: datasets
                        }

                        var opts = {
                                responsive: false,
                                title:{
                                        display:true,
                                        text: sectors[0].sector_name + ' Return On Equity'
                                },
                                tooltips: {
                                        mode: 'index',
                                        intersect: false,
                                },
                                hover: {
                                        mode: 'nearest',
                                        intersect: true
                                },
                                scales: {
                                        xAxes: [{
                                                display: true,
                                                scaleLabel: {
                                                        display: true,
                                                        labelString: 'Year'
                                                }
                                        }],
                                        yAxes: [{
                                                display: true,
                                                scaleLabel: {
                                                        display: true,
                                                        labelString: ' Return On Equity'
                                                }
                                        }]
                                }
                        }
                        canvas.width = 600;
                        canvas.height = 400;
                        window.myChart = new Chart(ctx, {type:'line',data: data,options:opts});
                        console.log("Return On Equity Chart created");
                }

                function drawDebtToTotalCapital(sectors) {

                        $("#canvas-debt-to-total-capital").remove();
                        $("#canvas-container-debt-to-total-capital").append('<canvas id="canvas-debt-to-total-capital"></canvas>');

                        var canvas = document.getElementById('canvas-debt-to-total-capital');
                        var ctx = canvas.getContext('2d');
                        var datasets = [];
                        var index = 0;

                        $.each(sectors,function(k,company) {
                                var color = window.chartColors[Object.keys(window.chartColors)[index%7]];
                                index += 1;
                                var dataset = {
                                        label: company.stock_name,
                                        backgroundColor: color,
                                        borderColor: color,
                                        data : [
                                                company.financials[0].debt_to_total_capital,
                                                company.financials[1].debt_to_total_capital,
                                                company.financials[2].debt_to_total_capital,
                                                company.financials[3].debt_to_total_capital
                                        ],
                                        fill:false
                                }
                                datasets.push(dataset);
                        });

                        var data = {
                                labels: ['2013','2014','2015','2016'],
                                datasets: datasets
                        }

                        var opts = {
                                responsive: false,
                                title:{
                                        display:true,
                                        text: sectors[0].sector_name + ' Debt To Total Capital'
                                },
                                tooltips: {
                                        mode: 'index',
                                        intersect: false,
                                },
                                hover: {
                                        mode: 'nearest',
                                        intersect: true
                                },
                                scales: {
                                        xAxes: [{
                                                display: true,
                                                scaleLabel: {
                                                        display: true,
                                                        labelString: 'Year'
                                                }
                                        }],
                                        yAxes: [{
                                                display: true,
                                                scaleLabel: {
                                                        display: true,
                                                        labelString: ' Debt To Total Capital'
                                                }
                                        }]
                                }
                        }
                        canvas.width = 600;
                        canvas.height = 400;
                        window.myChart = new Chart(ctx, {type:'line',data: data,options:opts});
                        console.log("Debt To Total Capital Chart created");
                }

                function drawEarningsPerShare(sectors) {

                        $("#canvas-earnings-per-share").remove();
                        $("#canvas-container-earnings-per-share").append('<canvas id="canvas-earnings-per-share"></canvas>');

                        var canvas = document.getElementById('canvas-earnings-per-share');
                        var ctx = canvas.getContext('2d');
                        var datasets = [];
                        var index = 0;

                        $.each(sectors,function(k,company) {
                                var color = window.chartColors[Object.keys(window.chartColors)[index%7]];
                                index += 1;
                                var dataset = {
                                        label: company.stock_name,
                                        backgroundColor: color,
                                        borderColor: color,
                                        data : [
                                                company.financials[0].earnings_per_share,
                                                company.financials[1].earnings_per_share,
                                                company.financials[2].earnings_per_share,
                                                company.financials[3].earnings_per_share
                                        ],
                                        fill:false
                                }
                                datasets.push(dataset);
                        });

                        var data = {
                                labels: ['2013','2014','2015','2016'],
                                datasets: datasets
                        }

                        var opts = {
                                responsive: false,
                                title:{
                                        display:true,
                                        text: sectors[0].sector_name + ' Earnings Per Share'
                                },
                                tooltips: {
                                        mode: 'index',
                                        intersect: false,
                                },
                                hover: {
                                        mode: 'nearest',
                                        intersect: true
                                },
                                scales: {
                                        xAxes: [{
                                                display: true,
                                                scaleLabel: {
                                                        display: true,
                                                        labelString: 'Year'
                                                }
                                        }],
                                        yAxes: [{
                                                ticks: {
                                                    beginAtZero: true,
                                                    userCallback: function(value,index,values){
                                                        value = '$' + value.toString();
                                                        return value;
                                                    }
                                                },
                                                display: true,
                                                scaleLabel: {
                                                        display: true,
                                                        labelString: ' Earnings Per Share'
                                                }
                                        }]
                                }
                        }
                        canvas.width = 600;
                        canvas.height = 400;
                        window.myChart = new Chart(ctx, {type:'line',data: data,options:opts});
                        console.log("Earnings Per Share Chart created");
                }

                function drawMarketcap(sectors) {

                        $("#canvas-marketcap").remove();
                        $("#canvas-container-martekcap").append('<canvas id="canvas-marketcap"></canvas>');

                        var canvas = document.getElementById('canvas-marketcap');
                        var ctx = canvas.getContext('2d');
                        var datasets = [];
                        var index = 0;

                        $.each(sectors,function(k,company) {
                                var color = window.chartColors[Object.keys(window.chartColors)[index%7]];
                                index += 1;
                                var dataset = {
                                        label: company.stock_name,
                                        backgroundColor: color,
                                        borderColor: color,
                                        data : [
                                                company.financials[0].marketcap,
                                                company.financials[1].marketcap,
                                                company.financials[2].marketcap,
                                                company.financials[3].marketcap
                                        ],
                                        fill:false
                                }
                                datasets.push(dataset);
                        });

                        var data = {
                                labels: ['2013','2014','2015','2016'],
                                datasets: datasets
                        }

                        var opts = {
                                responsive: false,
                                title:{
                                        display:true,
                                        text: sectors[0].sector_name + ' Market Cap'
                                },
                                tooltips: {
                                        mode: 'index',
                                        intersect: false,
                                },
                                hover: {
                                        mode: 'nearest',
                                        intersect: true
                                },
                                scales: {
                                        xAxes: [{
                                                display: true,
                                                scaleLabel: {
                                                        display: true,
                                                        labelString: 'Year'
                                                }
                                        }],
                                        yAxes: [{
                                                ticks: {
                                                        beginAtZero: true,
                                                        userCallback: function(value,index,values) {
                                                            value = value.toString();
                                                            value = value.split(/(?=(?:...)*$)/);
                                                            value = value.join(',');
                                                            return value;
                                                        }

                                                },
                                                display: true,
                                                scaleLabel: {
                                                        display: true,
                                                        labelString: ' Market Cap'
                                                }
                                        }]
                                }
                        }
                        canvas.width = 600;
                        canvas.height = 400;
                        window.myChart = new Chart(ctx, {type:'line',data: data,options:opts});
                        console.log("Marketcap Chart created");
                }

                function drawTotalAssets(sectors) {

                        $("#canvas-total-assets").remove();
                        $("#canvas-container-total-assets").append('<canvas id="canvas-total-assets"></canvas>');

                        var canvas = document.getElementById('canvas-total-assets');
                        var ctx = canvas.getContext('2d');
                        var datasets = [];
                        var index = 0;

                        $.each(sectors,function(k,company) {
                                var color = window.chartColors[Object.keys(window.chartColors)[index%7]];
                                index += 1;
                                var dataset = {
                                        label: company.stock_name,
                                        backgroundColor: color,
                                        borderColor: color,
                                        data : [
                                                company.financials[0].total_assets,
                                                company.financials[1].total_assets,
                                                company.financials[2].total_assets,
                                                company.financials[3].total_assets
                                        ],
                                        fill:false
                                }
                                datasets.push(dataset);
                        });

                        var data = {
                                labels: ['2013','2014','2015','2016'],
                                datasets: datasets
                        }

                        var opts = {
                                responsive: false,
                                title:{
                                        display:true,
                                        text: sectors[0].sector_name + ' Total Assets'
                                },
                                tooltips: {
                                        mode: 'index',
                                        intersect: false,
                                },
                                hover: {
                                        mode: 'nearest',
                                        intersect: true
                                },
                                scales: {
                                        xAxes: [{
                                                display: true,
                                                scaleLabel: {
                                                        display: true,
                                                        labelString: 'Year'
                                                }
                                        }],
                                        yAxes: [{
                                                display: true,
                                                scaleLabel: {
                                                        display: true,
                                                        labelString: ' Total Assets'
                                                }
                                        }]
                                }
                        }
                        canvas.width = 600;
                        canvas.height = 400;
                        window.myChart = new Chart(ctx, {type:'line',data: data,options:opts});
                        console.log("Total Assets Chart created");
                }

                function drawTotalLiabilities(sectors) {

                        $("#canvas-total-liabilities").remove();
                        $("#canvas-container-total-assets").append('<canvas id="canvas-total-liabilities"></canvas>');

                        var canvas = document.getElementById('canvas-total-liabilities');
                        var ctx = canvas.getContext('2d');
                        var datasets = [];
                        var index = 0;

                        $.each(sectors,function(k,company) {
                                var color = window.chartColors[Object.keys(window.chartColors)[index%7]];
                                index += 1;
                                var dataset = {
                                        label: company.stock_name,
                                        backgroundColor: color,
                                        borderColor: color,
                                        data : [
                                                company.financials[0].total_liabilities,
                                                company.financials[1].total_liabilities,
                                                company.financials[2].total_liabilities,
                                                company.financials[3].total_liabilities
                                        ],
                                        fill:false
                                }
                                datasets.push(dataset);
                        });

                        var data = {
                                labels: ['2013','2014','2015','2016'],
                                datasets: datasets
                        }

                        var opts = {
                                responsive: false,
                                title:{
                                        display:true,
                                        text: sectors[0].sector_name + ' Total Liabilities'
                                },
                                tooltips: {
                                        mode: 'index',
                                        intersect: false,
                                },
                                hover: {
                                        mode: 'nearest',
                                        intersect: true
                                },
                                scales: {
                                        xAxes: [{
                                                display: true,
                                                scaleLabel: {
                                                        display: true,
                                                        labelString: 'Year'
                                                }
                                        }],
                                        yAxes: [{
                                                display: true,
                                                scaleLabel: {
                                                        display: true,
                                                        labelString: ' Total Liabilities'
                                                }
                                        }]
                                }
                        }
                        canvas.width = 600;
                        canvas.height = 400;
                        window.myChart = new Chart(ctx, {type:'line',data: data,options:opts});
                        console.log("Total Liabilities Chart created");
                }

        });

});
