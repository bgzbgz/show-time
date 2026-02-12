Webhooks  
A webhook is a way for an app to provide other applications with real-time information. It delivers data to other applications when triggered, meaning you get data immediately, unlike typical API calls where you would need to poll for data very frequently in order to get it in real-time.

You can trigger webhooks directly from within user automations, and send real-time data to external systems whenever specific events take place-based on the conditions you set. Learn more in this article.  
Webhook signatures  
Format  
With each incoming webhook from Learnworlds, a pre-shared Learnworlds-Webhook-Signature header is included, as shown in the following example:

Learnworlds-Webhook-Signature: v1=e8fad5b079d0977f61bc2d21fc5f461719e6478df7de56  
You can find the webhook signature in Learnworlds platform under Settings\>Developers\>Webhooks.

Compare the Learnworlds-Webhook-Signature, prefixed by v1=, to the expected signature. If they match, then you can trust that the event payload was issued by LearnWorlds.

Mitigate MITM (Man-in-the-Middle) Attacks  
To prevent MITM attacks resulting the signature being compromised use HTTPS for all your webhook endpoints.

Webhook events  
When a user is registered/updated  
Triggers a POST json request to the specified url when a new user is registered or a user profile is updated.

Example of the request  
{  
  "version": 2,  
  "type": "userUpdated",  
  "trigger": "user\_updated",  
  "school\_id": "60004a6de11ac0798538ccc2",  
  "data": {  
    "ip\_address": "",  
    "user": {  
      "created": 1630580658.435539,  
      "email": "john@doe.com",  
      "eu\_customer": null,  
      "fields": {  
        "address": null,  
        "behance": null,  
        "bio": "my story 2",  
        "birthday": null,  
        "cf\_customfield": "test",  
        "cf\_happy": "test",  
        "cf\_mycustom": "test",  
        "cf\_skill": "Excel",  
        "cf\_softwareskill": "ms word",  
        "cf\_startedtest": "2021-06-25",  
        "cf\_tellussomething": "test",  
        "cf\_test": "test",  
        "company": null,  
        "company\_size": null,  
        "country": null,  
        "dribbble": null,  
        "fb": null,  
        "github": null,  
        "graduation\_year": "2000",  
        "instagram": null,  
        "linkedin": null,  
        "location": "Panormo",  
        "phone": null,  
        "skype": null,  
        "twitter": "htttps://www.twitter.com",  
        "university": null,  
        "url": "https://test.com"  
      },  
      "id": "6130afb278d2c94eeb228d12",  
      "is\_admin": false,  
      "is\_affiliate": false,  
      "is\_instructor": false,  
      "is\_reporter": false,  
      "role": {  
        "level": "user",  
        "name": "User"  
      },  
      "last\_login": 1630580658.491329,  
      "signup\_approval\_status": "passed",  
      "referrer\_id": null,  
      "subscribed\_for\_marketing\_emails": null,  
      "tags": \["super", "learner"\],  
      "username": "john",  
      "first\_name": "",  
      "last\_name": "john",  
      "utms": {  
        "fc\_campaign": "WOW campaign",  
        "fc\_content": null,  
        "fc\_country": null,  
        "fc\_landing": "/",  
        "fc\_medium": "FB",  
        "fc\_referrer": null,  
        "fc\_source": "Facebook",  
        "fc\_term": null,  
        "lc\_campaign": null,  
        "lc\_content": null,  
        "lc\_country": null,  
        "lc\_landing": "/",  
        "lc\_medium": null,  
        "lc\_referrer": null,  
        "lc\_source": null,  
        "lc\_term": null  
      },  
      "billing\_info": {  
        "bf\_name" : "Sherlock Holmes",  
        "bf\_address" : "Baker Street 221B",  
        "bf\_city" : "London",  
        "bf\_postalcode" : "NW1",  
        "bf\_country" : "UK",  
        "bf\_taxid" : null  
      },  
      "nps\_score": 9,  
      "nps\_comment": "Fantastic learning resources."  
    }  
  }  
}  
When products are bought  
Triggers a POST json request to the specified url when a purchase occurs.

Example of the request:

