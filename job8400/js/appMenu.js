// $(function () {
var $typeBox = $(".typeBox");
var $typeMenu = $(".typeMenu");
var $introBox = $(".introBox");
var $regionBox = $(".regionBox");
var $introMenu = $(".introMenu");
var $regionMenu = $(".regionMenu");
var $typeInfo = $(".typeInfo");
var $maxNum = $(".maxNum");
var $choosen = $(".choosen");
var $trash = $(".trash");
var $education = $(".education");
var $mask = $(".mask");
var $seekMenuLi = $(".seekMenu>li");
var startHide = 5; //開始隱藏位置
var endHide = $seekMenuLi.length; //結束隱藏位置
var $i = $(".mymore").children("i");

var windowH = $(window).height();
var once = true;
var addH = 60;
var moveTime = 250;
var scrollPos; //目前卷軸座標
var searchData;
var $targetObj; //目前的fakeSelect
var educateData;
var typeData;
var optionData = [
   { id: 0, max: 4, name: "職務性質" },
   { id: 1, max: 5, name: "職務類型" },
   { id: 2, max: 5, name: "職缺地區" },
   { id: 3, max: 5, name: "應徵方式" },
   { id: 4, max: 6, name: "福利制度" },
   { id: 5, max: 1, name: "最高學歷" },
   { id: 6, max: 1, name: "學歷科系" },
   { id: 7, max: 1, name: "工作經驗" },
   { id: 8, max: 6, name: "上班時段" },
   { id: 9, max: 7, name: "外語能力" },
   { id: 10, max: 11, name: "駕照" },
   { id: 11, max: 11, name: "擅長工具" },
   { id: 12, max: 1, name: "能力程度" },
];

var ggg = true; //調整地區排序面板
var sortData = []; //排序資料

function init() {
   runData();
   $typeMenu.css({ height: windowH - $(".fixedArea").innerHeight() });
   $introMenu.css({ height: windowH - $(".fixedIntro").innerHeight() });
   $regionMenu.css({
      height: windowH - $regionBox.children(".fixedArea").innerHeight(),
   });

   $(".fakeSelect").on("click", showTypeBox);
   // $('body').on('click', '.fakeSelect', showTypeBox)    //顯示求職條件查詢選單
   $(".typeCancel").on("click", hideTypeBox); //隱藏求職條件查詢選單
   $(".typeSure").on("click", getAns); //取得篩選條件資料
   $(".nextPage").on("click", showIntorBox); //顯示學歷簡介
   $(".prevPage").on("click", hideIntroBox); //隱藏學歷簡介
   $trash.on("click", cancelAll); //取消全部
   $(".myfind").on("click", sendData); //傳送搜尋資料
   $(".mymore").on("click", showSearchList); //顯示查詢職缺更多選項

   $(".sortArea").on("click", showRegionBox); //顯示地區排序選單
   $(".regionCancel").on("click", cancelSort); //取消地區排序
   $(".regionSure").on("click", sureSort); //確認排序
   $(".sortTrash").on("click", clearSort); //清除排序

   $(window).on("resize", adjustH);
}

