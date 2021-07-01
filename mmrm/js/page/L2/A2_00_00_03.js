export default function() {
   new Vue({
      el: '#app',
      data: {

      },
      mounted() {
         localStorage.removeItem('member_profile');
      }
   });
}