{  
  "version": 2,  
  "type": "productBought",  
  "trigger": "new\_purchase",  
  "school\_id": "60004a6de11ac0798538ccc2",  
  "data": {  
    "ip\_address": null,  
    "payment": {  
      "affiliate": null,  
      "coupon": null,  
      "created": 1637235626.53355,  
      "discount": 0,  
      "gateway": null,  
      "id": "61963baafbbd1d36c777b493",  
      "instructors": \[\],  
      "instructors\_total\_percentage": null,  
      "invoice": null,  
      "billing\_info": {  
        "bf\_name" : "Sherlock Holmes",  
        "bf\_address" : "Baker Street 221B",  
        "bf\_city" : "London",  
        "bf\_postalcode" : "NW1",  
        "bf\_country" : "UK",  
        "bf\_taxid" : null  
      },  
      "paid\_at": 1637235626.56606,  
      "payment\_plan\_current\_payment": null,  
      "payment\_plan\_total\_payments": null,  
      "period": null,  
      "price": 100,  
      "product": {  
        "description": null,  
        "discount\_price": 0,  
        "final\_price": 100,  
        "id": "webex",  
        "image": null,  
        "name": "Webex",  
        "original\_price": 100,  
        "trial\_days": 0,  
        "type": "course"  
      },  
      "refund\_at": null,  
      "tax\_amount": 0,  
      "tax\_percentage": 0,  
      "transaction\_id": "Added by admin",  
      "type": "one-off",  
      "user\_id": "618e6db9cfb2226fe229d927"  
    },  
    "user": {  
      "created": 1636724153.189269,  
      "email": "john@doe.com",  
      "eu\_customer": false,  
      "fields": {  
        "address": null,  
        "behance": null,  
        "bio": "my story",  
        "birthday": null,  
        "company": null,  
        "company\_size": null,  
        "country": null,  
        "dribbble": null,  
        "fb": null,  
        "github": null,  
        "graduation\_year": "2000",  
        "instagram": null,  
        "linkedin": null,  
        "location": "Athens",  
        "phone": null,  
        "skype": null,  
        "twitter": "htttps://www.twitter.com",  
        "university": null,  
        "url": "https://test.com"  
      },  
      "id": "618e6db9cfb2226fe229d927",  
      "is\_admin": false,  
      "is\_affiliate": true,  
      "is\_instructor": false,  
      "is\_reporter": false,  
      "role": {  
        "level": "user",  
        "name": "User"  
      },  
      "last\_login": 1637222305.3564,  
      "signup\_approval\_status": "passed",  
      "referrer\_id": null,  
      "subscribed\_for\_marketing\_emails": null,  
      "tags": \[  
        "testgeo",  
        "test2geo"  
      \],  
      "username": "johndoe",  
      "first\_name": "",  
      "last\_name": "johndoe",  
      "utms": {  
        "fc\_campaign": "WOW campaign",  
        "fc\_content": null,  
        "fc\_country": null,  
        "fc\_landing": "/",  
        "fc\_medium": "FB",  
        "fc\_referrer": null,  
        "fc\_source": "Facebook",  
        "fc\_term": null,  
        "lc\_campaign": null,  
        "lc\_content": null,  
        "lc\_country": null,  
        "lc\_landing": "/",  
        "lc\_medium": null,  
        "lc\_referrer": null,  
        "lc\_source": null,  
        "lc\_term": null  
      },  
      "billing\_info": {  
        "bf\_name" : "Sherlock Holmes",  
        "bf\_address" : "Baker Street 221B",  
        "bf\_city" : "London",  
        "bf\_postalcode" : "NW1",  
        "bf\_country" : "UK",  
        "bf\_taxid" : null  
      },  
      "nps\_score": 9,  
      "nps\_comment": "Fantastic learning resources."  
    }  
  }  
}  
When a user enrolls in a free course  
Triggers a POST json request to the specified url when a user enrolls in a free course.

Example of the request:

{  
  "version": 2,  
  "type": "enrolledFreeCourse",  
  "trigger": "enrolled\_free",  
  "school\_id": "60004a6de11ac0798538ccc2",  
  "data": {  
    "ip\_address": null,  
    "date": 1638190255,  
    "course": {  
      "access": "free",  
      "afterPurchase": null,  
      "author": null,  
      "categories": \[\],  
      "courseImage": null,  
      "created": 1637232215.057839,  
      "description": null,  
      "discount\_price": 0,  
      "dripFeed": "none",  
      "expires": null,  
      "expiresType": "weeks",  
      "final\_price": 0,  
      "id": "sample-course",  
      "label": null,  
      "modified": 1637232244.922408,  
      "original\_price": 0,  
      "title": "sample course",  
      "identifiers": {  
        "google\_store\_id": "sample\_course",  
        "apple\_store\_id": "sample\_course"  
      }  
    },  
    "user": {  
      "created": 1636724153.189269,  
      "email": "john@doe.com",  
      "eu\_customer": false,  
      "fields": {  
        "address": null,  
        "behance": null,  
        "bio": "my story",  
        "birthday": null,  
        "company": null,  
        "company\_size": null,  
        "country": null,  
        "dribbble": null,  
        "fb": null,  
        "github": null,  
        "graduation\_year": "2000-10-10",  
        "instagram": null,  
        "linkedin": null,  
        "location": "Athens",  
        "phone": null,  
        "skype": null,  
        "twitter": "htttps://www.twitter.com",  
        "university": null,  
        "url": "https://test.com"  
      },  
      "id": "618e6db9cfb2226fe229d927",  
      "is\_admin": false,  
      "is\_instructor": false,  
      "is\_reporter": false,  
      "role": {  
        "level": "user",  
        "name": "User"  
      },  
      "is\_affiliate": true,  
      "last\_login": 1637222305.3564,  
      "signup\_approval\_status": "passed",  
      "referrer\_id": null,  
      "subscribed\_for\_marketing\_emails": null,  
      "tags": \[  
        "testgeo",  
        "test2geo"  
      \],  
      "username": "johndoe",  
      "first\_name": "",  
      "last\_name": "johndoe",  
      "utms": {  
        "fc\_campaign": "WOW campaign",  
        "fc\_content": null,  
        "fc\_country": null,  
        "fc\_landing": "/",  
        "fc\_medium": "FB",  
        "fc\_referrer": null,  
        "fc\_source": "Facebook",  
        "fc\_term": null,  
        "lc\_campaign": null,  
        "lc\_content": null,  
        "lc\_country": null,  
        "lc\_landing": "/",  
        "lc\_medium": null,  
        "lc\_referrer": null,  
        "lc\_source": null,  
        "lc\_term": null  
      },  
      "billing\_info": {  
        "bf\_name" : "Sherlock Holmes",  
        "bf\_address" : "Baker Street 221B",  
        "bf\_city" : "London",  
        "bf\_postalcode" : "NW1",  
        "bf\_country" : "UK",  
        "bf\_taxid" : null  
      },  
      "nps\_score": 9,  
      "nps\_comment": "Fantastic learning resources."  
    }  
  }  
}  
When an email lead is captured  
Triggers a POST json request to the specified url when an email is captured.

Example of the request:

