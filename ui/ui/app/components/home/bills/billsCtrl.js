'use strict';

angular.module('trackit.home')
    .controller('BillsCtrl', ['$scope', 'BillModel', '$cookies', '$filter',
        function($scope, BillModel, $cookies, $filter) {

            $scope.AWSkey = $cookies.getObject('awsKey');
            $scope.GCPkey = $cookies.getObject('gcKey');

            // Options for Angular-NVD3 pie chart
            $scope.AWSPieOptions = {
                chart: {
                    type: 'pieChart',
                    height: 350,
                    donut: true,
                    x: (d) => d.product,
                    y: (d) => d.cost,
                    donutRatio: 0.45,
                    showLabels: false,
                    pie: {},
                    duration: 500,
                    legend: {
                        margin: {
                            top: 5,
                            right: 30,
                            bottom: 5,
                            left: 0
                        },
                        dispatch: {
                            stateChange: (e) => {
                                $scope.AWSPieOptions.chart.title = "$" + getNewTotal(e.disabled, $scope.AWSdata);
                            }
                        }
                    }
                }
            };

            $scope.GCPPieOptions = {
                chart: {
                    type: 'pieChart',
                    height: 350,
                    donut: true,
                    x: (d) => d.product,
                    y: (d) => d.cost,
                    donutRatio: 0.45,
                    showLabels: false,
                    pie: {},
                    duration: 500,
                    legend: {
                        margin: {
                            top: 5,
                            right: 30,
                            bottom: 5,
                            left: 0
                        },
                        dispatch: {
                            stateChange: (e) => {
                                $scope.GCPPieOptions.chart.title = "$" + getNewTotal(e.disabled, $scope.GCPdata);
                            }
                        }
                    }
                }
            };

            $scope.monthsBarsOptions = {
                chart: {
                    type: 'multiBarChart',
                    height: 400,
                    showControls: true,
                    clipEdge: false,
                    duration: 500,
                    stacked: false,
                    margin: {
                        top: 20,
                        right: 20,
                        bottom: 45,
                        left: 85
                    },
                    xAxis: {
                        axisLabel: 'Months',
                        tickFormat: (d) => {
                            let parts = d.split('-').map((v) => parseInt(v, 10));
                            return d3.time.format('%Y-%m')(new Date(parts[0], parts[1]))
                        }
                    },
                    yAxis: {
                        axisLabel: 'Cost',
                        axisLabelDistance: 25,
                        tickFormat: (d) => ('$' + d3.format(',.2f')(d))
                    }
                }
            };

            $scope.monthsBarsData = [];
            $scope.monthsBarsIsLoaded = false;

            // Retrieve the data from the model for AWS
            if ($scope.AWSkey) {
                BillModel.getBillPie({
                    // AWS key Id as parameter for API Call
                    id: $scope.AWSkey
                }, (data) => {
                    if ('message' in data) {
                        $scope.AWSBillPieNoDataMessage = data['message'];
                    } else {
                        $scope.AWSBillPieNoDataMessage = null;
                        $scope.AWSmonth = data.months[0].month.substr(0, 7);
                        $scope.AWSdata = data.months[0].products;
                    }
                    // update centered title with new bill total
                    $scope.AWSPieOptions.chart.title = "$" + getPieTotal($scope.AWSdata);
                });
                let months = new Date().getMonth() + 1;
                BillModel.getMonthlyCost({
                    // AWS key Id as parameter for API Call
                    id: $scope.AWSkey,
                    // Number of months asked
                    months: months
                }, (data) => {
                    let values = data.months.map((item) => ({ x: item.month, y: item.total_cost }));
                    $scope.monthsBarsData.push({
                        key: "AWS",
                        values: values
                    });
                    $scope.monthsBarsIsLoaded = true;
                })
            }

            // Retrieve the data from the model for GCP
            if ($scope.GCPkey) {
                BillModel.getGCBillPie({
                    // AWS key Id as parameter for API Call
                    id: $scope.GCPkey
                }, function (data) {
                    $scope.GCPmonth = data.month;
                    $scope.GCPdata = data.products;
                    // update centered title with new bill total
                    $scope.GCPPieOptions.chart.title = "$" + getPieTotal($scope.GCPdata);
                });
                // Need GCP Montly Cost implementation in API
                /*
                BillModel.getGCMonthlyCost({
                    // AWS key Id as parameter for API Call
                    id: $scope.GCPkey,
                    // Number of months asked
                    months: months
                }, (data) => {
                    let values = data.months.map((item) => ({ x: item.month, y: month.total_cost }));
                    $scope.monthsBars.push({
                        key: "GCP",
                        values
                    });
                }, (data) => {
                    console.log(data);
                })
                */
            }

            // Get bill total
            function getPieTotal(data) {
                let res = 0;
                for (let i = 0; i < data.length; i++)
                    res += data[i].cost;
                return $filter('number')(res.toFixed(2));
            }

            function getNewTotal(disabled, data) {
                let res = 0;
                for (let i = 0; i < data.length; i++)
                    if (!disabled[i])
                        res += data[i].cost;
                return $filter('number')(res.toFixed(2));
            }

        }
    ]);