//跑資料
function runData() {
   searchData = [
      {
         id: 0,
         list: [
            {
               mainId: 111,
               subId: 111,
               name: "全職",
            },
            {
               mainId: 112,
               subId: 112,
               name: "兼差",
            },
            {
               mainId: 113,
               subId: 113,
               name: "工讀",
            },
            {
               mainId: 114,
               subId: 114,
               name: "高階",
            },
         ],
      },
      {
         id: 1,
         list: [
            {
               mainId: 115,
               subId: 115,
               name: "作業員",
            },
            {
               mainId: 116,
               subId: 116,
               name: "行政 / 後勤",
            },
            {
               mainId: 117,
               subId: 117,
               name: "美容美髮",
            },
            {
               mainId: 117,
               subId: 117,
               name: "美容美髮",
            },
            {
               mainId: 118,
               subId: 118,
               name: "裝潢 / 設計",
            },
            {
               mainId: 119,
               subId: 119,
               name: "專業技術",
            },
            {
               mainId: 120,
               subId: 120,
               name: "金融保險",
            },
            {
               mainId: 121,
               subId: 121,
               name: "餐飲 / 旅遊",
            },
            {
               mainId: 122,
               subId: 122,
               name: "業務 / 行銷",
            },
            {
               mainId: 123,
               subId: 123,
               name: "採購 / 倉管",
            },
            {
               mainId: 124,
               subId: 124,
               name: "財務 / 會計 / 稅務",
            },
         ],
      },
      {
         id: 2,
         list: [
            {
               mainId: 125,
               subId: 125,
               name: "彰化縣全區",
            },
            {
               mainId: 126,
               subId: 1000,
               name: "彰化市",
            },
            {
               mainId: 127,
               subId: 1000,
               name: "芬園鄉",
            },
            {
               mainId: 128,
               subId: 1000,
               name: "大村鄉",
            },
            {
               mainId: 129,
               subId: 1000,
               name: "埔鹽區",
            },
            {
               mainId: 130,
               subId: 1000,
               name: "花壇鄉",
            },
            {
               mainId: 131,
               subId: 1000,
               name: "秀水鄉",
            },
            {
               mainId: 132,
               subId: 1000,
               name: "田中鎮",
            },
            {
               mainId: 133,
               subId: 1000,
               name: "北斗鎮",
            },
            {
               mainId: 134,
               subId: 1000,
               name: "鹿港鎮",
            },
            {
               mainId: 135,
               subId: 1000,
               name: "福興鄉",
            },
            {
               mainId: 136,
               subId: 1000,
               name: "田尾鄉",
            },
            {
               mainId: 137,
               subId: 1000,
               name: "埤頭鄉",
            },
            {
               mainId: 138,
               subId: 1000,
               name: "線西鄉",
            },
            {
               mainId: 139,
               subId: 1000,
               name: "和美鎮",
            },
            {
               mainId: 140,
               subId: 1000,
               name: "溪洲鄉",
            },
            {
               mainId: 141,
               subId: 1000,
               name: "竹塘鄉",
            },
            {
               mainId: 142,
               subId: 1000,
               name: "伸港鄉",
            },
            {
               mainId: 143,
               subId: 1000,
               name: "員林市",
            },
            {
               mainId: 144,
               subId: 1000,
               name: "二林鎮",
            },
            {
               mainId: 145,
               subId: 1000,
               name: "大城鄉",
            },
            {
               mainId: 146,
               subId: 1000,
               name: "社頭鄉",
            },
            {
               mainId: 147,
               subId: 1000,
               name: "永靖鄉",
            },
            {
               mainId: 148,
               subId: 1000,
               name: "芳苑鄉",
            },
            {
               mainId: 149,
               subId: 1000,
               name: "二水鄉",
            },
            {
               mainId: 150,
               subId: 1000,
               name: "埔心鄉",
            },
            {
               mainId: 151,
               subId: 1000,
               name: "溪湖鎮",
            },
            {
               mainId: 152,
               subId: 152,
               name: "南投區",
            },
            {
               mainId: 153,
               subId: 153,
               name: "台中區",
            },
         ],
      },
      {
         id: 3,
         list: [
            {
               mainId: 153,
               subId: 153,
               name: "親洽",
            },
            {
               mainId: 154,
               subId: 154,
               name: "電話連絡",
            },
            {
               mainId: 155,
               subId: 155,
               name: "寄履歷",
            },
            {
               mainId: 156,
               subId: 156,
               name: "寄履歷 / 自傳",
            },
            {
               mainId: 157,
               subId: 157,
               name: "自備履歷表 / 預約面試時間  / 附照片",
            },
         ],
      },
      {
         id: 4,
         list: [
            {
               mainId: 158,
               subId: 158,
               name: "勞健保",
            },
            {
               mainId: 159,
               subId: 159,
               name: "三節獎金",
            },
            {
               mainId: 160,
               subId: 160,
               name: "員工旅遊",
            },
            {
               mainId: 161,
               subId: 161,
               name: "供膳",
            },
            {
               mainId: 162,
               subId: 162,
               name: "供宿",
            },
            {
               mainId: 163,
               subId: 163,
               name: "週休二日",
            },
         ],
      },
      {
         id: 5,
         list: [
            {
               mainId: 164,
               subId: 164,
               name: "不拘",
            },
            {
               mainId: 165,
               subId: 165,
               name: "週休二日",
            },
            {
               mainId: 166,
               subId: 166,
               name: "國中(含)以下",
            },
            {
               mainId: 167,
               subId: 167,
               name: "高中 / 高職",
            },
            {
               mainId: 168,
               subId: 168,
               name: "專科",
            },
            {
               mainId: 169,
               subId: 169,
               name: "大學",
            },
            {
               mainId: 170,
               subId: 170,
               name: "碩士",
            },
         ],
      },
      {
         id: 6,
         list: [
            {
               mainId: 171,
               subId: 171,
               name: "商業及管理學科類",
            },
            {
               mainId: 172,
               subId: 172,
               name: "農林漁牧學科類",
            },
            {
               mainId: 173,
               subId: 173,
               name: "工程學科類",
            },
            {
               mainId: 174,
               subId: 174,
               name: "經濟社會及心理學科類",
            },
            {
               mainId: 174,
               subId: 174,
               name: "經濟社會及心理學科類",
            },
            {
               mainId: 175,
               subId: 175,
               name: "經濟社會及心理學科類",
            },
            {
               mainId: 176,
               subId: 176,
               name: "工業技藝及機械學科類",
            },
            {
               mainId: 177,
               subId: 177,
               name: "教育學科類",
            },
         ],
      },
      {
         id: 7,
         list: [
            {
               mainId: 178,
               subId: 178,
               name: "不拘",
            },
            {
               mainId: 179,
               subId: 179,
               name: "無工作經驗",
            },
            {
               mainId: 180,
               subId: 180,
               name: "1年(含)以下",
            },
            {
               mainId: 181,
               subId: 181,
               name: "1-2年",
            },
            {
               mainId: 182,
               subId: 182,
               name: "2-3年",
            },
            {
               mainId: 183,
               subId: 183,
               name: "3-4年",
            },
         ],
      },
      {
         id: 8,
         list: [
            {
               mainId: 184,
               subId: 184,
               name: "早班",
            },
            {
               mainId: 185,
               subId: 185,
               name: "中班",
            },
            {
               mainId: 186,
               subId: 186,
               name: "日班",
            },
            {
               mainId: 187,
               subId: 187,
               name: "晚班",
            },
            {
               mainId: 188,
               subId: 188,
               name: "大夜班",
            },
            {
               mainId: 189,
               subId: 189,
               name: "假日班",
            },
         ],
      },
      {
         id: 9,
         list: [
            {
               mainId: 190,
               subId: 190,
               name: "台語",
            },
            {
               mainId: 191,
               subId: 191,
               name: "英文",
            },
            {
               mainId: 192,
               subId: 192,
               name: "日文",
            },
            {
               mainId: 193,
               subId: 193,
               name: "越文",
            },
            {
               mainId: 194,
               subId: 194,
               name: "泰文",
            },
            {
               mainId: 195,
               subId: 195,
               name: "印尼文",
            },
            {
               mainId: 196,
               subId: 196,
               name: "其他外文",
            },
         ],
      },
      {
         id: 10,
         list: [
            {
               mainId: 197,
               subId: 197,
               name: "輕型機車",
            },
            {
               mainId: 198,
               subId: 198,
               name: "輕型機車",
            },
            {
               mainId: 199,
               subId: 199,
               name: "普通重型機車",
            },
            {
               mainId: 200,
               subId: 200,
               name: "大型重型機車",
            },
         ],
      },
      {
         id: 11,
         list: [
            {
               mainId: 201,
               subId: 201,
               name: "Excel",
            },
            {
               mainId: 202,
               subId: 202,
               name: "PowerPoint",
            },
            {
               mainId: 203,
               subId: 203,
               name: "Word",
            },
            {
               mainId: 204,
               subId: 204,
               name: "Adobe Photoshop",
            },
         ],
      },
      {
         id: 12,
         list: [
            {
               mainId: 205,
               subId: 205,
               name: "不會",
            },
            {
               mainId: 206,
               subId: 206,
               name: "略懂",
            },
            {
               mainId: 207,
               subId: 207,
               name: "中等",
            },
            {
               mainId: 208,
               subId: 208,
               name: "精通",
            },
         ],
      },
   ];
   educateData = [
      {
         title: "商業及管理學科類",
         des:
            "一般商業學類 / 文書管理相關 / 會計學相關 / 統計學相關 / 資訊管理相關 / 企業管理相關 / 工業管理相關 /人力資源相關 / 市場行銷相關 / 國際貿易相關 / 財稅金融相關 / 銀行保險相關 / 公共行政相關 / 其他商業及管理相關",
      },
      {
         title: "農林漁牧學科類",
         des:
            "農業相關 / 園藝相關 / 農業經濟相關 / 水土保持相關 / 林業相關 / 其他農林漁牧相關",
      },
      {
         title: "工程學科類",
         des:
            "測量工程相關 / 工業設計相關 / 化學工程相關 / 材料工程相關 / 土木工程相關 / 環境工程相關 / 河海",
      },
      {
         title: "經濟社會及心理學科類",
         des:
            "經濟學相關 / 政治學相關 / 社會學相關 / 民族學相關 / 心理學相關 / 地理學相關 / 區域研究相關 / 其他經社心理相關 ",
      },
      {
         title: "工業技藝及機械學科類",
         des:
            "電機電子維護相關 / 金屬加工相關 / 機械維護相關 / 木工相關 / 冷凍空調相關 / 印刷相關 / 汽車汽修相關 / 其他工業技藝相關",
      },
      {
         title: "運輸通信學科類",
         des:
            "運輸管理相關 / 航空相關 / 航海相關 / 航運管理相關 / 通信學類 / 其他運輸通信相關",
      },
      {
         title: "藝術學科類",
         des:
            "美術學相關 / 雕塑藝術相關 / 美術工藝相關 / 音樂學器相關 / 戲劇舞蹈相關 / 電影藝術相關 / 室內藝術相關 / 藝術商業設計 / 其他藝術相關",
      },
      {
         title: "數學及電算機科學學科類",
         des:
            "一般數學相關 / 數理統計相關 / 應用數學相關 / 資訊工程相關 / 其他數學及電算機科學相關",
      },
      {
         title: "語文及人文學科類",
         des:
            "本國語文相關 / 英美語文相關 / 日文相關科系 / 其他外國語文相關 / 語言學相關 / 歷史學相關 / 人類學相關 / 哲學相關 / 其他人文學相關",
      },
      {
         title: "建築及都市規劃學科類",
         des: "建築相關 / 景觀設計相關 / 都市規劃相關 / 其他建築及都市規劃學類",
      },
      {
         title: "醫藥衛生學科類",
         des:
            "公共衛生相關 / 醫學系相關 / 中醫學系 / 復健醫學相關 / 護理助產相關 / 醫學技術及檢驗相關 / 牙醫學相關 / 藥學相關 / 醫藥工程相關 / 醫務管理相關 / 獸醫相關 / 其他醫藥衛生相關",
      },
      {
         title: "家政相關學科類",
         des:
            "綜合家政相關 / 食品營養相關 / 兒童保育相關 / 服裝設計相關 / 美容美髮相關 / 其他家政相關",
      },
      {
         title: "法律學科類",
         des: "法律相關科系",
      },
      {
         title: "觀光服務學科類",
         des: "儀容服務學類 / 餐旅服務相關 /觀光事物相關 /其他觀光服務相關",
      },
      {
         title: "大眾傳播學科類",
         des:
            "新聞學相關 / 廣播電視相關 / 公共關係相關 /大眾傳播相關 / 圖書管理相關 / 文物傳播相關 /其他大眾傳播相關",
      },
      {
         title: "自然科學學科類",
         des:
            "生物學相關 / 化學相關 / 地質學相關 / 物理學相關 / 氣象學相關 / 海洋學相關 /其他自然科學相關",
      },
      {
         title: "軍警體育及其他學科類",
         des: "普通科 / 警政相關 / 軍事相關 / 體育相關 /其他相關科系",
      },
   ];
   typeData = [
      {
         title: "作業員",
         des: "作業員 / 包裝員 / 電子作業員 / 鑽孔攻牙",
      },
      {
         title: "行政 / 後勤",
         des: "行政人員 / 總務 / 秘書 / 總機 / 資料輸入 / 文件管理 / 助理",
      },
      {
         title: "美容美髮",
         des:
            "美容師 / 美容助手 / 造型師 / 美療 / 芳療師 / 美髮師 / 助理 / 寵物美容專業員",
      },
      {
         title: "裝潢 / 設計",
         des: "室內設計 / 裝潢人員 / 繪圖人員 / 景觀設計師",
      },
      {
         title: "專業技術",
         des:
            "車床 / 銑床 / 模具沖壓 / 塑膠模具 / CNC操作員 / 機械加工 / 塑膠射出 / 板金 / 焊接 / 切割 / 打版 / 拋光 / 線切割 / 雷射 / 研磨 / 塗裝 / 鐵棟 / 鐵工 / 線場技術員",
      },
      {
         title: "金融保險",
         des: "理賠 / 核保 / 營業員 / 催收員 / 融資 / 保險業務 / 金融專業",
      },
      {
         title: "餐飲 / 旅遊",
         des:
            "服務生 / 洗碗員 / 吧台員 / 助手 / 麵包西點師父 / 各類師父 / 廚師 / 百匯師父 / 鉆板師父 ----- 旅遊休閒 / 飯店工作人員 / 領隊 / 導遊 / 旅行社人員 / 房務人員 ",
      },
      {
         title: "業務 / 行銷",
         des:
            "業務員 / 不動產經紀人 / 多層次傳銷 / 銷售員 / 業務代表 / 汽車銷售員 / 市場開發員 / 國內外業務(主管) ----- 廣告企劃 / 行銷企劃 / 品牌宣傳 / 產品行銷 / 活動企劃 / 商場開發 / 網站行銷 / 市場調查 / 廣告文案",
      },
      {
         title: "採購 / 倉管",
         des: "採購 / 資材 / 倉管 / 物管",
      },
      {
         title: "財務 / 會計 / 稅務",
         des:
            "稽核人員 / 稅務 / 會計師 / 主辦會計 / 成本 / 財務分析師 / 記帳 / 出納 / 查帳 / 審查",
      },
      {
         title: "美編 / 設計",
         des:
            "廣告設計 / 平面設計 /  網頁設計 / 工業. 商業 .包裝 . 美術 . 產品設計 / 會場 . 櫥窗佈置員 / 多媒體動畫",
      },
      {
         title: "教育輔導",
         des:
            "補助班導師 / 講師 / 家教 / 安親班老師 /才藝老師 / 珠心算 / 教授 / 助理教授 / 研究員 / 幼教師 / 教保員",
      },
      {
         title: "品質管理",
         des: "品管 / 品保 / 檢驗 / 測試 / 測量",
      },
      {
         title: "國際貿易",
         des: "國貿人員 / 國外業務 / 船務 / 押匯 / 報關人員",
      },
      {
         title: "營造營建",
         des:
            "水電 / 防水 / 土木 / 砌磚 / 砌石工 / 油漆 / 清潔 / 土水工 / 工地監工 / 主任",
      },
      {
         title: "警衛 / 保全",
         des: "保全 / 警衛 / 大樓管理員 / 總幹事 / 保全技術員 / 其他保安服務",
      },
      {
         title: "工業製圖",
         des: "產品開發人員 / 塑膠 .金屬製圖員 / 2D. 3D 產品製圖人員",
      },
      {
         title: "客服 / 門市 / 娛樂",
         des:
            "門市人員 / 門市銷售員 / 服務員 / 電話客服 / 客戶服務 / 加油員 / 收銀員 / 店員 / 店長 / 售票員 / 專櫃員",
      },
      {
         title: "儲備幹部",
         des: "儲備管理階層 /  幹部 / 保險業務 / 多層次傳銷",
      },
      {
         title: "高階主管",
         des: "管理階層 / 幹部 / 總經理  / 副總經理 / 業務 .品管主管",
      },
      {
         title: "各類司機",
         des: "大 .小貨車司機 / 挖土機 / 貨櫃車司機 / 靠行司機 / 聯結車司機",
      },
      {
         title: "醫療 / 護理",
         des:
            "護士 / 診所助理 / 牙醫助理 / 照顧服務員 / 指導員 / 按摩師 / 推拿師 / 醫院行政 / 管理人員 ----- 醫師 / 牙醫 / 中醫 / 驗光師 / 藥師 / 物理治療師 / 護理師",
      },
      {
         title: "農林漁牧",
         des:
            "農 .藝作物哉培工作者 / 一般動物飼育工作者 / 林木代運工作者 / 水產養殖工作者 / 園藝工 / 畜牧",
      },
      {
         title: "生命禮儀",
         des: "殯殮師 / 禮儀服務人員 / 大體化妝師",
      },
      {
         title: "外勤外務",
         des: "送貨員 / 收費 / 派報員 / 傳單發送 / 承攬收費員 / 外務員",
      },
      {
         title: "家庭協助",
         des:
            "保姆  / 看護 / 居家服務員 / 社工人員 / 家庭代工 / 管家 / 家庭幫傭",
      },
   ];
   var regionId = [126, 128, 130, 153];
   makeSortList(regionId); //產生排序清單
}