{  
  "version": 2,  
  "type": "leadCreated",  
  "trigger": "email\_register",  
  "school\_id": "60004a6de11ac0798538ccc2",  
  "data": {  
    "created": 1636451710.954462,  
    "email": "john@doe.com",  
    "eu\_customer": null,  
    "first\_name": null,  
    "ip\_address": "172.19.0.1",  
    "last\_name": null,  
    "subscribed\_for\_marketing\_emails": false,  
    "tags": \[\],  
    "utms": {  
      "fc\_landing": "/",  
      "lc\_landing": "/"  
    },  
    "page\_submitted": "/"  
  }  
}  
When a certificate is awarded  
Triggers a POST json request to the specified url when a user is awarded a certificate.

Example of the request:

{  
  "version": 2,  
  "type": "awardedCertificate",  
  "trigger": "certificate\_awarded",  
  "school\_id": "60004a6de11ac0798538ccc2",  
  "data": {  
    "ip\_address": null,  
    "certificate": {  
      "attempts": 0,  
      "course\_id": "certificate-course",  
      "form": {  
        "firstname": "John",  
        "lastname": "Doe",  
        "ptin": "123456"  
      },  
      "id": "619600bfec57735ec64a6b39",  
      "issued": 1637220543.671415,  
      "score": "OK",  
      "short\_url": false,  
      "status": "active",  
      "title": "Cert of Completion",  
      "type": "completion",  
      "user": {  
        "email": "john@doe.com",  
        "id": "618e6db9cfb2226fe229d927"  
      }  
    },  
    "user": {  
      "created": 1644228530.45123,  
      "email": "john@doe.com",  
      "eu\_customer": false,  
      "fields": {  
        "address": null,  
        "behance": null,  
        "bio": null,  
        "birthday": null,  
        "company": null,  
        "company\_size": null,  
        "country": null,  
        "dribbble": null,  
        "fb": null,  
        "github": null,  
        "graduation\_year": null,  
        "instagram": null,  
        "linkedin": null,  
        "location": null,  
        "phone": null,  
        "skype": null,  
        "twitter": null,  
        "university": null,  
        "url": null  
      },  
      "id": "618e6db9cfb2226fe229d927",  
      "is\_admin": false,  
      "is\_affiliate": false,  
      "is\_instructor": false,  
      "is\_reporter": false,  
      "role": {  
        "level": "user",  
        "name": "User"  
      },  
      "last\_login": 1646146990.079593,  
      "signup\_approval\_status": "passed",  
      "referrer\_id": null,  
      "subscribed\_for\_marketing\_emails": null,  
      "tags": \[\],  
      "username": "JohnDoe",  
      "first\_name": "",  
      "last\_name": "JohnDoe",  
      "utms": {  
        "fc\_landing": "/",  
        "lc\_landing": "/"  
      },  
      "billing\_info": {  
        "bf\_name" : "Sherlock Holmes",  
        "bf\_address" : "Baker Street 221B",  
        "bf\_city" : "London",  
        "bf\_postalcode" : "NW1",  
        "bf\_country" : "UK",  
        "bf\_taxid" : null  
      },  
      "nps\_score": 9,  
      "nps\_comment": "Fantastic learning resources."  
    }    
  }  
}  
When a course is completed  
Triggers a POST json request to the specified url when a user completes a course.

Example of the request:

{  
  "version": 2,  
  "type": "courseCompleted",  
  "trigger": "course\_completed",  
  "school\_id": "60004a6de11ac0798538ccc2",  
  "data": {  
    "completed\_at": 1637232384.736462,  
    "ip\_address": null,  
    "manually\_completed": false,  
    "course": {  
      "access": "free",  
      "afterPurchase": null,  
      "author": null,  
      "categories": \[\],  
      "courseImage": null,  
      "created": 1637232215.057839,  
      "description": null,  
      "discount\_price": 0,  
      "dripFeed": "none",  
      "expires": null,  
      "expiresType": "weeks",  
      "final\_price": 0,  
      "id": "sample-course",  
      "label": null,  
      "modified": 1637232244.922408,  
      "original\_price": 0,  
      "title": "sample course",  
      "identifiers": {  
        "google\_store\_id": "sample\_course",  
        "apple\_store\_id": "sample\_course"  
      }  
    },  
    "user": {  
      "created": 1636463631.488376,  
      "email": "john@doe.com",  
      "eu\_customer": false,  
      "fields": {  
        "address": null,  
        "behance": null,  
        "bio": "my story",  
        "birthday": null,  
        "cf\_checkboxtest": null,  
        "cf\_drop": null,  
        "cf\_mycustom": null,  
        "cf\_test": "123",  
        "company": null,  
        "company\_size": null,  
        "country": null,  
        "dribbble": null,  
        "fb": "htttps://www.fb.com",  
        "github": null,  
        "graduation\_year": "2000",  
        "instagram": null,  
        "linkedin": null,  
        "location": "Athens",  
        "phone": null,  
        "skype": null,  
        "twitter": "htttps://www.twitter.com",  
        "university": null,  
        "url": "https://test.com"  
      },  
      "id": "618a740f8d07051ab200e5f4",  
      "is\_admin": false,  
      "is\_affiliate": true,  
      "is\_instructor": false,  
      "is\_reporter": false,  
      "role": {  
        "level": "user",  
        "name": "User"  
      },  
      "last\_login": 1637233550.657523,  
      "signup\_approval\_status": "passed",  
      "referrer\_id": null,  
      "subscribed\_for\_marketing\_emails": null,  
      "tags": \[  
        "testgeo",  
        "hi"  
      \],  
      "username": "johndoe",  
      "first\_name": "",  
      "last\_name": "johndoe",  
      "utms": {  
        "fc\_landing": "/",  
        "lc\_landing": "/"  
      },  
      "billing\_info": {  
        "bf\_name" : "Sherlock Holmes",  
        "bf\_address" : "Baker Street 221B",  
        "bf\_city" : "London",  
        "bf\_postalcode" : "NW1",  
        "bf\_country" : "UK",  
        "bf\_taxid" : null  
      },  
      "nps\_score": 9,  
      "nps\_comment": "Fantastic learning resources."  
    }  
  }  
}  
When a learning program is completed  
Triggers a POST json request to the specified url when a user completes a learning program.

