(function (Vue) {
    const api = 'https://json2jsonp.com/?url=http://opendata.epa.gov.tw/webapi/Data/REWIQA/?format=json&callback=cbfunc';

    new Vue({
        el: '#app',
        data() {
            return {
                indexData: [
                    {
                        title: '0~50',
                        comment: '良好',
                        point: 50
                    },
                    {
                        title: '51~100',
                        comment: '普通',
                        point: 100
                    },
                    {
                        title: '101~150',
                        comment: '對敏感族群不健康	',
                        point: 150
                    },
                    {
                        title: '151~200',
                        comment: '對所有族群不健康',
                        point: 200
                    },
                    {
                        title: '201～300',
                        comment: '非常不健康',
                        point: 300
                    },
                    {
                        title: '>301',
                        comment: '危險',
                        point: 301
                    },
                ],
                isLoading: false,
                selected: null,
                tempData: [],
                order: 0
            }
        },
        computed: {
            countyList() {  //縣市清單
                if (!this.tempData.length) return [];
                let countyArr = [];
                this.tempData.forEach(data => {
                    if (countyArr.indexOf(data.County) === -1) countyArr.push(data.County);
                });

                let resultArr = countyArr.map(county => {
                    return {
                        county,
                        site: this.tempData.filter(data => data.County === county)
                    }
                });

                this.selected = resultArr[0].county;
                return resultArr;
            },
            targetCounty() {  //目前縣市
                if (this.selected === null) return null;
                this.order = 0;
                return this.countyList.filter(item => item.county === this.selected)[0];
            },
            metarial() {  //空氣成分
                if (!this.targetCounty) return null;
                let targetObj = this.targetCounty.site[this.order];
                let { SiteName, AQI, O3, PM10, CO, SO2, NO2 } = targetObj;
                let tempObj = { SiteName, AQI, O3, PM10, CO, SO2, NO2 };
                tempObj.PM25 = targetObj['PM2.5'];
                return tempObj;
            }
        },
        methods: {
            getAqi() {
                this.isLoading = true;
                $.ajax({
                    url: api,
                    dataType: 'jsonp',
                    success: (res) => {
                        this.tempData = res;
                        this.isLoading = false;
                    }
                })
            },
            rangeColor(point) {  //顏色區間
                if (point >= 0 && point <= 50) return 'good';
                if (point >= 51 && point <= 100) return 'normal';
                if (point >= 101 && point <= 150) return 'allergyer';
                if (point >= 151 && point <= 200) return 'aller';
                if (point >= 201 && point <= 300) return 'notHealth';
                if (point >= 301) return 'danger';
            },
            showDetail(obj) {  //顯示詳情
                this.order = this.targetCounty.site.findIndex(item => item === obj);
            }
        },
        mounted() {
            this.getAqi();
        }

    });
})(Vue);