//顯示求職條件查詢選單
function showTypeBox() {
   var html = "";
   var string = "";
   var $this = $(this);
   var id = $this.attr("data-id"); //取得類別id
   var resultId = $this.parents(".fake").attr("data-result"); //取得選取到的項目id
   var tempData;
   $targetObj = $this;

   $choosen.text(0); //選擇數量先歸零

   for (var y in optionData) {
      //取得對應id的最大選取量和名稱
      if (id == optionData[y].id) {
         $typeInfo.text(optionData[y].name);
         $maxNum.text(optionData[y].max);
      }
   }

   if ($maxNum.text() == 1) {
      //如果只有單選就隱藏全部取消功能
      $trash.hide();
   } else {
      $trash.show();
   }

   if (resultId) {
      tempData = resultId.split(","); //字串轉成array
   }

   for (var key in searchData) {
      //讀取相對應的項目
      if (id == searchData[key].id) {
         for (var i = 0; i < searchData[key].list.length; i++) {
            html +=
               '<li data-mainid="' +
               searchData[key].list[i].mainId +
               '" data-subid="' +
               searchData[key].list[i].subId +
               '">';
            html += "<div>";
            html += "<span>" + searchData[key].list[i].name + "</span>";
            html += '<i class="fa fa-check" aria-hidden="true"></i>';
            html += "</div>";
            html += "</li>";
         }

         $typeMenu.children("li").off("click"); //先拿掉click事件再載入資料
         $typeMenu.html(html);
         $typeMenu.children("li").on("click", selectAction);

         if (tempData) {
            //顯示目前選到的項目
            $typeMenu.children("li").each(function () {
               if (tempData.indexOf($(this).attr("data-mainid")) >= 0) {
                  $(this).click();
               }
            });
         }
         break;
      }
   }

   if (id == 1 || id == 6) {
      var introData;
      switch (
         id //判斷是要讀取哪一的資料
      ) {
         case "1":
            introData = typeData;
            break;
         case "6":
            introData = educateData;
            break;
      }

      $education.show();
      $education.find("span").text($typeInfo.text() + "介紹");
      $(".introTitle")
         .find("span")
         .text($typeInfo.text() + "介紹");
      $typeMenu.css({ height: windowH - $(".fixedArea").innerHeight() }); //重新計算menu高度
      once = true;

      for (var x in introData) {
         //讀取相對應項目
         string += "<li>";
         string += "<div>";
         string += "<p>";
         string += "<span>" + introData[x].title + "</span>";
         string += '<i class="fa fa-angle-down" aria-hidden="true"></i>';
         string += "</p>";
         string += "</div>";
         string += "<p>" + introData[x].des + "</p>";
         string += "</li>";
      }

      $introMenu.children("li").off("click"); //先拿掉click事件再載入資料
      $introMenu.html(string);
      $introMenu.children("li").on("click", function () {
         //展開隱藏的資料
         var $this = $(this);

         if ($this.find("i").hasClass("myopen")) {
            $this.find("i").removeClass("myopen");
            $this.children("p").hide();
         } else {
            $this.find("i").addClass("myopen");
            $this.children("p").show();
            $this.siblings().children("p").hide();
            $this.siblings().find("i").removeClass("myopen");
         }
      });
   } else {
      $education.hide();
      $typeMenu.css({ height: windowH - $(".fixedArea").innerHeight() });
      once = true;
   }

   $typeBox.css({ opacity: 1 }).animate({ top: 0 }, moveTime, function () {
      //顯示選單
      $mask.show();
      scrollPos = $(document).scrollTop(); //取得目前卷軸位置
      $(window).on("scroll", stopScroll); //停止卷軸滑動
   });
}

