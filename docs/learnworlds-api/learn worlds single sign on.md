Single Sign-on  
What is this?  
It redirects users from your website/application to your LearnWorlds and seamlessly logs them in with the same email address they used to sign up for your original website/application. If no account with that email address exists yet, one is created. There is no need to synchronize any customer databases.

SSO with a User's Email or User ID  
This is to be used in cases where you have a user's email address or the user's LearnWorlds User ID and would like to send them to your school already logged in. If a user does not exist then one will be automatically be created (in this case the email & username parameters are mandatory and the user\_id parameter is ignored).

If a user already exists and username or avatar parameters are also provided in the request, then previous values will be overwritten (useful for syncing data).

The access token should be your application's access token, obtaining an application access token can be found here. {SCHOOLHOMEPAGE} should be the school domain.

POST https://{SCHOOLHOMEPAGE}/admin/api/sso

Post parameters

Parameter	Description  
email	The email of the user you want to login.  
username	The username of the user.  
avatar	A url to a user's avatar.  
redirectUrl	The full url you want the user to be redirected to after succefully logging in.  
user\_id	(Optional) can be used instead of the email.  
token	(Optional) GET parameter that returns tokenData (more here) instead of a redirectUrl.  
Example of the request: You can just pass the correct header with each request. {SCHOOLHOMEPAGE} should be the school domain.  
curl \-X POST https://{SCHOOLHOMEPAGE}/admin/api/sso \\  
\-H "Lw-Client: your\_client\_id" \\  
\-H "Authorization: Bearer application\_access\_token" \\  
\-d data='{"email":"test@example.com", "username":"LearnWorlds", "avatar":"https://api.adorable.io/avatars/285/test@example.com.png", "redirectUrl":"https://learnworlds.com"}'  
The above command returns JSON structured like this:

Example of the response  
{  
  "success": true,  
  "url": "https://your-domain.com/login?code=secret-code-here",  
  "user\_id": "560a96b48a548585107b23c7"  
}  
SSO with a User's Access Token  
This is to be used in cases where you have a user's access token and would like to send them to your school already logged in.

The access token should be a user access token not your application's. Obtaining a user's access token can be found here. {SCHOOLHOMEPAGE} should be the school domain.

POST https://{SCHOOLHOMEPAGE}/admin/api/user/sso

Post parameters

Parameter	Description  
redirectUrl	The full url you want the user to be redirected to after succefully logging in.  
Example of the request: You can just pass the correct header with each request. {SCHOOLHOMEPAGE} should be the school domain.  
curl \-X POST https://{SCHOOLHOMEPAGE}/admin/api/user/sso \\  
\-H "Lw-Client: your\_client\_id" \\  
\-H "Authorization: Bearer users\_access\_token" \\  
\-d data='{"redirectUrl":"https://learnworlds.com"}'  
The above command returns JSON structured like this:

Example of the response  
{  
  "success": true,  
  "url": "https://your-domain.com/login?code=secret-code-here"  
}

