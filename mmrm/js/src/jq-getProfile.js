function getMemberProfile() {
   let meta = document.querySelector('[name="get_member_profile_url"]');
   if (meta === null) return;
   $.ajax({
      url: meta.content,
      method: 'post',
      data: {},
      success(res) {
         let profile = res.results.member_profile;
         $('#myUserName').text(profile.name);
      },
      error(err) {
         let statusCode = err.status;
         if (statusCode === 401 || statusCode === 403) {
            let meta = document.querySelector('[name=login_url]');
            location.href = meta.content;
         }
      }
   })
}

function getLocalProfile() {
   let storage = localStorage.getItem('member_profile');
   if (storage !== null) {
      let profile = JSON.parse(storage);
      $('#myUserName').text(profile.name);
   } else {
      getMemberProfile();
   }
}

getLocalProfile();