//點選行為
function selectAction() {
   var $this = $(this);
   var $i = $this.find("i");
   var now = +$choosen.text(); //取得目前已選數量(文字轉數字)
   var max = +$maxNum.text(); //取得最大值(文字轉數字)

   //單選
   if (max == 1 && now == 0) {
      $choosen.text(++now);
      $i.addClass("myselect");
   } else if (max == 1 && now == 1) {
      if (!$i.hasClass("myselect")) {
         $i.addClass("myselect");
         $this.siblings().find("i").removeClass("myselect");
      } else {
         $choosen.text(--now);
         $i.removeClass("myselect");
      }
   }

   //複選
   if (max > 1) {
      if (!$i.hasClass("myselect")) {
         now++;
         if (now > max) {
            now = max;
         } else {
            $i.addClass("myselect");
         }
         $choosen.text(now);
      } else {
         $choosen.text(--now);
         $i.removeClass("myselect");
      }
   }

   //如果點選的是全區就進行disable動作(用全區的mainid比對全區內的subid)
   if ($this.attr("data-subid") == 0) {
      if ($this.find("i").hasClass("myselect")) {
         inSide($this.attr("data-mainid"));
      } else {
         $typeMenu.children("li").each(function () {
            var $that = $(this);

            if ($that.attr("data-subid") == $this.attr("data-mainid")) {
               $that
                  .removeClass("mydisable")
                  .off("click")
                  .on("click", selectAction);
            }
         });

         reCount();
      }
   }

   //判斷是否在全區裡面
   function inSide(num) {
      $typeMenu.children("li").each(function () {
         var $this = $(this);

         if ($this.attr("data-subid") == num) {
            $this.addClass("mydisable").off("click");
            $this.find("i").removeClass("myselect");
         }
      });

      reCount();
   }

   //重新計算
   function reCount() {
      var count = 0;
      $typeMenu.children("li").each(function () {
         if ($(this).find("i").hasClass("myselect")) {
            count++;
         }
      });
      $choosen.text(count);
   }
}

