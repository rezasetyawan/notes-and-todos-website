import Home from '../components/Home.vue'
import NoteDetail from '../components/NoteDetail.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'home', component: Home },
        { path: '/note/:id',name:'note detail', component: NoteDetail }
    ]
})

export default router