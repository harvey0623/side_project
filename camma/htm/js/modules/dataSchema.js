const dataSchema = {
   iType: 1,  //1是任選 2是固定
   vProductBuyTotal: [1, 3, 5, 6, 7],
   info: {
      vProductSummary: [
         '嚴選坦尚尼亞圓豆',
         '火山風味咖啡豆',
         '年產量有限'
      ]
   },
   period: [
      {
         iId: 1,
         iProductPeriod: 3,
      },
      {
         iId: 2,
         iProductPeriod: 6,
      },
      {
         iId: 3,
         iProductPeriod: 12,
      }
   ],
   spec: [
      {
         iId: 1,
         vSpecTitle: '1/4磅',
         iSpecStock: 20,
         spec_product: [
            {
               iId: 'itemA',
               iSpecStock: 0,
               common: {
                  info: {
                     vProductName: '木箱A'
                  }
               }
            },
            {
               iId: 'itemB',
               iSpecStock: 10,
               common: {
                  info: {
                     vProductName: '芒果柳橙果醬'
                  }
               }
            },
            {
               iId: 'itemX',
               iSpecStock: 10,
               common: {
                  info: {
                     vProductName: '蘋果'
                  }
               }
            },
         ]
      },
      {
         iId: 2,
         vSpecTitle: '半磅',
         iSpecStock: 0,
         spec_product: [
            {
               iId: 'itemC',
               iSpecStock: 0,
               common: {
                  info: {
                     vProductName: '莊園之選．瓜地馬拉花神咖啡'
                  }
               }
            },
            {
               iId: 'itemD',
               iSpecStock: 0,
               common: {
                  info: {
                     vProductName: '伯朗咖啡'
                  }
               }
            },
         ]
      },
   ]
};

// let readSchema = {
//    iType: 1,
//    formatId: 1,
//    periodId: 1,
//    maxPackage: 5,
//    products: [
//       {
//          id: 'itemB',
//          count: 1,
//       },
//       {
//          id: 'itemX',
//          count: 1,
//       },
//    ]
// }
