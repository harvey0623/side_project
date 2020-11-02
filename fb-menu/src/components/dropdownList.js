export default [
   {
      id: "privacy",
      title: "設定和隱私",
      icon: "fa fa-cog",
      children: {
         menuName: "設定和隱私",
         lists: [
            {
               id: "a-1",
               title: "設定",
               icon: "fa fa-cog",
               url: "javascript:;",
            },
            {
               id: "a-2",
               title: "活動紀錄",
               icon: "fa fa-list",
               url: "javascript:;",
            },
            {
               id: "a-4",
               title: "動態偏好設定",
               icon: "fa fa-commenting",
               url: "javascript:;",
            },
            {
               id: "a-3",
               title: "語言",
               icon: "fa fa-globe",
               url: "javascript:;",
            },
         ],
      },
   },
   {
      id: "help",
      title: "協助和支援",
      icon: "fa fa-question-circle-o",
      children: {
         menuName: "協助和支援",
         lists: [
            {
               id: "b-1",
               title: "互助討論",
               icon: "fa fa-cog",
               url: "javascript:;",
            },
            {
               id: "b-2",
               title: "回報問題",
               icon: "fa fa-question-circle-o",
               url: "javascript:;",
            },
            {
               id: "b-3",
               title: "使用說明",
               icon: "fa fa-cog",
               url: "javascript:;",
            },
            {
               id: "b-4",
               title: "支援收件夾",
               icon: "fa fa-envelope-o",
               url: "javascript:;",
            },
         ],
      },
   },
   {
      id: "favor",
      title: "顯示方式偏好設定",
      icon: "fa fa-moon-o",
      children: {
         menuName: "顯示方式偏好設定",
         lists: {
            mode: {
               modeId: 'mode-1',
               title: '夜間模式',
               icon: 'fa fa-moon-o',
               value: false,
               modeList: [
                  { id: 'close', title: '關閉', value: false },
                  { id: 'open', title: '開啟', value: true }
               ]
            },
            simplify: {
               modeId: 'mode-2',
               title: '精簡模式',
               icon: 'fa fa-moon-o',
               value: false,
               modeList: [
                  { id: 'off', title: '關閉', value: false },
                  { id: 'on', title: '開啟', value: true }
               ]
            }
         }
      },
   },
];
