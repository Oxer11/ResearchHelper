export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/login',
          },
        ],
      },
    ],
  },
  {
    path: '/welcome',
    authority: ['admin', 'user'],
    name: 'welcome',
    icon: 'home',
    component: './Welcome',
  },
  {
    path: '/papers',
    name: 'Papers',
    icon: 'filePdf',
    component: './Papers',
  },
  {
    path: '/projects',
    name: 'Projects',
    icon: 'appstore',
    component: './Projects',
  },
  {
    path: '/materials',
    name: 'Materials',
    icon: 'read',
    component: './Materials',
  },
  {
    path: '/todo',
    name: 'TODO',
    icon: 'carryOut',
    component: './TODO',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './ListTableList',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
