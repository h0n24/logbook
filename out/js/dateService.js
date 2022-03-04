
var app = angular.module('app');

app.service('dateService', function(){
    
    var self = this;

    self.setWeek = function(start, end, countDay){
        var selfWeek = ['','','','','','',''];
        for (var day = start; day < end; day++){
            countDay++;
            selfWeek[day] = {};
            selfWeek[day].day = countDay;
        }
        return selfWeek;
    };

    self.weekCount = function (date) {
        var year = date.getYear(),
            month_number = 1 + date.getMonth();

        var firstOfMonth = new Date(year, month_number-1, 1);
        var lastOfMonth = new Date(year, month_number, 0);

        var used = firstOfMonth.getDay() + lastOfMonth.getDate();

        return Math.ceil( used / 7);
    };
    
    self.firstDay = function (y, m) {
        return new Date(y, m, 1).getDay() - 1
    };

    self.firstDayOfThis = function () {
        var date = new Date;
        return self.firstDay(date.getFullYear(), date.getMonth());
    };
    
    self.getCalendar = function (date) {
        var y = date.getFullYear(), m = date.getMonth(),
            firstDay = self.firstDay(y, m),
            lastDay = new Date(y, m + 1, 0).getDay() - 1,
            countDay = 0;

        var calendar = [];
        // get month calendar
        for (var i = 0, max = self.weekCount(date); i < max; i++){
            calendar.push(function () {
                var selfWeek = [];
                if (i === 0){
                    selfWeek = self.setWeek(firstDay, 7, 0);
                } else if (i === max - 1){
                    selfWeek = self.setWeek(0, lastDay + 1, countDay)
                } else {
                    selfWeek = self.setWeek(0, 7, countDay)
                }
                countDay = selfWeek[6].day || 0;
                return selfWeek;
            }())
        }
        return calendar;
    }
});