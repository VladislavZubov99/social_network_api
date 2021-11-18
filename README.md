# REST API (Express, Postgresql)

Before starting project you have to set the variables for your environment <br/>
You can see examples for variables in .env.example

## Install

    npm install

## Create Empty Tables in Database
**Note! This command clear all the data that was before** 

    npm run migrate

## Add Dummy Data to the Database

    npm run dummy

## Run the App

    npm start


# API
- [Sign Up](#sign-up)
- [Sign In](#sign-in)
- [Get Profile](#get-profile)
- [Update Profile](#update-profile)
- [Get Posts](#get-posts)
- [Get Post By ID](#get-post-by-id)
- [Create Post](#create-post)
- [Update Post](#update-post-by-id)
- [Delete Post](#delete-post-by-id)
- [Add Comment](#add-comment)
- [Edit Comment](#edit-comment)
- [Delete Comment](#delete-comment)

Heroku Url: 
`https://levi-social-network-api.herokuapp.com`

## Sign Up
### Request
`POST /api/auth/sign_up`
### Body
    {
        email:      "string",   !required
        password:   "string",   !required
        name:       "string",   optional
        surname:    "string",   optional
    }
### Response
        Status: 200 OK
    {
        id:         number,
        email:      "string",
        name:       "string" | null,
        surname:    "string" | null,
        token:      "string"
    }


## Sign In
### Request
`POST /api/auth/sign_in`
### Body
    {
        email:      "string",   !required
        password:   "string",   !required
    }
### Response
        Status: 200 OK
    {
        id:         number,
        email:      "string",
        name:       "string" | null,
        surname:    "string" | null,
        token:      "string"
    }


## Get Profile
### Request
`GET /api/users/profile`

`
 headers:
    Authorization: token(string) !requred
`

To get 10 posts through 5 do this:

    `/api/users/profile?limit=10&offset=5`

`offset=5`  means, ‘skip the first 5 posts’ <br />
`limit=10`  means, ‘return a maximum of 10 posts’ <br />

### Response
        Status: 200 OK
    {
        id:         number,
        email:      "string",
        name:       "string" | null,
        surname:    "string" | null,
        posts: [
            {
                id: number,
                user_id: number,
                title: "string",
                createdAt: "Date string"
            },
            {...}
            ...
        ]
    }


## Update Profile
### Request
`PUT /api/user/pofile`

`headers:
    Authorization: token(string) !requred
`
### Body
    {
        name:      "string",   optional
        surname:   "string",   optional
    }
### Response
        Status: 200 OK
    {
        id:         number,
        email:      "string",
        name:       "string" | null,
        surname:    "string" | null,
    }


## Get Posts
### Request
`GET /api/posts`

`
 headers:
    Authorization: token(string) !requred
`


### Params
To get 10 posts through 5 with 2 comment do this:

    `/api/posts?limit=10&offset=5&comment_limit=2&comment_offset=0`

`offset=5`  means, ‘skip the first 5 posts’ <br />
`limit=10`  means, ‘return a maximum of 10 posts’ <br />
the same for comments in each post: <br />
`comment_offset=0`  means, ‘skip the first 0 comments’ <br />
`comment_limit=2`   means, ‘a maximum of 2 comments in each post’ <br />

### Response
        Status: 200 OK
    [
        {
            id:             number,
            user_id:        number,
            title:          "string",
            description:    "string" | null,
            createdAt:      "Date string"
            comments: [
                {
                    id:             number,
                    user_id:        number,
                    post_id:        number,
                    title:          "string",     
                    createdAt:      "Date string"              
                },
                {...},
                {...}
            ]
        },
        {...},
        {...}
    ]


## Get Post by ID
### Request
`GET /post/[:id]`

`
 headers:
    Authorization: token(string) !requred
`
### Params
To get 10 comments through 5 in the post do this:

    `/api/posts?&comment_limit=10&comment_offset=5`

`comment_offset=5`  means, ‘skip the first 5 comments’ <br />
`comment_limit=10`   means, ‘a maximum of 10 comments in the post’ <br />

### Response
        Status: 200 OK
    {
        id:             number,
        user_id:        number,
        title:          "string",
        description:    "string" | null,
        createdAt:      "Date string"
        comments: [
            {
                id:             number,
                user_id:        number,
                post_id:        number,
                title:          "string",     
                createdAt:      "Date string"              
            },
            {...},
            {...}
        ]
    },


## Create Post
### Request
`POST /api/posts`

`
 headers:
    Authorization: token(string) !requred
`
### Body
    {
        title:         "string",   !required
        description:   "string",   optional
    }
### Response
        Status: 201 OK
    {
        id:             number,
        user_id:        number,
        title:          "string",
        description:    "string" | null,
        createdAt:      "Date string"
    },



## Update Post by ID
### Request
`PUT /api/posts`

`
 headers:
    Authorization: token(string) !requred
`
### Body
    {
        title:         "string",   optional
        description:   "string",   optional
    }
### Response
        Status: 200 OK
    {
        id:             number,
        user_id:        number,
        title:          "string",
        description:    "string" | null,
        createdAt:      "Date string"
    },


## Delete Post by ID
### Request
`DELETE /api/posts/[:id]`

`
 headers:
    Authorization: token(string) !requred
`
### Response
        Status: 200 OK
    {
        success: bollean
    },



## Add Comment
### Request
`POST /api/comments/`

`
 headers:
    Authorization: token(string) !requred
`
### Body
    {
        post_id:       "number",   !required
        title:         "string",   !required
    }
### Response
        Status: 201 OK
    {
        id:             number,
        user_id:        number,
        post_id:        number,
        title:          "string",
        createdAt:      "Date string"
    },



## Edit Comment
### Request
`PUT /api/comments/[:id]`

`
 headers:
    Authorization: token(string) !requred
`
### Body
    {
        title:         "string",   !required
    }
### Response
        Status: 200 OK
    {
        id:             number,
        user_id:        number,
        title:          "string",
        createdAt:      "Date string"
    },


## Delete Comment
### Request
`DELETE /api/comments/[:id]`

`
 headers:
    Authorization: token(string) !requred
`
### Response
        Status: 200 OK
    {
        success: bollean
    },

