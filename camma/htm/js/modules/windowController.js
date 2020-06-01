export default class WindowController {
   constructor(props) {
      this.popstateEvent = props.popstateEvent;
   }
   init() {
      window.addEventListener('popstate', this.getQuery.bind(this));
      this.getQuery();
   }
   getQuery() {
      let urlInstance = new URL(location.href);
      let queryId = urlInstance.searchParams.get('category') || '0';
      this.popstateEvent(queryId);
   }
   pushRouter(id) {
      history.pushState('', '', `?category=${id}`);
      window.dispatchEvent(new Event('popstate'));
   }
}