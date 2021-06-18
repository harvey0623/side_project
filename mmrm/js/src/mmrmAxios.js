const mmrmAxios = axios.create({});

mmrmAxios.interceptors.request.use(function (config) {
   return config;
}, function (error) {
   return Promise.reject(error);
});

mmrmAxios.interceptors.response.use(function (response) {
   return response;
}, function (error) {
   if (error.response.status === 403) {
      let meta = document.querySelector('[name=login_url]');
      location.href = meta.content;
      return;
   }
   return Promise.reject(error);
});