Example of the request:

{  
    "type": "learningProgramCompleted",  
    "trigger": "learning\_program\_completed",  
    "version": 2,  
    "school\_id": "60004a6de11ac0798538ccc2",  
    "data": {  
        "learningProgram": {  
            "id": "learning-program-sample",  
            "type": "learning\_collection",  
            "title": "learning program sample",  
            "access": "public",  
            "created": 1753261360,  
            "modified": 1753261582,  
            "identifiers": {  
                "slug": "learning-program-sample"  
            },  
            "expires": 15,  
            "expiresType": "days",  
            "description": null,  
            "image": null,  
            "trial\_days": 0,  
            "afterPurchase": {  
                "type" : "afterlogin",  
                "navigationType" : "global",  
                "settings" : {  
                    "url" : "",  
                    "page" : ""  
                }  
            },  
            "original\_price": 100,  
            "discount\_price": 0,  
            "final\_price": 100  
        },  
        "user": {  
            "created": 1636463631.488376,  
            "email": "john@doe.com",  
            "eu\_customer": false,  
            "fields": {  
                "address": null,  
                "behance": null,  
                "bio": "my story",  
                "birthday": null,  
                "cf\_checkboxtest": null,  
                "cf\_drop": null,  
                "cf\_mycustom": null,  
                "cf\_test": "123",  
                "company": null,  
                "company\_size": null,  
                "country": null,  
                "dribbble": null,  
                "fb": "htttps://www.fb.com",  
                "github": null,  
                "graduation\_year": "2000",  
                "instagram": null,  
                "linkedin": null,  
                "location": "Athens",  
                "phone": null,  
                "skype": null,  
                "twitter": "htttps://www.twitter.com",  
                "university": null,  
                "url": "https://test.com"  
            },  
            "id": "618a740f8d07051ab200e5f4",  
            "is\_admin": false,  
            "is\_instructor": false,  
            "is\_reporter": false,  
            "role": {  
                "level": "user",  
                "name": "User"  
            },  
            "is\_affiliate": true,  
            "last\_login": 1637233550.657523,  
            "signup\_approval\_status": "passed",  
            "email\_verification\_status": "verified",  
            "referrer\_id": null,  
            "subscribed\_for\_marketing\_emails": null,  
            "tags": \[  
                "testgeo",  
                "hi"  
            \],  
            "username": "johndoe",  
            "first\_name": "",  
            "last\_name": "johndoe",  
            "utms": {  
                "fc\_landing": "/",  
                "lc\_landing": "/"  
            },  
            "billing\_info": {  
                "bf\_name" : "Sherlock Holmes",  
                "bf\_address" : "Baker Street 221B",  
                "bf\_city" : "London",  
                "bf\_postalcode" : "NW1",  
                "bf\_country" : "UK",  
                "bf\_taxid" : null  
            },  
            "nps\_score": 9,  
            "nps\_comment": "Fantastic learning resources."  
        },  
        "completed\_at": 1753702464.760145,  
        "manually\_completed": false,  
        "ip\_address": "192.192.192.192"  
    }  
}  
When a subscription / installment is paid  
Triggers a POST json request to the specified url when a payment for a subscription / installment is received.

Example of the request:

{  
  "version": 2,  
  "school\_id": "5f2ad376d0c4c5292d2ed292",  
  "type": "subscriptionPaymentPlanBought",  
  "trigger": "subscription\_started",  
  "data": {  
    "date": 1638189386,  
    "payment": {  
      "affiliate": null,  
      "coupon": null,  
      "created": 1638189386.491724,  
      "discount": 0,  
      "gateway": "stripe",  
      "id": "61a4c94a669ab1013137de4c",  
      "instructors": \[\],  
      "instructors\_total\_percentage": null,  
      "invoice": "00012",  
      "billing\_info": {  
        "bf\_name" : "Sherlock Holmes",  
        "bf\_address" : "Baker Street 221B",  
        "bf\_city" : "London",  
        "bf\_postalcode" : "NW1",  
        "bf\_country" : "UK",  
        "bf\_taxid" : null  
      },  
      "paid\_at": 1638189386.506181,  
      "payment\_plan\_current\_payment": null,  
      "payment\_plan\_total\_payments": null,  
      "period": "Nov 29, 2021 \- Dec 29, 2021",  
      "price": 222,  
      "product": {  
        "description": null,  
        "discount\_price": 0,  
        "final\_price": 222,  
        "id": "subscription-1",  
        "image": null,  
        "name": "subscription-11",  
        "original\_price": 222,  
        "trial\_days": 0,  
        "type": "subscription"  
      },  
      "refund\_at": null,  
      "tax\_amount": 0,  
      "tax\_percentage": 0,  
      "transaction\_id": "in\_1K195mFXg6fvSXhnQcBlbjFk",  
      "type": "subscription",  
      "user\_id": "618133ab0d754108b05bad07"  
    },  
    "user": {  
      "user": {  
        "created": 1635857322.970936,  
        "email": "john@doe.com",  
        "eu\_customer": false,  
        "fields": {  
          "address": null,  
          "behance": null,  
          "bio": null,  
          "birthday": null,  
          "cf\_afreetext": "test",  
          "cf\_checkme": true,  
          "cf\_datetest": null,  
          "cf\_herosradiobuttons": "superman",  
          "cf\_rgbcolors": "red",  
          "company": null,  
          "company\_size": null,  
          "country": null,  
          "dribbble": null,  
          "fb": null,  
          "github": null,  
          "graduation\_year": null,  
          "instagram": null,  
          "linkedin": null,  
          "location": null,  
          "phone": null,  
          "skype": null,  
          "twitter": null,  
          "university": null,  
          "url": null  
        },  
        "id": "618133ab0d754108b05bad07",  
        "is\_admin": false,  
        "is\_affiliate": false,  
        "is\_instructor": false,  
        "is\_reporter": false,  
        "role": {  
          "level": "user",  
          "name": "User"  
        },  
        "last\_login": 1638189367.005288,  
        "signup\_approval\_status": "passed",  
        "referrer\_id": null,  
        "subscribed\_for\_marketing\_emails": null,  
        "tags": \[\],  
        "username": "Learner Plus test",  
        "first\_name": "Learner",  
        "last\_name": "Plus test",  
        "utms": {   
          "fc\_landing": "/",  
          "lc\_landing": "/"  
        },  
        "billing\_info": {  
          "bf\_name" : "Sherlock Holmes",  
          "bf\_address" : "Baker Street 221B",  
          "bf\_city" : "London",  
          "bf\_postalcode" : "NW1",  
          "bf\_country" : "UK",  
          "bf\_taxid" : null  
        },  
        "nps\_score": 9,  
        "nps\_comment": "Fantastic learning resources."  
      }  
    }  
  }  
}  
When a subscription / installment is canceled  
Triggers a POST json request to the specified url when a subscription / installment is canceled.

