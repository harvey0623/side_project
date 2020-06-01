export default class SideBar {
   constructor(props) {
      this.rootEl = document.querySelector(props.rootEl);
      this.categoryList = props.categoryList;
      this.render();
   }
   render() {
      this.categoryList.forEach(item => {
         let li = document.createElement('li');
         li.classList.add('li-item');
         li.dataset.id = item.id;
         li.innerHTML = `
            <a href="javascript:;">
               <div class="title">${item.title}</div>
               <div class="sub">${item.sub}</div>
            </a>`;
         li.addEventListener('click', this.changeHandler.bind(this));
         this.rootEl.appendChild(li);
      });
   }
   changeHandler(evt) {
      let el = evt.currentTarget;
      let id = el.dataset.id;
      if (el.classList.contains('active')) return;
      history.pushState('', '', `?category=${id}`);
      window.dispatchEvent(new Event('popstate'));
   }
   setActiveItem(id) {
      this.rootEl.querySelectorAll('li').forEach(item => {
         let method = item.dataset.id === id ? 'add' : 'remove';
         item.classList[method]('active');
      });
   }
}