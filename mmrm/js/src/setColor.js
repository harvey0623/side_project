(function () {
   let html = document.documentElement;
   let colorList = [
      { key: 'variationMain', value: '#0088bb' },
      { key: 'variationSub', value: '#4a4a4a' },
      { key: 'variationAdorn', value: '#f49f0a' },
   ];
   colorList.forEach(({ key, value }) => {
      html.style.setProperty(`--${key}`, value);
   });
})();