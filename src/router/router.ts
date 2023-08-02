import Home from '../components/Home.vue'
import NoteDetail from '../components/NoteDetail.vue'
import TodoDetail from '../components/TodoDetail.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/', name: 'home', component: Home, children: [
                {
                    path: 'note/:id',
                    component: NoteDetail
                },
                {
                    path: 'todo/:id',
                    component: TodoDetail
                }
            ]
        },
        // { path: '/note/:id', name: 'note detail', component: NoteDetail },
        // {
        //     path: '/todo/:id', name: 'todo detail', component: TodoDetail
        // }
    ]
})

export default router