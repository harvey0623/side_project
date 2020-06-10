export default {
   convertData(data) {  //轉換社區api回傳的資料給plugin用
      if (!Array.isArray(data)) throw new Error('must be array');
      let result = data.reduce((prev, current) => {
         let { id, title, date, beginTime, finishTime, remark } = current;
         prev.push({
            id,
            title,
            start: `${date}T${beginTime}`,
            end: `${date}T${finishTime}`,
            beginDate: date,
            beginTime,
            finishTime,
            remark
         });
         return prev;
      }, []);
      return result;
   }
}