Example of the request:

{  
  "version": 2,  
  "school\_id": "5f2ad376d0c4c5292d2ed292",  
  "type": "subscriptionPaymentPlanCanceled",  
  "trigger": "subscription\_cancelled",  
  "data": {  
    "date": 1638189860,  
    "product": {  
      "id": "subscription-1",  
      "title": "subscription-11",  
      "type": "subscription"  
    },  
    "user": {  
      "created": 1635857322.970936,  
      "email": "john@doe.com",  
      "eu\_customer": false,  
      "fields": {  
        "address": null,  
        "behance": null,  
        "bio": null,  
        "birthday": null,  
        "cf\_afreetext": "test",  
        "cf\_checkme": true,  
        "cf\_datetest": null,  
        "cf\_herosradiobuttons": "superman",  
        "cf\_rgbcolors": "red",  
        "company": null,  
        "company\_size": null,  
        "country": null,  
        "dribbble": null,  
        "fb": null,  
        "github": null,  
        "graduation\_year": null,  
        "instagram": null,  
        "linkedin": null,  
        "location": null,  
        "phone": null,  
        "skype": null,  
        "twitter": null,  
        "university": null,  
        "url": null  
      },  
      "id": "618133ab0d754108b05bad07",  
      "is\_admin": false,  
      "is\_affiliate": false,  
      "is\_instructor": false,  
      "is\_reporter": false,  
      "role": {  
        "level": "user",  
        "name": "User"  
      },  
      "last\_login": 1638189802.907123,  
      "signup\_approval\_status": "passed",  
      "referrer\_id": null,  
      "subscribed\_for\_marketing\_emails": null,  
      "tags": \[\],  
      "username": "Learner Plus test",  
      "first\_name": "Learner",  
      "last\_name": "Plus test",  
      "utms": {   
        "fc\_landing": "/",  
        "lc\_landing": "/"  
      },  
      "billing\_info": {  
        "bf\_name" : "Sherlock Holmes",  
        "bf\_address" : "Baker Street 221B",  
        "bf\_city" : "London",  
        "bf\_postalcode" : "NW1",  
        "bf\_country" : "UK",  
        "bf\_taxid" : null  
      },  
      "nps\_score": 9,  
      "nps\_comment": "Fantastic learning resources."  
    }  
  }  
}  
When a subscription trial is started  
Triggers a POST json request to the specified url when a subscription trial is started.

Example of the request:

{  
  "version": 2,  
  "school\_id": "5f2ad376d0c4c5292d2ed292",  
  "type": "subscriptionTrialStarted",  
  "trigger": "subscription\_trial\_started",  
  "data": {  
    "date": 1638190255,  
    "subscription": {  
      "access": "public",  
      "afterPurchase": {  
        "settings": {  
          "page": "1-click-sales",  
          "url": null  
        },  
        "type": "afterlogin"  
      },  
      "created": 1636451207.689936,  
      "description": null,  
      "id": "test",  
      "image": null,  
      "interval": 2,  
      "interval\_type": "month",  
      "modified": 1636451424.295151,  
      "price": 100,  
      "products": {  
        "courses": \[  
          "course-2",  
          "test-certificate-2",  
          "test-certificate-6"  
        \]  
      },  
      "stripePlanId": "test",  
      "title": "test",  
      "trial\_period\_days": 4  
    },  
    "user": {  
      "created": 1635857322.970936,  
      "email": "john@doe.com",  
      "eu\_customer": false,  
      "fields": {  
        "address": null,  
        "behance": null,  
        "bio": null,  
        "birthday": null,  
        "cf\_afreetext": "test",  
        "cf\_checkme": true,  
        "cf\_datetest": null,  
        "cf\_herosradiobuttons": "superman",  
        "cf\_rgbcolors": "red",  
        "company": null,  
        "company\_size": null,  
        "country": null,  
        "dribbble": null,  
        "fb": null,  
        "github": null,  
        "graduation\_year": null,  
        "instagram": null,  
        "linkedin": null,  
        "location": null,  
        "phone": null,  
        "skype": null,  
        "twitter": null,  
        "university": null,  
        "url": null  
      },  
      "id": "618133ab0d754108b05bad07",  
      "is\_admin": false,  
      "is\_affiliate": false,  
      "is\_instructor": false,  
      "is\_reporter": false,  
      "role": {  
        "level": "user",  
        "name": "User"  
      },  
      "last\_login": 1638190239.649997,  
      "signup\_approval\_status": "passed",  
      "referrer\_id": null,  
      "subscribed\_for\_marketing\_emails": null,  
      "tags": \[\],  
      "username": "Learner Plus test",  
      "first\_name": "Learner",  
      "last\_name": "Plus test",  
      "utms": {   
        "fc\_landing": "/",  
        "lc\_landing": "/"  
      },  
      "billing\_info": {  
        "bf\_name" : "Sherlock Holmes",  
        "bf\_address" : "Baker Street 221B",  
        "bf\_city" : "London",  
        "bf\_postalcode" : "NW1",  
        "bf\_country" : "UK",  
        "bf\_taxid" : null  
      },  
      "nps\_score": 9,  
      "nps\_comment": "Fantastic learning resources."  
    }  
  }  
}  
When subscription trial ends in three days  
Triggers a POST json request to the specified url when a subscription trial ends in three days.

