import { CountsCalcService } from 'src/app/services/counts-calc.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Constants } from 'src/app/services/Constants';
import { AppService } from 'src/app/services/app.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import *  as moment from "moment";
import * as Chart from 'chart.js';
import * as _ from 'lodash';
import { CommonService } from 'src/app/services/common.service';
declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {
  @ViewChild('chartOrderStatistics', { static: true }) chartOrderStatistics: ElementRef;
  map: any;
  recentActive = [];
  // allActivities: any = [];
  recentActiveCopy: IUser[] = [];
  recentAdded: IUser[] = [];
  recentAddedCopy: IUser[] = [];
  counts: IUserCounts = {};
  statsCounts: IUserStats[] = [];
  allLockers: any[] = [];

  constructor(
    private router: Router,
    private appService: AppService,
    private srvFirebase: FirebaseService,
    private srvCountCalc: CountsCalcService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.map = google.maps.Map;
    if (!firebase.apps.length) {
      this.srvFirebase.getApiKey().then((response: any) => {
        if (response.status == 200) {
          this.srvFirebase.getAllUsers().then((users: IUser[]) => {
            this.counts.users = users.length;
            this.getActiveUser(users);
          }).catch((error) => {
            this.appService.signOut();
            console.log("Error Get Users ", error)
          });
        } else {
          this.appService.signOut();
        }
      }).catch((err) => {
        this.appService.signOut();
        console.log("Error Get Key ", err);
      });
      //End Get key to InitializeApp
    } else {
      if (this.appService.users != null && this.appService.users.length != 0) {
        this.counts.users = this.appService.users.length;
        this.counts.lands = this.appService.lands.length;
        this.getRecentAddedUser(this.appService.users);
        this.getActiveUser(this.appService.users);
        this.orderStatistics(this.srvCountCalc.getTHisMonthUser(this.appService.users));
        this._initSparklineChart($('#kt_chart_quick_stats_2'), this.srvCountCalc.getNoteChart(this.appService.users), Constants.KTAppOptions.colors.state['danger'], 3);
        this._initSparklineChart($('#kt_chart_quick_stats_3'), this.srvCountCalc.getContactsChart(this.appService.users), Constants.KTAppOptions.colors.state['success'], 3);
        this._initSparklineChart($('#kt_chart_quick_stats_4'), this.srvCountCalc.getCountriesChartCounts(this.appService.users).chartArr, Constants.KTAppOptions.colors.state['warning'], 3);

      } else {
        this.srvFirebase.getAllUsers().then((users: IUser[]) => {
          this.counts.users = users.length;
          this.srvFirebase.getAllLands().then((lands:ILand[])=>{
            this.counts.lands = lands.length;
          })
          this.getRecentAddedUser(users);
          this.getActiveUser(users);
          this.orderStatistics(this.srvCountCalc.getTHisMonthUser(users));
          this._initSparklineChart($('#kt_chart_quick_stats_2'), this.srvCountCalc.getNoteChart(users), Constants.KTAppOptions.colors.state['danger'], 3);
          this._initSparklineChart($('#kt_chart_quick_stats_3'), this.srvCountCalc.getContactsChart(users), Constants.KTAppOptions.colors.state['success'], 3);
          this._initSparklineChart($('#kt_chart_quick_stats_4'), this.srvCountCalc.getCountriesChartCounts(users).chartArr, Constants.KTAppOptions.colors.state['warning'], 3);
        }).catch((error) => {
          this.appService.signOut();
          console.log("Error Get Users ", error)
        });
      }
    }
  }

  getRecentAddedUser(res) {
    this.recentAddedCopy = _.sortBy(res, (o: IUser) => { return moment(o.addedAt).format("MM DD YYYY hh:mm:ss") });
    this.recentAddedCopy = this.recentAddedCopy.reverse();
    this.recentAddedCopy = this.recentAddedCopy.splice(0, 10);
    this.recentAdded = this.recentAddedCopy;

    // this.commonService.asyncLoop(this.recentAdded.length, (loop) => {
    //   let i = loop.iteration();
    //   let user: IUser = this.recentAdded[i];
    //   this.recentAdded[i].responses = _.filter(this.allLockers, (response: any) => { return response.userEmail == user.email });
    //   loop.next();
    // });


  }


  getActiveUser(res) {
    this.recentActiveCopy = _.sortBy(res, (o: IUser) => { return moment(o.lastUpdate).format("MM DD YYYY hh:mm:ss") });
    this.recentActiveCopy = this.recentActiveCopy.reverse();
    this.recentActiveCopy = this.recentActiveCopy.splice(0, 10);
    this.recentActive = this.recentActiveCopy;
  }


  _initSparklineChart(src, data, color, border) {
    if (src.length == 0) {
      return;
    }
    var config = {
      type: 'line',
      data: {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October"],
        datasets: [{
          label: "",
          borderColor: color,
          borderWidth: border,

          pointHoverRadius: 4,
          pointHoverBorderWidth: 12,
          pointBackgroundColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
          pointBorderColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
          pointHoverBackgroundColor: Constants.KTAppOptions.colors.state['danger'],
          pointHoverBorderColor: Chart.helpers.color('#000000').alpha(0.1).rgbString(),
          fill: false,
          data: data,
        }]
      },
      options: {
        title: {
          display: false,
        },
        tooltips: {
          enabled: false,
          intersect: false,
          mode: 'nearest',
          xPadding: 10,
          yPadding: 10,
          caretPadding: 10
        },
        legend: {
          display: false,
          labels: {
            usePointStyle: false
          }
        },
        responsive: true,
        maintainAspectRatio: true,
        hover: {
          mode: 'index'
        },
        scales: {
          xAxes: [{
            display: false,
            gridLines: false,
            scaleLabel: {
              display: true,
              labelString: 'Month'
            }
          }],
          yAxes: [{
            display: false,
            gridLines: false,
            scaleLabel: {
              display: true,
              labelString: 'Value'
            },
            ticks: {
              beginAtZero: true
            }
          }]
        },

        elements: {
          point: {
            radius: 4,
            borderWidth: 12
          },
        },

        layout: {
          padding: {
            left: 0,
            right: 10,
            top: 5,
            bottom: 0
          }
        }
      }
    };

    return new Chart(src, config);
  }

  orderStatistics(stats: IUserStats[]) {
    this.statsCounts = stats;

    // var container = $('#kt_chart_order_statistics');

    // if (!container) {
    //   return;
    // }

    // var MONTHS = ['1 Jan', '2 Jan', '3 Jan', '4 Jan', '5 Jan', '6 Jan', '7 Jan'];

    let date = moment().date();
    let _month = moment().format('MMM');
    let _label = [];
    for (var i = 1; i <= date; i++) {
      _label.push(i + " " + _month);
    }


    var color = Chart.helpers.color;
    var barChartData = {
      labels: _label,
      datasets: [
        {
          fill: true,
          // borderWidth: 0,
          backgroundColor: color(Constants.KTAppOptions.colors.state['brand']).alpha(0.6).rgbString(),
          borderColor: color(Constants.KTAppOptions.colors.state['brand']).alpha(0).rgbString(),
          pointHoverRadius: 4,
          pointHoverBorderWidth: 12,
          pointBackgroundColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
          pointBorderColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
          pointHoverBackgroundColor: Constants.KTAppOptions.colors.state['brand'],
          pointHoverBorderColor: Chart.helpers.color('#000000').alpha(0.1).rgbString(),
          label: 'Updated Users',
          data: stats[0].chartCount
        },
        {
          fill: true,
          // borderWidth: 0,
          backgroundColor: color(Constants.KTAppOptions.colors.state['brand']).alpha(0.2).rgbString(),
          borderColor: color(Constants.KTAppOptions.colors.state['brand']).alpha(0).rgbString(),

          pointHoverRadius: 4,
          pointHoverBorderWidth: 12,
          pointBackgroundColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
          pointBorderColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
          pointHoverBackgroundColor: Constants.KTAppOptions.colors.state['brand'],
          pointHoverBorderColor: Chart.helpers.color('#000000').alpha(0.1).rgbString(),
          label: 'Registered Users',
          data: stats[1].chartCount
        }
      ]
    };



    const chart = new Chart(this.chartOrderStatistics.nativeElement, {
      type: 'line',
      data: barChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: false,
        scales: {
          xAxes: [{
            categoryPercentage: 0.35,
            barPercentage: 0.70,
            display: true,
            scaleLabel: {
              display: false,
              labelString: 'Month'
            },
            gridLines: false,
            ticks: {
              display: true,
              beginAtZero: true,
              fontColor: Constants.KTAppOptions.colors.base['shape'][3],
              fontSize: 13,
              padding: 10
            }
          }],
          yAxes: [{
            categoryPercentage: 0.35,
            barPercentage: 0.70,
            display: true,
            scaleLabel: {
              display: false,
              labelString: 'Value'
            },
            gridLines: {
              color: Constants.KTAppOptions.colors.base['shape'][2],
              drawBorder: false,
              offsetGridLines: false,
              drawTicks: false,
              borderDash: [3, 4],
              zeroLineWidth: 1,
              zeroLineColor: Constants.KTAppOptions.colors.base['shape'][2],
              zeroLineBorderDash: [3, 4]
            },
            ticks: {
              // max: 70,
              // stepSize: 10,
              display: true,
              beginAtZero: true,
              fontColor: Constants.KTAppOptions.colors.base['shape'][3],
              fontSize: 13,
              padding: 10
            }
          }]
        },
        title: {
          display: false
        },
        hover: {
          mode: 'index'
        },
        tooltips: {
          enabled: true,
          intersect: false,
          mode: 'nearest',
          bodySpacing: 5,
          yPadding: 10,
          xPadding: 10,
          caretPadding: 0,
          displayColors: false,
          backgroundColor: Constants.KTAppOptions.colors.state['brand'],
          titleFontColor: '#ffffff',
          cornerRadius: 4,
          footerSpacing: 0,
          titleSpacing: 0
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 5,
            bottom: 5
          }
        }
      }
    });




    // {
    //   labels: ['1 Jan', '2 Jan', '3 Jan', '4 Jan', '5 Jan', '6 Jan', '7 Jan'],
    //   datasets: [
    //     {
    //       fill: true,
    //       //borderWidth: 0,
    //       backgroundColor: color(Constants.KTAppOptions.colors.state['brand']).alpha(0.6).rgbString(),
    //       borderColor: color(Constants.KTAppOptions.colors.state['brand']).alpha(0).rgbString(),

    //       pointHoverRadius: 4,
    //       pointHoverBorderWidth: 12,
    //       pointBackgroundColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
    //       pointBorderColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
    //       pointHoverBackgroundColor: Constants.KTAppOptions.colors.state['brand'],
    //       pointHoverBorderColor: Chart.helpers.color('#000000').alpha(0.1).rgbString(),
    //       label: 'Registered Users',
    //       data: [20, 30, 20, 40, 30, 60, 30]//stats[0].chartCount //[20, 30, 20, 40, 30, 60, 30]
    //     },
    //     {
    //       fill: true,
    //       //borderWidth: 0,
    //       backgroundColor: color(Constants.KTAppOptions.colors.state['brand']).alpha(0.2).rgbString(),
    //       borderColor: color(Constants.KTAppOptions.colors.state['brand']).alpha(0).rgbString(),

    //       pointHoverRadius: 4,
    //       pointHoverBorderWidth: 12,
    //       pointBackgroundColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
    //       pointBorderColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
    //       pointHoverBackgroundColor: Constants.KTAppOptions.colors.state['brand'],
    //       pointHoverBorderColor: Chart.helpers.color('#000000').alpha(0.1).rgbString(),
    //       label: 'Updated Users',
    //       data: [10, 20, 30, 20, 40]//stats[1].chartCount
    //     }
    //   ]
    // };

    // var ctx = container;
    // var chart = new Chart(ctx, {
    //   type: 'line',
    //   data: barChartData,
    //   options: {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //     legend: false,
    //     scales: {
    //       xAxes: [{
    //         categoryPercentage: 0.35,
    //         barPercentage: 0.70,
    //         display: true,
    //         scaleLabel: {
    //           display: false,
    //           labelString: 'Month'
    //         },
    //         gridLines: false,
    //         ticks: {
    //           display: true,
    //           beginAtZero: true,
    //           fontColor: Constants.KTAppOptions.colors.base['shape'],
    //           fontSize: 13,
    //           padding: 10
    //         }
    //       }],
    //       yAxes: [{
    //         categoryPercentage: 0.35,
    //         barPercentage: 0.70,
    //         display: true,
    //         scaleLabel: {
    //           display: false,
    //           labelString: 'Value'
    //         },
    //         gridLines: {
    //           color: Constants.KTAppOptions.colors.base['shape'],
    //           drawBorder: false,
    //           offsetGridLines: false,
    //           drawTicks: false,
    //           borderDash: [3, 4],
    //           zeroLineWidth: 1,
    //           zeroLineColor: Constants.KTAppOptions.colors.base['shape'],
    //           zeroLineBorderDash: [3, 4]
    //         },
    //         ticks: {
    //           max: 70,
    //           stepSize: 10,
    //           display: true,
    //           beginAtZero: true,
    //           fontColor: Constants.KTAppOptions.colors.base['shape'],
    //           fontSize: 13,
    //           padding: 10
    //         }
    //       }]
    //     },
    //     title: {
    //       display: false
    //     },
    //     hover: {
    //       mode: 'index'
    //     },
    //     tooltips: {
    //       enabled: true,
    //       intersect: false,
    //       mode: 'nearest',
    //       bodySpacing: 5,
    //       yPadding: 10,
    //       xPadding: 10,
    //       caretPadding: 0,
    //       displayColors: false,
    //       backgroundColor: Constants.KTAppOptions.colors.state['brand'],
    //       titleFontColor: '#ffffff',
    //       cornerRadius: 4,
    //       footerSpacing: 0,
    //       titleSpacing: 0
    //     },
    //     layout: {
    //       padding: {
    //         left: 0,
    //         right: 0,
    //         top: 5,
    //         bottom: 5
    //       }
    //     }
    //   }
    // });
  }

  salesStats(a) {
    var config = {
      type: 'line',
      data: {
        labels: a,
        datasets: [{
          label: "",
          borderColor: Constants.KTAppOptions.colors.state['brand'],
          borderWidth: 2,
          backgroundColor: Constants.KTAppOptions.colors.state['brand'],
          pointBackgroundColor: Chart.helpers.color('#ffffff').alpha(0).rgbString(),
          pointBorderColor: Chart.helpers.color('#ffffff').alpha(0).rgbString(),
          pointHoverBackgroundColor: Constants.KTAppOptions.colors.state['danger'],
          pointHoverBorderColor: Chart.helpers.color(Constants.KTAppOptions.colors.state['danger']).alpha(0.2).rgbString(),
          data: a
        }]
      },
      options: {
        title: {
          display: false,
        },
        tooltips: {
          intersect: false,
          mode: 'nearest',
          xPadding: 10,
          yPadding: 10,
          caretPadding: 10
        },
        legend: {
          display: false,
          labels: {
            usePointStyle: false
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        hover: {
          mode: 'index'
        },
        scales: {
          xAxes: [{
            display: false,
            gridLines: false,
            scaleLabel: {
              display: true,
              labelString: 'Month'
            }
          }],
          yAxes: [{
            display: false,
            gridLines: false,
            scaleLabel: {
              display: true,
              labelString: 'Value'
            }
          }]
        },
        elements: {
          point: {
            radius: 3,
            borderWidth: 0,

            hoverRadius: 8,
            hoverBorderWidth: 2
          }
        }
      }
    };

    var chart = new Chart($('#kt_chart_sales_stats'), config);
  }

}
