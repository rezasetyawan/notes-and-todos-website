import HomePage from '../views/HomePage.vue'
import SignInPage from '../views/SignInPage.vue'
import SignUpPage from '../views/SignUpPage.vue'
import NoteDetail from '../components/NoteDetail.vue'
import TodoDetail from '../components/TodoDetail.vue'
import Error404 from '../components/Error404.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
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
      path: '/home',
      redirect: '/'
    },
    {
      path: '/auth/signup',
      name: 'signup page',
      component: SignUpPage
    },
    {
      path: '/auth/signin',
      name: 'signin page',
      component: SignInPage
    },
    {
      path: '/:notFound(.*)',
      component: Error404,
    },
  ]
})
export default router