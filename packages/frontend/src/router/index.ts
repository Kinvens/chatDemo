import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home/index.vue'),
      meta: {
        requireAuth: true,
      }
    },
    {
      path: '/login',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/login/index.vue'),
    },
  ],
})
router.beforeEach((to, from, next) => {
  const isLogin = !!localStorage.getItem('accessToken');
  if (to.meta.requireAuth && !isLogin) {
    next({
      path: '/login',
    })
  } else {
    next()
  }

})

export default router
