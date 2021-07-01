Vue.component('history-sidebar', {
   props: {
      turnon: {
         type: Boolean,
         required: true
      },
      startdate: {
         type: String,
         required: true
      },
      enddate: {
         type: String,
         required: true
      },
      tipmsg: {
         type: String,
         required: true
      }
   },
   data: () => ({
      historyStart: window.getSystemLang('txnhistory_searchstartdatetime'),
      historyEnd: window.getSystemLang('txnhistory_searchenddatetime'),
      sureText: window.getSystemLang('g_ok'),
      dateFillText: window.getSystemLang('g_e_datemustfill'),
      endThanStart: window.getSystemLang('g_enddatethanstartdate'),
      dateBetween: window.getSystemLang('g_datebetween'),
      searchText: window.getSystemLang('g_search')
   }),
   computed: {
      beginDate: {
         get() {
            return this.startdate;
         },
         set(val) {
            this.$emit('update:startdate', val);
         }
      },
      finishDate: {
         get() {
            return this.enddate;
         },
         set(val) {
            this.$emit('update:enddate', val);
         }
      }
   },
   methods: {
      checkIsAfter() { //撿查結束日是否 >= 開始日
         let dayStart = dayjs(this.startdate);
         let dayEnd = dayjs(this.enddate);
         let result = dayEnd.isSameOrAfter(dayStart);
         if (!result) this.emitMessage(this.endThanStart);
         return result;
      },
      checkInRange() { //是否在規定範圍內
         let today = dayjs();
         let limit = today.subtract(6, 'month');
         let todayText = today.format('YYYY/MM/DD');
         let limitText = limit.format('YYYY/MM/DD');
         let dayStart = dayjs(this.startdate);
         let dayEnd = dayjs(this.enddate);
         let inRangeStart = dayStart.isBetween(limitText, todayText, null, '[]');
         let inRangeEnd = dayEnd.isBetween(limitText, todayText, null, '[]');
         let result = inRangeStart && inRangeEnd;
         if (!result) {
            let message = vsprintf(this.dateBetween, [limitText, todayText]);
            this.emitMessage(message);
         }
         return result;
      },
      emitMessage(msg) { //錯誤訊息通知
         this.$emit('update:tipmsg', msg);
         $('#tipModal').modal('show');
      },
      async checkHandler() {
         let isValid = await this.$refs.form.validate().then(res => res);
         if (!isValid) return this.emitMessage(this.dateFillText);
         if (!this.checkIsAfter()) return;
         if (!this.checkInRange()) return;
         this.$emit('search');
      }
   },
   template: `
      <div id="sidebar" :class="{show: turnon}">
         <div class="sidebarPanel">
            <div class="empty"></div>
            <div class="seekText">{{ searchText }}</div>
            <div class="sureText" @click="checkHandler">{{ sureText }}</div>
         </div>
         <validation-observer tag="ul" class="sidebarFilter" ref="form">
            <li>
               <div class="filterTitle">{{ historyStart }}</div>
               <validation-provider 
                  tag="div" 
                  class="dateOuter" 
                  rules="required"
                  v-slot="{ errors }">
                  <input type="date" v-model="beginDate">
                  <div class="arrowBox"></div>
               </validation-provider> 
            </li>
            <li>
               <div class="filterTitle">{{ historyEnd }}</div>
               <validation-provider 
                  tag="div" 
                  class="dateOuter" 
                  rules="required"
                  v-slot="{ errors }">
                  <input type="date" v-model="finishDate">
                  <div class="arrowBox"></div>
               </validation-provider> 
            </li>
         </validation-observer>
      </div>`
});