Vue.filter('currency', function (dollar) {
   var n = 0;  //n: length of decimal
   var x = 3   //x: length of sections
   var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
   return dollar.toFixed(Math.max(0, n)).replace(new RegExp(re, 'g'), '$&,');
});

Vue.filter('hideText', function (text) {
   return text.replace(/(.{3})(.+)(.{3})/g, function (match, start, middle, end) {
      return start + '*'.repeat(middle.length) + end;
   });
});