import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import TableEntries from './views/daten/TableEntries.vue'
import TableVendors from './views/daten/TableVendors.vue'
import TableProducts from './views/daten/TableProducts.vue'
import TableMails from './views/daten/TableMails.vue'
import TableUsers from './views/konfiguration/TableUsers.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: 'Daten',
        iconCls: 'el-icon-message', 
        children: [
            { path: '/main', component: Main, name: 'main', hidden: true },
            { path: '/entries', component: TableEntries, name: 'Einträge' },
            { path: '/products', component: TableProducts, name: 'Produkte' },
            { path: '/vendors', component: TableVendors, name: 'Hersteller-Kontakte' },
            { path: '/mails', component: TableMails, name: 'Mails' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Konfiguration',
        iconCls: 'el-icon-setting', 
        children: [
            { path: '/users', component: TableUsers, name: 'Benutzer' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;