Example of the request:

{  
  "version": 2,  
  "school\_id": "5f2ad376d0c4c5292d2ed292",  
  "type": "subscriptionTrialWillEnd",  
  "trigger": "subscription\_trial\_will\_end",  
  "data": {  
    "date": 1638439700,  
    "subscription": {  
      "access": "public",  
      "afterPurchase": {  
        "settings": {  
          "page": "1-click-sales",  
          "url": null  
        },  
        "type": "afterlogin"  
      },  
      "created": 1638437228.761989,  
      "description": null,  
      "id": "chrys-adope-trial",  
      "image": null,  
      "interval": 1,  
      "interval\_type": "month",  
      "modified": 1638437228.761989,  
      "price": 80,  
      "products": {  
        "courses": \[  
          "my-exipring-course",  
          "course-1",  
          "course-3",  
          "paid",  
          "test-certificate-1"  
        \]  
      },  
      "stripePlanId": "chrys-adope-trial",  
      "title": "chrys adope trial",  
      "trial\_period\_days": 10  
    },  
    "user": {  
      "created": 1638437072.253471,  
      "email": "adope@getlearnworlds.com",  
      "eu\_customer": false,  
      "fields": {  
        "address": null,  
        "behance": null,  
        "bio": null,  
        "birthday": null,  
        "cf\_afreetext": null,  
        "cf\_checkme": true,  
        "cf\_datetest": null,  
        "cf\_herosradiobuttons": null,  
        "cf\_rgbcolors": "red",  
        "company": null,  
        "company\_size": null,  
        "country": null,  
        "dribbble": null,  
        "fb": null,  
        "github": null,  
        "graduation\_year": null,  
        "instagram": null,  
        "linkedin": null,  
        "location": null,  
        "phone": null,  
        "skype": null,  
        "twitter": null,  
        "university": null,  
        "url": null  
      },  
      "id": "61a890d07348c573f04a8126",  
      "is\_admin": false,  
      "is\_affiliate": false,  
      "is\_instructor": false,  
      "is\_reporter": false,  
      "role": {  
        "level": "user",  
        "name": "User"  
      },  
      "last\_login": 1638438972.27747,  
      "signup\_approval\_status": "passed",  
      "referrer\_id": null,  
      "subscribed\_for\_marketing\_emails": null,  
      "tags": \[\],  
      "username": "adope",  
      "first\_name": "",  
      "last\_name": "adope",  
      "utms": {  
        "fc\_landing": "/",  
        "lc\_landing": "/"  
      },  
      "billing\_info": {  
        "bf\_name" : "Sherlock Holmes",  
        "bf\_address" : "Baker Street 221B",  
        "bf\_city" : "London",  
        "bf\_postalcode" : "NW1",  
        "bf\_country" : "UK",  
        "bf\_taxid" : null  
      },  
      "nps\_score": 9,  
      "nps\_comment": "Fantastic learning resources."  
    }  
  }

}  
When a free section is previewed  
Triggers a POST json request to the specified url when a free section is previewed.

Example of the request:

{  
  "version": 2,  
  "type": "previewedFree",  
  "trigger": "free\_section\_previewed",  
  "school\_id": "60004a6de11ac0798538ccc2",  
  "data": {  
    "course": {  
      "access": "paid",  
      "afterPurchase": {  
        "settings": {  
          "page": null,  
          "url": null  
        },  
        "type": "course"  
      },  
      "author": null,  
      "categories": \[  
        "learning how to sleep",  
        "sleep now",  
        "sleeping like a pro"  
      \],  
      "courseImage": null,  
      "created": 1510243831.36581,  
      "description": "this is the description",  
      "discount\_price": 3,  
      "dripFeed": "date",  
      "expires": null,  
      "expiresType": "weeks",  
      "final\_price": 3,  
      "id": "10-secrets-of-sleep-walking",  
      "label": null,  
      "modified": 1637228295.279494,  
      "original\_price": 300,  
      "title": "10 secrets of sleep walking",  
      "identifiers": {  
        "google\_store\_id": "10\_secrets\_of\_sleep\_walking",  
        "apple\_store\_id": "10\_secrets\_of\_sleep\_walking"  
      }  
    },  
    "user": {  
      "created": 1636706835.084109,  
      "email": "john@doe.com",  
      "eu\_customer": null,  
      "fields": {  
        "address": null,  
        "behance": null,  
        "bio": "my story",  
        "birthday": null,  
        "cf\_checkboxtest": null,  
        "cf\_drop": null,  
        "cf\_mycustom": null,  
        "cf\_test": "123",  
        "company": null,  
        "company\_size": null,  
        "country": null,  
        "dribbble": null,  
        "fb": "htttps://www.fb.com",  
        "github": null,  
        "graduation\_year": "2000",  
        "instagram": null,  
        "linkedin": null,  
        "location": "Panormo",  
        "phone": null,  
        "skype": null,  
        "twitter": "htttps://www.twitter.com",  
        "university": null,  
        "url": "https://test.com"  
      },  
      "id": "618e2a13b1085d69803d4804",  
      "is\_admin": false,  
      "is\_affiliate": true,  
      "is\_instructor": false,  
      "is\_reporter": false,  
      "role": {  
        "level": "user",  
        "name": "User"  
      },  
      "last\_login": 1637228524.950613,  
      "signup\_approval\_status": "passed",  
      "referrer\_id": null,  
      "subscribed\_for\_marketing\_emails": null,  
      "tags": \[  
        "testgeo",  
        "test2geo"  
      \],  
      "username": "johndoe",  
      "first\_name": "",  
      "last\_name": "johndoe",  
      "utms": {   
        "fc\_landing": "/",  
        "lc\_landing": "/"  
      },  
      "billing\_info": {  
        "bf\_name" : "Sherlock Holmes",  
        "bf\_address" : "Baker Street 221B",  
        "bf\_city" : "London",  
        "bf\_postalcode" : "NW1",  
        "bf\_country" : "UK",  
        "bf\_taxid" : null  
      },  
      "nps\_score": 9,  
      "nps\_comment": "Fantastic learning resources."  
    }  
  }  
}  
When a subscription is updated  
Triggers a POST json request to the specified url when a subscription is updated.

