Authentication  
Learnworlds uses OAuth2 to allow access to it's API. You may request credentials to start using the API with a Learning Center or High Volume plan via your School (under Settings \-\> Developers \-\> API)

Learnworlds expects for the Access Token to be included in all API requests to the server in a header.  
Authorization: Bearer your\_access\_token

The token expiration period "expires\_in" is in seconds.  
Client credentials grant  
The client’s credentials are used to authenticate a request for an access token. This grant should only be allowed to be used by trusted clients. It is suitable for machine-to-machine authentication, for example for use in a cron job which is performing maintenance tasks over an API or sending information to a webhook about a new user purchase. Another example would be a client making requests to an API that doesn’t require user’s permission.

Keep this access\_token a secret  
With the following command you can generate an access token:

Example of the request: You can just pass the correct header with each request. {SCHOOLHOMEPAGE} should be the school domain.  
curl "https://{SCHOOLHOMEPAGE}/admin/api/oauth2/access\_token" \\  
  \-H "Lw-Client: your\_client\_id" \\  
  \-d data='{"client\_id":"your\_client\_id","client\_secret":"your\_client\_secret","grant\_type":"client\_credentials"}'  
The above command returns JSON structured like this:

Example of the response  
{  
  "tokenData": {  
    "access\_token": "tZGB6EHKfzMs9ecUFhPxDtXflQPKqHACIvcrd4Wx",  
    "token\_type": "Bearer",  
    "expires\_in": 8000  
  },  
  "errors": \[\],  
  "success": true  
}  
Resource owner credentials grant  
When this grant is implemented the client itself will ask the user for their username and password (as opposed to being redirected to an IdP authorisation server to authenticate) and then send these to the authorisation server along with the client’s own credentials. If the authentication is successful then the client will be issued with an access token.

This grant is suitable for trusted clients such as a service’s own mobile client (for example Spotify’s iOS app).

We recommend using a proxy for retrieving user access\_tokens as to not expose your client\_secret.  
By sending the users username and password to your server and then adding the client\_id/client\_secret & grant to the request before forwarding it to us, your able to achieve this.

With the following command you can generate an access token:

Example of the request: You can just pass the correct header with each reques. {SCHOOLHOMEPAGE} should be the school domain.  
curl "https://{SCHOOLHOMEPAGE}/admin/api/oauth2/access\_token" \\  
  \-H "Lw-Client: your\_client\_id" \\  
  \-d data='{"client\_id":"your\_client\_id","client\_secret":"your\_client\_secret","grant\_type":"password","email":"info@learnworlds.com","password":"learnworlds"}'  
The above command returns JSON structured like this:

Example of the response  
{  
  "tokenData":{  
    "access\_token":"WU5I1WGdG8Q0c5ujbOhMdwxB8GUNqXZcIUIYSHbo",  
    "token\_type":"Bearer",  
    "expires\_in":8000,  
    "refresh\_token":"X5aGSMjMuSTDH2GJluEtaWbedL8E5GK5mCj9pw4D"  
  },  
  "errors":\[\],  
  "success":true  
}  
Refresh token grant  
As you might have noticed, when using the Resourse owner credentials grant you also get a refresh token. When the access token expires instead of sending the user back through the authorisation code grant the client can use to the refresh token to retrieve a new access token with the same permissions as the old one.

We recommend using a proxy for this request also, as not to expose your client\_secret.  
With the following command you can refresh an access token:

Example of the request: You can just pass the correct header with each request. {SCHOOLHOMEPAGE} should be the school domain.  
curl "https://{SCHOOLHOMEPAGE}/admin/api/oauth2/access\_token" \\  
  \-H "Lw-Client: your\_client\_id" \\  
  \-d data='{"client\_id":"your\_client\_id","client\_secret":"your\_client\_secret","grant\_type":"refresh\_token","refresh\_token":"your\_refresh\_token"}'  
The above command returns JSON structured like this:

Example of the response  
{  
  "tokenData":{  
    "access\_token":"arixvvB0brmj4n79XFdkL2RIpZ2kGmyKKJ6mBMEC",  
    "token\_type":"Bearer",  
    "expires\_in":8000,  
    "refresh\_token":"sS1NWMgUokADowkG5jU1DFKWpapYz04mOir7Et7n"  
  },  
  "errors":\[\],  
  "success":true  
}  
If you send a bad or expired access token we will respond with the following error:

Example of the response  
{  
  "errors": \[  
    {  
      "code": 400,  
      "context": "access\_denied",  
      "message": "The resource owner or authorization server denied the request."  
    }  
  \],  
  "success": false  
}