//全部取消
function cancelAll() {
   $(".mydisable").each(function () {
      $(this).removeClass("mydisable").on("click", selectAction);
   });

   $typeMenu.children("li").find("i").removeClass("myselect");
   $choosen.text(0);
}

//取得篩選條件資料
function getAns() {
   var txtData = [];
   var idData = [];
   var $fake = $targetObj.parents(".fake");

   $typeMenu.children("li").each(function () {
      var $this = $(this);
      if ($this.find("i").hasClass("myselect")) {
         txtData.push($this.find("span").text());
         idData.push(+$this.attr("data-mainid")); //將文字轉數字
      }
   });

   if (txtData.length == 0) {
      $targetObj.find("span").text("請選擇");
      $fake.removeAttr("data-result");
   } else {
      $targetObj.find("span").text(txtData.join("、"));
      $fake.attr("data-result", idData.join(","));
   }

   hideTypeBox();
}

//隱藏求職條件查詢選單
function hideTypeBox() {
   $mask.hide();

   if (!$(".seekPanel").length) {
      //判斷是否有搜尋面板
      $(window).off("scroll");
   }

   $typeBox.animate({ top: "100%" }, moveTime, function () {
      $(this).css({ opacity: 0 });
   });
}

//顯示學經歷簡介
function showIntorBox() {
   $typeBox.animate({ left: "-100%" }, moveTime);
   $introBox.animate({ right: 0 }, moveTime);
}

