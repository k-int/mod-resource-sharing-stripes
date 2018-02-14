module.exports = {
  okapi: { 'url':'http://localhost:9130', 'tenant':'diku' },
  config: {
//     autoLogin: { username: 'diku_admin', password: 'admin' },
//     logCategories: 'core,redux,connect,connect-fetch,substitute,path,mpath,mquery,action,event,perm,interface,xhr',
//     logPrefix: 'stripes',
//     logTimestamp: true,
//     showPerms: true,
//     listInvisiblePerms: true,
//     disableAuth: false
     hasAllPerms: true,
//     softLogout: false
  },
  modules: {
    '@folio/users': {},
    '@k-int/resource-sharing': {},
//    '@folio/plugin-schema-forms': {}
  }
};
