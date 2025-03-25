import { createRouter, createWebHistory } from 'vue-router'

// Admin views
const Login = () => import('../views/Login.vue')
const TestLogin = () => import('../views/TestLogin.vue')
const AdminLayout = () => import('../components/layout/AdminLayout.vue')
const Dashboard = () => import('../views/admin/Dashboard.vue')
const Advisers = () => import('../views/admin/Advisers.vue')
const AdvisoryClasses = () => import('../views/admin/AdvisoryClasses.vue')
const AdviserArchive = () => import('../views/admin/AdviserArchive.vue')
const Classes = () => import('../views/admin/Classes.vue')
const ClassArchive = () => import('../views/admin/ClassArchive.vue')
const Subjects = () => import('../views/admin/Subjects.vue')
const Students = () => import('../views/admin/Students.vue')
const Announcements = () => import('../views/admin/Announcements.vue')
const Profile = () => import('../views/admin/Profile.vue')

// Routes
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/test-login',
    name: 'TestLogin',
    component: TestLogin,
    meta: { requiresAuth: false }
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard,
        meta: { title: 'Dashboard' }
      },
      {
        path: 'advisers',
        name: 'Advisers',
        component: Advisers,
        meta: { title: 'Advisers' }
      },
      {
        path: 'advisory-classes',
        name: 'AdvisoryClasses',
        component: AdvisoryClasses,
        meta: { title: 'Advisory Classes' }
      },
      {
        path: 'adviser-archive',
        name: 'AdviserArchive',
        component: AdviserArchive,
        meta: { title: 'Adviser Archive' }
      },
      {
        path: 'classes',
        name: 'Classes',
        component: Classes,
        meta: { title: 'Classes' }
      },
      {
        path: 'class-archive',
        name: 'ClassArchive',
        component: ClassArchive,
        meta: { title: 'Class Archive' }
      },
      {
        path: 'subjects',
        name: 'Subjects',
        component: Subjects,
        meta: { title: 'SSP Subjects' }
      },
      {
        path: 'students',
        name: 'Students',
        component: Students,
        meta: { title: 'Students' }
      },
      {
        path: 'announcements',
        name: 'Announcements',
        component: Announcements,
        meta: { title: 'Announcements' }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
        meta: { title: 'Profile' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAuth && to.meta.role && to.meta.role !== userRole) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    if (userRole === 'admin') {
      next('/admin')
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router 