//隱藏學經歷簡介
function hideIntroBox() {
   $typeBox.animate({ left: 0 }, moveTime);
   $introBox.animate({ right: "-100%" }, moveTime);
}

//調整高度
function adjustH() {
   if (once) {
      $typeMenu.css({ height: $typeMenu.innerHeight() + addH });
      $introMenu.css({ height: $introMenu.innerHeight() + addH });
      once = false;
   }

   if (ggg) {
      $regionMenu.css({ height: $regionMenu.innerHeight() + addH });
      ggg = false;
   }

   if ($introBox.css("right") != "0px") {
      $introBox.css({ right: "-100%" });
   }
}

//停止卷軸捲動
function stopScroll() {
   if ($(this).scrollTop() != scrollPos) {
      $(document).scrollTop(scrollPos);
   }
}

//顯示查詢職缺更多選項
function showSearchList() {
   if (!$i.hasClass("more")) {
      $i.addClass("more");
      for (var i = startHide - 1; i < endHide; i++) {
         $seekMenuLi.eq(i).show();
      }
   } else {
      $i.removeClass("more");
      for (var i = startHide - 1; i < endHide; i++) {
         $seekMenuLi.eq(i).hide();
      }
   }
}

//顯示地區排序選單
function showRegionBox() {
   $regionBox.css({ opacity: 1 }).animate({ top: 0 }, moveTime, function () {
      //顯示選單
      $mask.show();
      scrollPos = $(document).scrollTop(); //取得目前卷軸位置
      $(window).on("scroll", stopScroll); //停止卷軸滑動
   });
}