Example of the request:

{  
"version": 2,  
  "school\_id": "5f2ad376d0c4c5292d2ed292",  
  "type": "subscriptionUpdated",  
  "trigger": "subsription\_changed",  
  "data": {  
    "action": "change\_plan",  
    "cancelled\_at": null,  
    "created\_at": "2021-12-02T12:11:45+02:00",  
    "new\_plan": {  
      "currency\_code": "EUR",  
      "description": "",  
      "discount\_price": 0,  
      "final\_price": 0,  
      "id": "chrys-sub-new",  
      "image": null,  
      "name": "chrys sub new",  
      "original\_price": 90,  
      "trial\_days": 0,  
      "type": "subscription"  
    },  
    "plan": {  
      "currency\_code": "EUR",  
      "description": "",  
      "discount\_price": 0,  
      "final\_price": 0,  
      "id": "chrys-adope-trial",  
      "image": null,  
      "name": "chrys adope trial",  
      "original\_price": 80,  
      "trial\_days": 10,  
      "type": "subscription"  
    },  
    "user": {  
      "created\_at": "2021-12-02T11:24:32+02:00",  
      "email": "adope@getlearnworlds.com",  
      "eu\_customer": false,  
      "fields": {  
        "address": null,  
        "behance": null,  
        "bio": null,  
        "birthday": null,  
        "cf\_afreetext": null,  
        "cf\_checkme": true,  
        "cf\_datetest": null,  
        "cf\_herosradiobuttons": null,  
        "cf\_rgbcolors": "red",  
        "company": null,  
        "company\_size": null,  
        "country": null,  
        "dribbble": null,  
        "fb": null,  
        "github": null,  
        "graduation\_year": null,  
        "instagram": null,  
        "linkedin": null,  
        "location": null,  
        "phone": null,  
        "skype": null,  
        "twitter": null,  
        "university": null,  
        "url": null  
      },  
      "first\_name": "adope",  
      "full\_name": "adope",  
      "id": "61a890d07348c573f04a8126",  
      "is\_admin": false,  
      "is\_affiliate": false,  
      "is\_instructor": false,  
      "is\_reporter": false,  
      "role": {  
        "level": "user",  
        "name": "User"  
      },  
      "last\_login": "2021-12-02T12:11:28+02:00",  
      "signup\_approval\_status": "passed",  
      "last\_name": null,  
      "referrer\_id": null,  
      "school\_id": "5f2ad376d0c4c5292d2ed292",  
      "subscribed\_for\_marketing\_emails": null,  
      "tags": \[\],  
      "utm": {  
        "fc\_campaign": null,  
        "fc\_content": null,  
        "fc\_country": null,  
        "fc\_landing": null,  
        "fc\_medium": null,  
        "fc\_referrer": null,  
        "fc\_source": null,  
        "fc\_term": null,  
        "lc\_campaign": null,  
        "lc\_content": null,  
        "lc\_country": null,  
        "lc\_landing": null,  
        "lc\_medium": null,  
        "lc\_referrer": null,  
        "lc\_source": null,  
        "lc\_term": null  
      },  
      "billing\_info": {  
        "bf\_name" : "Sherlock Holmes",  
        "bf\_address" : "Baker Street 221B",  
        "bf\_city" : "London",  
        "bf\_postalcode" : "NW1",  
        "bf\_country" : "UK",  
        "bf\_taxid" : null  
      },  
      "nps\_score": 9,  
      "nps\_comment": "Fantastic learning resources."  
    }  
  }  
}  
When a user unenrolls from product  
Triggers a POST json request to the specified url when a user unenrolls from product.

Example of the request:

{  
  "version": 2,  
  "type": "userUnenrolledFromProduct",  
  "trigger": "unenrolled\_from\_product",  
  "school\_id": "60004a6de11ac0798538ccc2",  
  "data": {  
    "product": {  
      "id": "bundle-new",  
      "title": "Bundle new",  
      "type": "bundle"  
    },  
    "user": {  
      "created": 1634025427.171115,  
      "email": "john@doe.com",  
      "eu\_customer": false,  
      "fields": {  
        "behance": null,  
        "bio": null,  
        "cf\_skill": null,  
        "dribbble": null,  
        "fb": null,  
        "github": null,  
        "instagram": null,  
        "linkedin": null,  
        "location": null,  
        "skype": null,  
        "twitter": null,  
        "url": "https://tetest123.com"  
      },  
      "id": "61653fd30711fe28fb773fc2",  
      "is\_admin": false,  
      "is\_affiliate": false,  
      "is\_instructor": false,  
      "is\_reporter": false,  
      "role": {  
        "level": "user",  
        "name": "User"  
      },  
      "last\_login": 1634025434.920639,  
      "signup\_approval\_status": "passed",  
      "referrer\_id": null,  
      "subscribed\_for\_marketing\_emails": null,  
      "tags": \[\],  
      "username": "johndoe",  
      "first\_name": "",  
      "last\_name": "johndoe",  
      "utms": {  
        "fc\_landing": "/",  
        "lc\_landing": "/terms"  
      },  
      "billing\_info": {  
        "bf\_name" : "Sherlock Holmes",  
        "bf\_address" : "Baker Street 221B",  
        "bf\_city" : "London",  
        "bf\_postalcode" : "NW1",  
        "bf\_country" : "UK",  
        "bf\_taxid" : null  
      },  
      "nps\_score": 9,  
      "nps\_comment": "Fantastic learning resources."  
    }  
  }  
}  
When tags added to a user  
Triggers a POST json request to the specified url when tags added to a user.

