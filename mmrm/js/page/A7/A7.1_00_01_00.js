export default function({ apiUrl, pageUrl }) {
    new Vue({
        el: '#app',
        mixins: [localProfile],
        data: () => ({
            isLoading: false,
            imgBase64:'',
            apiUrl,
            pageUrl
        }),
        computed: {
            // isMoreOne() { //是否超過一筆資料
            //     return this.myCouponIds.length > 1;
            // },
            // filiteredItems:function(){
            //     if(this.filiterText == '') {
            //         return this.items;
            //     } else {
            //         return this.items.filter(x => x.vName.toUpperCase().match(this.filiterText.toUpperCase()))
            //     }
            // }
        },
        methods: {
            shareBookingClick:function(){
               html2canvas(document.querySelector("#srcContent")).then(canvas => {
                  // document.body.appendChild(canvas);
                  $('.textContent').append(canvas);
                  var data = canvas.toDataURL();
                  //console.log(data);

                  this.imgBase64 = data;

                  this.uploadBase64Image();
              })
            },
            uploadBase64Image() {
                var rvnmId = $('#rvnmId').attr("rvnmId");
                var rsvnDateTimeStr = $('#rsvnDateTime').attr("rsvnDateTime");
                var rsvntimestamp = Date.parse(rsvnDateTimeStr) / 1000;

                return mmrmAxios({
                    url: this.apiUrl.uploadBase64ImageString,
                    method: 'post',
                    data: {
                        base64String: this.imgBase64,
                        rsvnDateTime: rsvntimestamp,
                        rvnmId: rvnmId
                    }
                }).then(res => {
                    if (res.data.results) {
                        //console.log(res.data.results["rtnurl"]);
                        this.lineShare(res.data.results["rtnurl"], res.data.results["rtnurl"]);
                    }
                    else {
                        console.log(`uploadBase64Image error!`);
                    }
                    return;
                }).catch(err => null);
            },
            lineShare(originalUrl, previewUrl) {
                liff.shareTargetPicker([
                    {
                        'type': 'image',
                        'originalContentUrl': originalUrl,
                        "previewImageUrl": previewUrl
                    }
                ])
                    .then(function (res) {
                        if (res) {
                            // succeeded in sending a message through TargetPicker
                            console.log(`[${res.status}] Message sent!`)
                        } else {
                            const [majorVer, minorVer] = (liff.getLineVersion() || "").split('.');
                            if (parseInt(majorVer) == 10 && parseInt(minorVer) < 11) {
                                // LINE 10.3.0 - 10.10.0
                                // Old LINE will access here regardless of user's action
                                console.log('TargetPicker was opened at least. Whether succeeded to send message is unclear')
                            } else {
                                // LINE 10.11.0 -
                                // sending message canceled
                                console.log('TargetPicker was closed!')
                            }
                        }
                    }).catch(function (error) {
                    // something went wrong before sending a message
                    console.log('something wrong happen')
                })
            }
        },
        async mounted() {
            // this.getLocalProfile();
            // if (this.myCouponIds.length === 0) return;

            this.isLoading = true;
            // await this.getCouponIds();
            // let couponInfo = await this.getCompanyDetail();
            this.isLoading = false;
        }
    });
}
