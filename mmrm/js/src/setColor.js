(function () {
   let html = document.documentElement;
   let colorList = [
      { key: 'variationMain', value: '#c5160f' },
      { key: 'variationSub', value: '#292929' },
      { key: 'variationAdorn', value: '#f49f0a' },
   ];
   colorList.forEach(({ key, value }) => {
      html.style.setProperty(`--${key}`, value);
   });
})();