//隱藏排序選單
function cancelSort() {
   $mask.hide();
   $regionBox.animate({ top: "100%" }, moveTime, function () {
      $(this).css({ opacity: 0 });
      $(window).off("scroll");
   });
}

//產生排序清單
function makeSortList(regionId) {
   var html = "";

   //產生搜尋地區清單
   for (var a of searchData) {
      for (var b of a.list) {
         if (regionId.indexOf(b.mainId) >= 0) {
            html += '<li data-mainid="' + b.mainId + '">';
            html += "<div>";
            html += "<span>" + b.name + "</span>";
            html += '<div class="circle"></div>';
            html += "</div>";
            html += "</li>";
         }
      }
   }

   $regionMenu.html(html);

   //點擊排序
   $regionMenu.children("li").on("click", function () {
      var $this = $(this);
      var $circle = $this.find(".circle");

      if (!$circle.hasClass("mySort")) {
         sortData.push($this.data("mainid"));
         $circle.text(sortData.length);
         $circle.addClass("mySort");

         // console.log(sortData)
      } else {
         var order = sortData.indexOf($this.data("mainid")); //取得陣列索引號

         sortData.splice(order, 1); //拿掉指定id
         $circle.removeClass("mySort");
         $(".circle").text("");

         sortData.forEach(function (d, i) {
            //重新編號
            $(".mySort").each(function () {
               var $this = $(this);

               if ($this.parents("li").data("mainid") == d) {
                  $this.text(i + 1);
               }
            });
         });

         // console.log(sortData)
      }
   });
}

