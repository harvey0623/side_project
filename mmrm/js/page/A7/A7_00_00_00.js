export default function({ apiUrl, pageUrl }) {
    new Vue({
        el: '#app',
        mixins: [localProfile],
        data: () => ({
            myCouponIds: [],
            metaList: [],
            couponIds: [],
            couponDetail: [],
            // couponList: [],
            items:[],
            inputText:'',
            filiterText:'',
            isLoading: false,
            apiUrl,
            pageUrl
        }),
        computed: {
            isMoreOne() { //是否超過一筆資料
                return this.myCouponIds.length > 1;
            },
            filiteredItems:function(){
                if(this.filiterText == '') {
                    return this.items;
                } else {
                    return this.items.filter(x => x.vName.toUpperCase().match(this.filiterText.toUpperCase()))
                }
            }
        },
        methods: {
            itemClick:function(companyId){
                if (companyId === "empty") {
                    let modal = $("#failModal");
                    modal.modal();
                    //window.alert("該品牌尚未開放線上訂位，請直接洽詢門市訂位，謝謝。");
                }
                else {
                    this.startBooking(companyId);
                }
            },
            searchClick:function(){
                this.filiterText = this.inputText;
            },
            clearClick:function(){
                this.inputText = '';
            },
            getCompanyDetail() { //取得品牌資訊
                return mmrmAxios({
                    url: this.apiUrl.companyItem,
                    method: 'post',
                    // data: {
                    //    my_coupon_id: id,
                    // }
                }).then(res => {
                    return res.data.results;
                }).catch(err => null);
            },
            startBooking(companyId) { //取得品牌資訊
                return mmrmAxios({
                    url: this.apiUrl.startBooking,
                    method: 'post',
                     data: {
                         vCompanyId: companyId
                     }
                }).then(res => {
                    if (res.data.results) {
                        let encodedWord = CryptoJS.enc.Utf8.parse(res.data.results["perFilledFromData"]);
                        let encoded = CryptoJS.enc.Base64.stringify(encodedWord);
                        let perFilledFromData = encodeURIComponent(encoded);
                        let url = res.data.results["urlBase"] + res.data.results["vCompanyId"] +res.data.results["perFilledFrom"] + perFilledFromData;
                        window.open(url + "&openExternalBrowser=1", '_blank');
                        //window.open(url, '_blank');
                    }
                    else {

                    }
                    return;
                }).catch(err => null);
            },
        },
        created() {
            // this.assignData();
        },
        async mounted() {
            // this.getLocalProfile();
            // if (this.myCouponIds.length === 0) return;

            this.isLoading = true;
            // await this.getCouponIds();
            let couponInfo = await this.getCompanyDetail();
            this.isLoading = false;

            for (let i = 0; i < couponInfo.length; i++) {
                if (couponInfo[i]["vBookingEnable"] === "empty" || couponInfo[i]["vBookingEnable"] === "true") {
                    let result = couponInfo[i];
                    this.items.push(result);
                }
            }
        }
    });
}
