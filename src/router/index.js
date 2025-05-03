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
const PendingRegistrations = () => import('../views/admin/PendingRegistrations.vue')
const Announcements = () => import('../views/admin/Announcements.vue')
const Profile = () => import('../views/admin/Profile.vue')
const SystemOptions = () => import('../views/admin/SystemOptions.vue')

// Adviser views
const AdviserLayout = () => import('../components/layout/AdviserLayout.vue')
const AdviserDashboard = () => import('../views/adviser/Dashboard.vue')
const AdviserProfile = () => import('../views/adviser/Profile.vue')
const AdviserClasses = () => import('../views/adviser/Classes.vue')
const AdviserConsultations = () => import('../views/adviser/Consultations.vue')
const AdviserMM = () => import('../views/adviser/MM.vue')
const AdviserMonitoring = () => import('../views/adviser/Monitoring.vue')
const AdviserAcademic = () => import('../views/adviser/Academic.vue')
const AdviserAttendance = () => import('../views/adviser/Attendance.vue')
const ClassesHistory = () => import('../views/adviser/ClassesHistory.vue')

// Student views 
const StudentLayout = () => import('../components/layout/StudentLayout.vue')
const StudentDashboard = () => import('../views/student/Dashboard.vue')
const StudentProfile = () => import('../views/student/Profile.vue')
const StudentAcademic = () => import('../views/student/AcademicEvaluation.vue')
const StudentConsultations = () => import('../views/student/Consultations.vue')
const StudentAnnouncements = () => import('../views/student/Announcements.vue')
const StudentSSP = () => import('../views/student/SSP.vue')
const StudentOdysseyPlan = () => import('../views/student/OdysseyPlan.vue')
const StudentSurveys = () => import('../views/student/Surveys.vue')
const SSPHistory = () => import('../views/student/SSPHistory.vue')

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
    meta: { 
      requiresAuth: false,
      title: 'Staff Login'
    }
  },
  {
    path: '/student/login',
    name: 'StudentLogin',
    component: () => import('../views/StudentLogin.vue'),
    meta: {
      requiresAuth: false,
      title: 'Student Login'
    }
  },
  {
    path: '/test-login',
    name: 'TestLogin',
    component: TestLogin,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: {
      requiresAuth: false,
      title: 'Student Registration'
    }
  },
  {
    path: '/student/register',
    name: 'StudentRegister',
    component: () => import('../views/StudentRegister.vue'),
    meta: {
      requiresAuth: false,
      title: 'Student Registration'
    }
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
        path: 'pending-registrations',
        name: 'PendingRegistrations',
        component: PendingRegistrations,
        meta: { title: 'Pending Registrations' }
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
      },
      {
        path: 'system-options',
        name: 'SystemOptions',
        component: SystemOptions,
        meta: { title: 'System Options' }
      }
    ]
  },
  {
    path: '/adviser',
    component: AdviserLayout,
    meta: { requiresAuth: true, role: 'adviser' },
    children: [
      {
        path: '',
        name: 'AdviserDashboard',
        component: AdviserDashboard,
        meta: { title: 'Dashboard' }
      },
      {
        path: 'profile',
        name: 'AdviserProfile',
        component: AdviserProfile,
        meta: { title: 'Profile' }
      },
      {
        path: 'classes',
        name: 'AdviserClasses',
        component: AdviserClasses,
        meta: { title: 'Classes' }
      },
      {
        path: 'classes-history',
        name: 'ClassesHistory',
        component: ClassesHistory,
        meta: { title: 'Classes History' }
      },
      {
        path: 'consultations',
        name: 'AdviserConsultations',
        component: AdviserConsultations,
        meta: { title: 'Meetings & Consultations' }
      },
      {
        path: 'mm',
        name: 'AdviserMM',
        component: AdviserMM,
        meta: { title: 'M&M' }
      },
      {
        path: 'attendance',
        name: 'AdviserAttendance', 
        component: AdviserAttendance,
        meta: { title: 'Attendance' }
      },
      {
        path: 'monitoring',
        name: 'AdviserMonitoring',
        component: AdviserMonitoring,
        meta: { title: 'Monitoring' }
      },
      {
        path: 'academic',
        name: 'AdviserAcademic',
        component: AdviserAcademic,
        meta: { title: 'Academic Monitoring' }
      }
    ]
  },
  {
    path: '/student',
    component: StudentLayout,
    meta: { requiresAuth: true, role: 'student' },
    children: [
      {
        path: '',
        name: 'StudentDashboard',
        component: StudentDashboard,
        meta: { title: 'Dashboard' }
      },
      {
        path: 'profile',
        name: 'StudentProfile',
        component: StudentProfile,
        meta: { title: 'Profile' }
      },
      {
        path: 'academic-evaluation',
        name: 'StudentAcademic',
        component: StudentAcademic,
        meta: { title: 'Academic Evaluation' }
      },
      {
        path: 'consultations',
        name: 'StudentConsultations',
        component: StudentConsultations,
        meta: { title: 'Consultations' }
      },
      {
        path: 'announcements',
        name: 'StudentAnnouncements',
        component: StudentAnnouncements,
        meta: { title: 'Announcements' }
      },
      {
        path: 'ssp',
        name: 'StudentSSP',
        component: StudentSSP,
        meta: { title: 'SSP' }
      },
      {
        path: 'ssp-history',
        name: 'SSPHistory',
        component: SSPHistory,
        meta: { title: 'SSP History' }
      },
      {
        path: 'odyssey-plan',
        name: 'StudentOdysseyPlan',
        component: StudentOdysseyPlan,
        meta: { title: 'Odyssey Plan' }
      },
      {
        path: 'surveys',
        name: 'StudentSurveys',
        component: StudentSurveys,
        meta: { title: 'Surveys' }
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
  
  // Set document title
  document.title = to.meta.title ? `${to.meta.title} | SSP Management System` : 'SSP Management System'
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAuth && to.meta.role && to.meta.role !== userRole) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/student/login' || to.path === '/register' || to.path === '/student/register') && isAuthenticated) {
    if (userRole === 'admin') {
      next('/admin')
    } else if (userRole === 'adviser') {
      next('/adviser')
    } else if (userRole === 'student') {
      next('/student')
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router 