import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores';
import Books from '@/views/Books.vue';
import BookCreate from '@/views/BookCreate.vue';
import Book from '@/views/Book.vue';
import BookEdit from '@/views/BookEdit.vue';
import Authors from '@/views/Authors.vue';
import Author from '@/views/Author.vue';
import TopAuthors from '@/views/TopAuthors.vue';
import Login from '@/views/Login.vue';
import NotFound from '@/views/404.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/books' },
    { path: '/books', name: 'books', component: Books },
    {
      path: '/books/new',
      name: 'book-new',
      component: BookCreate,
      meta: { requiresAuth: true },
    },
    {
      path: '/books/:id',
      name: 'book',
      component: Book,
      props: true,
    },
    {
      path: '/books/:id/edit',
      name: 'book-edit',
      component: BookEdit,
      props: true,
      meta: { requiresAuth: true },
    },
    { path: '/authors', name: 'authors', component: Authors },
    {
      path: '/authors/:id',
      name: 'author',
      component: Author,
      props: true,
    },
    {
      path: '/reports/top-authors',
      name: 'top-authors',
      component: TopAuthors,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { guestOnly: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: NotFound,
    },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'books' };
  }
});

export default router;
