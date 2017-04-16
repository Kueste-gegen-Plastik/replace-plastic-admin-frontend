import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.directive('deep-model', {
    bind(el, binding, vnode) {
        el.addEventListener('input', e => {
            new Function('obj', 'v', `obj.${binding.value} = v`)(vnode.context.$data, e.target.value);
        });
    },
    unbind(el) {
        el.removeEventListener('input');
    },
    inserted(el, binding, vnode) {
        el.value = new Function('obj', `return obj.${binding.value}`)(vnode.context.$data);
    },
    update(el, binding, vnode) {
        el.value = new Function('obj', `return obj.${binding.value}`)(vnode.context.$data);
    }
});

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('rpp_userdata');
  }
  let user = JSON.parse(sessionStorage.getItem('rpp_userdata'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

