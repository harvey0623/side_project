export default {
   resetField({ target, arr }) {  //重設criteriaProxy的欄位值
      arr.forEach(key => target[key] = '');
   },
   convertShift(data) {  //轉換班表api回傳的資料結構
      let result = data.reduce((prev, current) => {
         let color = this.getColor(current.period);
         prev.push({
            id: current.shiftId,
            title: current.name,
            start: `${current.startDate}T${current.beginTime}`,
            end: `${current.endDate}T${current.finishTime}`,
            backgroundColor: color,
            borderColor: color,
            ...current,
         });
         return prev;
      }, []);
      return result;
   },
   getColor(periodId) { //依班表時段取的顏色
      let colorObj = {
         morning: 'lightblue',
         aftermoon: 'lightgreen',
         night: 'orange'
      };
      return colorObj[periodId] || '#F65D75';
   }
}