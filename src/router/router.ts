import Home from '../components/Home.vue'
import NoteDetail from '../components/NoteDetail.vue'
import TodoDetail from '../components/TodoDetail.vue'
import SignUp from '../components/SignUp.vue'
import SignIn from '../components/SignIn.vue'
import Error404 from '../components/Error404.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        name: 'home',
        component: Home,
        children: [
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
      {
        path: '/home', // Redirect /home to /
        redirect: '/'
      },
      {
        path: '/auth/signup',
        name: 'signup page',
        component: SignUp
      },
      {
        path: '/auth/signin',
        name: 'signin page',
        component: SignIn
      },
      {
        path: '/:notFound(.*)',
        component: Error404,
      },
    ]
  })
export default router