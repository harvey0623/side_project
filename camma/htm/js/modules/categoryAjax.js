export default class CategoryAjax {
   constructor(props) {
      this.apiUrl = props.apiUrl;
   }
   async getData({ categoryId, limit }) {
      return await axios({  //limit:0 代表全部
         url: this.apiUrl,
         method: 'get',
         params: { categoryId, limit }
      }).then(res => {
         return res.data;
      }).catch(err => {
         console.log(err);
         return { 
            aaaData: [],
            category: {
               banner: [],
               page: []
            }
         };
      });
   }
}