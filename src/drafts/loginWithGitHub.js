import OAuth from 'oauthio-web'

export default function loginWithGitHub() {

  OAuth.OAuth.initialize('tSDnEW0Qf9ntDedtCd6TOnWkXu0')

  OAuth.OAuth.popup(
    "github",
    {
      cache: true
    })
    .done(function(result) {
      console.log("Success: " + JSON.stringify(result));
    })
    .fail(function (err) {
      alert(err);
    })
}
