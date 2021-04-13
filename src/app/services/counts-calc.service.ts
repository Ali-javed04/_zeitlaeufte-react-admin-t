import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CountsCalcService {
  counts: IUserCounts = {};

  usersChart: any;
  constructor() { }

  getAllNotesCount(users: IUser[]) {
    return this.counts;
  }

  createChart(users: IUser[]) {
    let counts = [];
    this.usersChart = _.groupBy(users, 'registeredDate');
    for (let i in this.usersChart) {
      let l = users.filter((u: IUser) => { return moment(u.addedAt).format("YYYY DD MM") == moment(i).format("YYYY DD MM"); });
      counts.push(l.length)
    }
    return counts;
  }

  getNoteChart(users: IUser[]) {
    // let noteChartCount = [];
    // for (let i = 0; i <= users.length - 1; i++) {
    //   if (users[i].counts && users[i].counts.notes) noteChartCount.push(users[i].counts.notes);
    // }
    // return noteChartCount.reverse();
  }

  getContactsChart(users: IUser[]) {
    // let contactChartCount = [];
    // for (let i = 0; i <= users.length - 1; i++) {
    //   if (users[i].counts && users[i].counts.contacts) contactChartCount.push(users[i].counts.contacts);
    // }
    // return contactChartCount.reverse();
  }

  getCountriesChartCounts(users: IUser[]) {
    let CountriesChartCounts = [];
    let c: number = 1;
    let country = _.groupBy(users, 'regionInfo.country');

    for (let i in country) {
      if (i != "undefined" && i != "") {
        CountriesChartCounts.push(c++);
      }
    }
    let a = CountriesChartCounts.length;
    return { count: a, chartArr: CountriesChartCounts }
  }

  getVideosPercentage(users: IUser[]) {
    // let n = _.sumBy(users, (o: IUser) => { if (o.counts) return o.counts.notes });
    // let a = _.sumBy(users, (o: IUser) => { if (o.counts) return o.counts.audios });
    // let v = _.sumBy(users, (o: IUser) => { if (o.counts) return o.counts.videos });
    // let i = _.sumBy(users, (o: IUser) => { if (o.counts) return o.counts.images });

    // let all = n + a + v + i;
    // let notesPer = (n / all) * 100;
    // let audioPer = (a / all) * 100;
    // let videoPer = (v / all) * 100;
    // let imgPer = (i / all) * 100;

    // return { notesPer: Math.round(notesPer), audioPer: Math.round(audioPer), videoPer: Math.round(videoPer), imgPer: Math.round(imgPer) }
  }

  getSaleState(obj) {
    let a = [];
    for (let i in obj) {
      a.push(obj[i]);
    }
    return a.reverse();
  }

  getCountryPercentages(users: IUser[]) {
    let country = _.groupBy(users, 'regionInfo.country');
    let countryPer = [];
    // let _allUsers = _.sumBy(users, (o) => { return o.isEmailVerified });
    // let a = 4 / 18 * 100;
    // for (let c in country) {
    //   if (c != "undefined" && c != "") {
    //     countryPer.push({
    //       name: c, percentage: Math.round(country[c].length / _allUsers * 100)
    //     })
    //   }
    // }
    // countryPer = countryPer.splice(0, 4);
    return countryPer;
  }

  getTHisMonthUser(users: IUser[]) {
    let registeredUser: any = _.filter(users, (u: IUser) => { return moment(u.addedAt).format("MM YYYY") == moment().format("MM YYYY") });
    let updatedUser: any = _.filter(users, (u: IUser) => { return moment(u.lastUpdate).format("MM YYYY") == moment().format("MM YYYY") });

    let _updatedUser = _.groupBy(updatedUser, (o) => {
      return moment(o.updatedDate).format('D');
    });

    let _registeredUser = _.groupBy(registeredUser, (o) => {
      return moment(o.registeredDate).format('D');
    });

    let date = moment().date();
    let _updatedCounts = [];
    // _updatedCounts.push(0);

    let _registeredCounts = [];
    // _registeredCounts.push(0);

    for (var i = 1; i <= date; i++) {

      if (_updatedUser[i]) {
        _updatedCounts.push(_updatedUser[i].length);
      } else {
        _updatedCounts.push(0);
      }

      if (_registeredUser[i]) {
        _registeredCounts.push(_registeredUser[i].length);
      } else {
        _registeredCounts.push(0);
      }
    }

    let _updatedUsers: IUserStats = {
      chartCount: _updatedCounts, //this.getChartCounts(updatedUser, 'updatedDate'),
      percentage: Math.round(this.getPercentage(updatedUser, users)),
      totalCount: updatedUser.length
    }
    let _registeredUsers: IUserStats = {
      chartCount: _registeredCounts, //this.getChartCounts(registeredUser, 'registeredDate'),
      percentage: Math.round(this.getPercentage(registeredUser, users)),
      totalCount: registeredUser.length
    }

    return [_updatedUsers, _registeredUsers];
  }

  getChartCount(users: IUser[], groupBy: string) {
    let _chartCount: any = [];
    let country = _.groupBy(users, groupBy);
    // console.log('groupBy - ', groupBy, ' == ', country)
    let c = 0;
    for (let i in country) {
      if (i != "undefined" && i != "") {
        _chartCount.push(c++);
      }
    }
    return _chartCount;
    // let a = _chartCount.length;
  }

  getPercentage(filteredUser: IUser[], allUsers: IUser[]) {
    return filteredUser.length / allUsers.length * 100;
  }
}