//清除排序
function clearSort() {
   sortData = []; //清掉排序資料
   $(".circle").text("").removeClass("mySort");
}

//確認排序
function sureSort() {
   var $regionMenuLi = $regionMenu.children("li");

   if (sortData.length > 0) {
      //有排序資料才執行確認工能
      if (sortData.length < $regionMenuLi.length) {
         //如果排序資料數量小於選單數量就進行補值
         var $remainCircle = $regionMenuLi.find(".circle").not(".mySort");

         $remainCircle.each(function () {
            $(this).parents("li").click();
         });
      }

      cancelSort();
      console.log(sortData);
   } else {
      console.log("不執行排序");
   }
}

//傳資料
function sendData() {
   var $fake = $seekMenuLi.filter(".fake");
   var seekData = {};
   var identityData = []; //身分資料
   var propertyData = [
      //對應的屬性
      { id: 0, name: "jobKind" },
      { id: 1, name: "jobType" },
      { id: 2, name: "jobArea" },
      { id: 3, name: "apply" },
      { id: 4, name: "welfare" },
      { id: 5, name: "diploma" },
      { id: 6, name: "department" },
      { id: 7, name: "exp" },
      { id: 8, name: "time" },
      { id: 9, name: "lang" },
   ];

   //讀取關鍵字
   seekData.keyword = $("[name=keyword]").val();

   //讀取條件資料
   $fake.each(function () {
      var $this = $(this);
      var id = $this.find(".fakeSelect").attr("data-id"); //取得類別id
      var resultId = $this.attr("data-result"); //項目id

      for (var key in propertyData) {
         if (propertyData[key].id == id) {
            if (resultId) {
               resultId = resultId.split(","); //文字轉陣列
               resultId = resultId.map(function (d) {
                  //文字轉數字
                  return (d = +d);
               });
               seekData[propertyData[key].name] = resultId;
            } else {
               seekData[propertyData[key].name] = [];
            }

            break;
         }
      }
   });

   //讀取身分資料
   $(".other")
      .children("label")
      .each(function () {
         var $checkbox = $(this).children("[type=checkbox]");
         if ($checkbox.prop("checked")) {
            identityData.push($checkbox.val());
         }
      });

   seekData.identity = identityData;

   console.log(seekData);

   // $.ajax({
   //     url: "",
   //     data: seekData,
   //     dataType: 'json',
   //     type:"POST",
   //     succsee: function (data) {

   //     }
   // })
}

init();

// ======2020/4/14新增功能
//薪資待遇
var clearSalaryHandler = function() {
   $('.salaryType').children('option')[0].selected = true;
   $('.wantedInput').val('');
}

$('.salaryBox').on('transitionend', function() {
   if (!$(this).hasClass('show')) clearSalaryHandler();
})

$('.salarySelect').on('click', function() {
   var data = $('.salaryFake')[0].dataset.result;
   data = data ? JSON.parse(data) : { type: 'month', money: '' };
   $('.salaryType').val(data.type);
   $('.wantedInput').val(data.money);
	$('.salaryBox').addClass('show');
});

$('.salarySure').on('click', function() {
   var data = {
      type: $('.salaryType').val(),
      money: $('.wantedInput').val()
   };
   var mapping = {
      month: '月薪',
      day: '日薪',
      hour: '時薪'
   };
   var text = mapping[data.type] + ',' + data.money;
   $('.salaryFake')[0].dataset.result = JSON.stringify(data);
   $('.salarySelect').children('span').text(text);
	$('.salaryBox').removeClass('show');
});

$('.salaryCancel').on('click', function() {
	$('.salaryBox').removeClass('show');
});

$('.clearSalary').on('click', clearSalaryHandler);


