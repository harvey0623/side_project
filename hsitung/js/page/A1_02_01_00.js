import { storageObj } from '../src/storage.js';
import { zipCodeData } from '../src/zipCode.js';
import { educateList, workList, applyList, receiveList, favorList } from '../src/criteriaInfo.js';
import { gpsObj } from '../src/gps.js';
export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         liveList: JSON.parse(JSON.stringify(zipCodeData)),
         addressList: JSON.parse(JSON.stringify(zipCodeData)),
         educateList,
         workList,
         applyList,
         receiveList,
         favorList,
         pageUrl,
         isLoading: false,
         tipMessage: '',
         tempStatus: '',
         sendStatus: false,
         sendMsg: '',
         tempBranch: [],
         branchList: [],
         backupBranch: [],
         storeSite: {
            city: '台北市',
            area: '中正區'
         },
         branchPopup: {
            isOpen: false,
            city: '',
            area: ''
         },
         backupAddr: {
            city: '',
            area: ''
         },
         gpsInfo: {
            isOpen: false,
            latitude: '',
            longitude: '' 
         },
         user: {
            Email: '',
            Educate: '',
            Profession: '',
            Define4: '',
            city: '',
            district: '',
            location: '',
            Telephone_Area: '',
            Telephone_Sep: '',
            RES_S_NO: ''
         },
      }),
      computed: {
         cityList() {
            return this.liveList.map(item => item.name);
         },
         areaList() {
            let region = this.liveList.find(item => item.name === this.user.city);
            if (region !== undefined) return region['districts'];
            else return [];
         },
         storeCityList() {
            return this.addressList.map(item => item.name);
         },
         storeAreaList() {
            let region = this.addressList.find(item => item.name === this.storeSite.city);
            if (region !== undefined) return region['districts'];
            else return [];
         },
         hasStoreBranch() { //是否有分店
            return this.branchList.length > 0;
         }
      },
      methods: {
         async losckScroll(isLock) {
            await this.$nextTick();
            let body = document.body;
            let lockedMethod = isLock ? 'disableBodyScroll' : 'enableBodyScroll';
            bodyScrollLock[lockedMethod](body, {
               allowTouchMove(el) {
                  alert(el);
               }
            });
         },
         checkHasSignUpInfo() {
            let signUpInfo = storageObj.getItem('signUpInfo');
            let hasSignUpInfo = signUpInfo !== null;
            if (hasSignUpInfo) {
               if (signUpInfo.step2 === undefined) return;
               this.user = signUpInfo.step2.user;
               this.receiveList = signUpInfo.step2.receiveList;
               this.favorList = signUpInfo.step2.favorList;
               this.backupBranch = signUpInfo.step2.backupBranch;
               this.backupAddr = signUpInfo.step2.backupAddr;
            } else {
               $('#redirectModal').modal('show');
            }
         },
         updateChoose({ id, status, type }) { //更新複選資料
            let key = type === 'msg' ? 'receiveList' : 'favorList';
            let targetObj = this[key].find(item => item.id === id);
            targetObj.status = status;
         },
         getUserLocation() { //取得使用位置
            gpsObj.getLocation().then(res => {
               console.log(res);
               this.gpsInfo.isOpen = res.status;
               this.gpsInfo.latitude = res.status ? res.latitude : '';
               this.gpsInfo.longitude = res.status ? res.longitude : '';
            });
         },
         openStoreSiteModal() {
            $('#storeSiteModal').modal('show');
         },
         checkEmail() {
            return axios({
               url: apiUrl.checkEmail,
               method: 'post',
               data: { Q1: this.user.Email }
            }).then(res => res.data);
         },
         verifyMobile(mobile) {
            return axios({
               url: apiUrl.verifyMobile,
               method:'post',
               data: { Q1: mobile }
            }).then(res => res.data);
         },
         searchStoreId() { //取得商店id
            return axios({
               url: apiUrl.searchStore,
               method: 'post',
               data: {
                  city: this.storeSite.city,
   	            district: this.storeSite.area
               }
            }).then(res => res.data.results.store_ids).catch(err => []);
         },
         getStoreInfo(storeIds) { //取得store詳情
            return axios({
               url: apiUrl.storeInformation,
               method: 'post',
               data: {
                  store_ids: storeIds,
                  query_info: 'summary'
               }
            }).then(res => res.data.results.store_information).catch(err => []);
         },
         async showBranchPopup() { //顯示分店視窗
            if (this.user.RES_S_NO !== '') {
               this.tempBranch = JSON.parse(JSON.stringify(this.backupBranch));
               this.branchList = this.createStoreSchema(this.backupBranch);
               this.changeBranchInput({ code: this.user.RES_S_NO, checked: true });
               this.branchPopup.city = this.backupAddr.city;
               this.branchPopup.area = this.backupAddr.area;
               this.storeSite.city = this.backupAddr.city;
               await this.$nextTick();
               this.storeSite.area = this.backupAddr.area;
            }
            this.branchPopup.isOpen = true;
            this.losckScroll(true);
         },
         closeBranchPopup() {
            this.tempBranch = [];
            this.branchList = [];
            this.branchPopup.city = '';
            this.branchPopup.area = '';
            this.branchPopup.isOpen = false;
            this.losckScroll(false);
         },
         changeBranchInput({ code, checked }) { //改變分店選項
            this.branchList.forEach(branch => {
               if (branch.code === code) branch.isChecked = checked;
               else branch.isChecked = false;
            });
         },
         createStoreSchema(storeInfo) { //產生分店資料結構
            if (storeInfo.length === 0) return [];
            let result = storeInfo.reduce((prev, current, index) => {
               let { title, address, code, location } = current;
               let distance = this.gpsInfo.isOpen ? 
                  gpsObj.getDistance(
                     { lat1: this.gpsInfo.latitude, lon1: this.gpsInfo.longitude }, 
                     { lat2: parseFloat(location.latitude), lon2: parseFloat(location.longitude)}, 'K') : '--';
               prev.push({ title, address, code, distance, isChecked: false });
               return prev;
            }, []);
            result.sort((a, b) => a.distance - b.distance);
            result.forEach((item,index) => {
               if (index === 0) item.isChecked = true;
            });
            return result;
         },
         chooseStore() { //選擇分店
            let targetBranch = this.branchList.find(branch => branch.isChecked === true);
            if (targetBranch !== undefined) {
               this.user.RES_S_NO = targetBranch.code;
               this.backupBranch = JSON.parse(JSON.stringify(this.tempBranch));
               this.backupAddr.city = this.storeSite.city;
               this.backupAddr.area = this.storeSite.area;
            } else {
               this.removeBranch();
            }
            this.branchPopup.isOpen = false;
            this.losckScroll(false);
         },
         removeBranch() { //刪除分店
            this.user.RES_S_NO = '';
            this.tempBranch = [];
            this.branchList = [];
            this.backupBranch = [];
            this.storeSite.city = '台北市';
            this.branchPopup.city = '';
            this.branchPopup.area = '';
            this.backupAddr.city = '';
            this.backupAddr.area = '';
            this.branchPopup.isOpen = false;
            this.losckScroll(false);
         },
         async searchStore() {
            this.isLoading = true;
            $('#storeSiteModal').modal('hide');
            let storeIds = await this.searchStoreId();
            if (storeIds.length !== 0) {
               this.tempBranch = await this.getStoreInfo(storeIds);
               this.branchList = this.createStoreSchema(this.tempBranch);
            } else {
               this.tempBranch = [];
               this.branchList = [];
            }
            this.branchPopup.city = this.storeSite.city;
            this.branchPopup.area = this.storeSite.area;
            this.isLoading = false;
         },
         async submitHandler() { //email有填才要驗
            let isValid = await this.$refs.form.validate();
            if (!isValid) return;
            if (this.user.Email === '') {
               this.tempStatus = true;
               this.confirmHandler();
               return;
            }
            this.isLoading = true;
            let checkResult = await this.checkEmail();
            this.tempStatus = checkResult.results.data.payload.Code === '0';
            this.tipMessage = checkResult.results.data.payload.Message;
            if (this.tempStatus) {
               this.confirmHandler();
            } else {
               $('#failModal').modal('show');
               this.isLoading = false;
            }
         },
         keepSignUpInfo() {
            let signUpInfo = storageObj.getItem('signUpInfo');
            signUpInfo.step2 = {
               user: this.user,
               receiveList: this.receiveList,
               favorList: this.favorList,
               backupBranch: this.backupBranch,
               backupAddr: this.backupAddr,
            };
            storageObj.setItem('signUpInfo', signUpInfo);
            return signUpInfo.step1.mobile;
         },
         async confirmHandler() {
            if (!this.tempStatus) return $('#failModal').modal('hide');
            let userMobile = this.keepSignUpInfo();
            this.isLoading = true;
            let verifyResult = await this.verifyMobile(userMobile);
            this.sendStatus = verifyResult.results.data.payload.Code === '0';
            this.sendMsg = this.sendStatus ? '驗證碼簡訊發送成功' : verifyResult.results.data.payload.Message;
            $('#codeModal').modal('show');
            this.isLoading = false;
         },
         nextHandler() {
            $('#codeModal').modal('hide');
            if (this.sendStatus) {
               location.href = pageUrl.register_step3;
            }
         },
      },
      mounted() {
         this.checkHasSignUpInfo();
         this.getUserLocation();
      },
      watch: {
         storeAreaList(val) {
            this.storeSite.area = val[0] || '';
         }
      }
   });
}