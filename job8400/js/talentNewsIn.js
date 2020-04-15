$(function () {
    $('.imgBox').flexgal();

    //時間按鈕
    // const beforeDay = 7;    //往前推幾天
    // const oneDayMilliseconds = 24 * 60 * 60 * 1000;     //一天的毫秒數
    // const today = new Date();
    // let dateArr = [];

    // for (let i = 1; i <= beforeDay; i++) {
    //     let shortDate = today.getTime() - oneDayMilliseconds * (i - 1);
    //     dateArr.unshift(new Date(shortDate));
    // }

    // let str = '';
    // dateArr.forEach(date => {
    //     str += `<button class="btn btn-primary">${date.getMonth() + 1} / ${date.getDate()}</button>`
    // });

    // document.querySelector('.dateGroup').innerHTML = str;
    $('.btn-primary').last().addClass('nowDate');
    $('.btn-primary').on('click', function () {
        $(this).addClass('nowDate');
        $(this).siblings().removeClass('nowDate');
    });

})