Example of the request:

{  
  "version": 2,  
  "type": "userTagAdded",  
  "trigger": "user\_tag\_added",  
  "school\_id": "60004a6de11ac0798538ccc2",  
  "data": {  
    "created": 1419607778.9599,  
    "email": "john@doe.com",  
    "eu\_customer": false,  
    "fields": {  
      "address": null,  
      "behance": null,  
      "bio": null,  
      "birthday": null,  
      "cf\_mycustom": null,  
      "cf\_test": null,  
      "company": null,  
      "company\_size": null,  
      "country": null,  
      "dribbble": null,  
      "fb": null,  
      "github": null,  
      "graduation\_year": null,  
      "instagram": null,  
      "linkedin": null,  
      "location": null,  
      "phone": null,  
      "skype": null,  
      "twitter": null,  
      "university": null,  
      "url": null  
    },  
    "id": "549d7ee2e4b4c8b511000000",  
    "is\_admin": true,  
    "is\_affiliate": false,  
    "is\_instructor": false,  
    "is\_reporter": false,  
    "role": {  
      "level": "user",  
      "name": "User"  
    },  
    "last\_login": 1623164654.90927,  
    "signup\_approval\_status": "passed",  
    "referrer\_id": null,  
    "subscribed\_for\_marketing\_emails": false,  
    "tags": \["hi", "user", "new", "learner"\],  
    "username": "john",  
    "first\_name": "",  
    "last\_name": "john",  
    "utms": {   
      "fc\_landing": "/",  
      "lc\_landing": "/"  
    },  
    "billing\_info": {  
      "bf\_name" : "Sherlock Holmes",  
      "bf\_address" : "Baker Street 221B",  
      "bf\_city" : "London",  
      "bf\_postalcode" : "NW1",  
      "bf\_country" : "UK",  
      "bf\_taxid" : null  
    },  
    "nps\_score": 9,  
    "nps\_comment": "Fantastic learning resources."  
  }  
}  
When tags removed from a user  
Triggers a POST json request to the specified url when tags removed from a user.

Example of the request:

{  
  "version": 2,  
  "type": "userTagDeleted",  
  "trigger": "user\_tag\_deleted",  
  "school\_id": "60004a6de11ac0798538ccc2",  
  "data": {  
    "created": 1419607778.9599,  
    "email": "john@doe.com",  
    "eu\_customer": false,  
    "fields": {  
      "address": null,  
      "behance": null,  
      "bio": null,  
      "birthday": null,  
      "cf\_mycustom": null,  
      "cf\_test": null,  
      "company": null,  
      "company\_size": null,  
      "country": null,  
      "dribbble": null,  
      "fb": null,  
      "github": null,  
      "graduation\_year": null,  
      "instagram": null,  
      "linkedin": null,  
      "location": null,  
      "phone": null,  
      "skype": null,  
      "twitter": null,  
      "university": null,  
      "url": null  
    },  
    "id": "549d7ee2e4b4c8b511000000",  
    "is\_admin": true,  
    "is\_affiliate": false,  
    "is\_instructor": false,  
    "is\_reporter": false,  
    "role": {  
      "level": "user",  
      "name": "User"  
    },  
    "last\_login": 1623164654.90927,  
    "signup\_approval\_status": "passed",  
    "referrer\_id": null,  
    "subscribed\_for\_marketing\_emails": false,  
    "tags": \["hi", "user"\],  
    "username": "Tech Support",  
    "first\_name": "Tech",  
    "last\_name": "Support",  
    "utms":  {  
      "fc\_landing": "/",  
      "lc\_landing": "/"  
    },  
    "billing\_info": {  
      "bf\_name" : "Sherlock Holmes",  
      "bf\_address" : "Baker Street 221B",  
      "bf\_city" : "London",  
      "bf\_postalcode" : "NW1",  
      "bf\_country" : "UK",  
      "bf\_taxid" : null  
    },  
    "nps\_score": 9,  
    "nps\_comment": "Fantastic learning resources."  
  }  
}  
When a payment is created  
Triggers a POST json request to the specified url when a payment is created.

Example of the request:

{  
  "version": 2,  
  "type": "paymentCreated",  
  "trigger": "new\_purchase",  
  "school\_id": "60004a6de11ac0798538ccc2",  
  "data": {  
    "payment": {  
      "affiliate": null,  
      "coupon": null,  
      "created": 1637235626.53355,  
      "discount": 0,  
      "gateway": null,  
      "id": "61963baafbbd1d36c777b493",  
      "instructors": \[\],  
      "instructors\_total\_percentage": null,  
      "invoice": null,  
      "billing\_info": {  
        "bf\_name" : "Sherlock Holmes",  
        "bf\_address" : "Baker Street 221B",  
        "bf\_city" : "London",  
        "bf\_postalcode" : "NW1",  
        "bf\_country" : "UK",  
        "bf\_taxid" : null  
      },  
      "paid\_at": 1637235626.56606,