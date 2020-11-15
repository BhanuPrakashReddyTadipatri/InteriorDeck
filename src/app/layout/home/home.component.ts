import { Component, OnInit } from '@angular/core';
import { EChartOption, graphic } from 'echarts';
import { Config } from 'src/app/config/config';
import { HttpLayerService } from 'src/app/services/http-service-layer.service';
import { SessionService } from 'src/app/services/session.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public optionsBar: EChartOption;
  public optionsDon: EChartOption;
  public optionsLead: EChartOption;
  public userName;
  public userId;
  public dashboardData;


  constructor(
    private _http: HttpLayerService,
    private _session: SessionService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.userId = this._session.api.local.get(Config.USER_IDENTIFIER);
    this.fetchUserBasicInfo();
    this.fetchDashBoardDetails();
  }

  fetchUserBasicInfo() {
    let postJson = {
      userID: this.userId
    }
    this._http.post(Config.SERVICE_IDENTIFIER.GET_USER_BASIC_INFO, postJson).subscribe((response) => {
      if (response.status === true) {
        this.userName = response.data.firstName;
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  fetchDashBoardDetails() {
    this._http.post(Config.SERVICE_IDENTIFIER.FETCH_DASHBOARD_DETAILS, null).subscribe((response) => {
      if (response.status === true) {
        this.dashboardData = response.data;
        this.initializeCharts();
      } else {
        this.toastr.error('', response.message);
      }
    });
  }

  get siteVisits() {
    if (this.dashboardData) {
      return this.dashboardData.siteVisits.completed;
    }
  }
  get onSiteVisits() {
    if (this.dashboardData) {
      return this.dashboardData.onSiteVisits;
    }
  }
  get siteEngineers() {
    if (this.dashboardData) {
      return this.dashboardData.siteEngineers;
    }
  }
  get sitesCount() {
    if (this.dashboardData) {
      return this.dashboardData.siteCount;
    }
  }

  initializeCharts() {

    //bar chart
    this.optionsBar = {
      color: ['#006161'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          inverse: true,
          type: 'category',
          data: this.dashboardData.lastSixMonthsTicketsResolved.months,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: 'Site Visits',
          type: 'bar',
          barWidth: '60%',
          data: this.dashboardData.lastSixMonthsTicketsResolved.ticketCount,
        }
      ]
    };


    //donut chart
    this.optionsDon = {
      color: ['#6C31C5', '#1191E6', '#F94A52', '#A11950'],
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        data: ['Submitted', 'Waiting Readiness', 'Scheduled', 'On Site']
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '15',
                fontWeight: 'bold',
                color: 'black'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: this.dashboardData.ticketStatusCount,
        }
      ]
    };

    //leader board
    let dataAxis = Object.keys(this.dashboardData.leaderboard);
    dataAxis.reverse();
    this.optionsLead = {
      color: ['#f1c21b'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: [
        {
          show: false,
          type: 'value',
          splitLine: {
            show: false
          },
        }
      ],
      yAxis: {
        data: dataAxis,
        inverse: true,
        axisLabel: {
          inside: true,
          textStyle: {
            color: 'black'
          },
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        z: 10
      },
      series: [
        {
          name: 'Site Visits',
          type: 'bar',
          barWidth: '40%',
          data: Object.values(this.dashboardData.leaderboard),
          // itemStyle: { color: '#f1c21b' },
        },
      ]
    };
  }
}
