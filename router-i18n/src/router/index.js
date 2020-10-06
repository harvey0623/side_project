import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/home.vue";
import About from '@/views/about.vue';
import RouterView from '@/views/router-view.vue';
import translate from '@/plugins/i18n/translation.js';

Vue.use(VueRouter);

const routes = [
   {
      path: '/:locale',
		component: RouterView,
		beforeEnter: translate.routeMiddleware,
		children: [
			{
				path: '',
				name: 'home',
				component: Home
			},
			{
				path: 'about',
				name: 'about',
				component: About
			},
		]
	},
	{
		path: '*',
		redirect(to) {
			return `/${translate.currentLanguage}`;
		}
	}
];

const router = new VueRouter({
	mode: 'hash',
   routes,
});

export default router;
