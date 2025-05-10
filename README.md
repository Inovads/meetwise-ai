
## Project info

This is a base project that uses Supabase as the backend for authentication. This should get you started quickly and save you time and/or AI prompts. This was built using Lovable.Dev platform but can also be used outside it.

What works:
- user sign up and login
- two roles: user and admin
- user editing and deletion by admin user
- change password while logged on
- reset forgotten password utility

**URL**: https://lovable.dev/projects/f691661f-8846-4fa7-8db0-c51f78f7db9c
The above may not work in the future, as I might be disconnecting supabase from it.


## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

I don't think you can use Lovable's remix option here, since I believe that doesn't work if the code is in Github.

You can do the following:
1. Clone this project to your computer
2. Create a new project on lovable, export to Github
3. Clone that new project to your computer too.
4. Delete everything in the new project except the .git folder and .gitignore.
5. Copy over this project to your new project
6. Push the changes to your new project back to Github.
7. Lovable will pick up the changes
8. Ask Lovable to connect the project to Supabase and update the src/integrations/supabase/client.ts with your supabase url and key
9. Run all the sqls in the supabase/migrations folder
10. In Supabase, under Authentication -> URL Configuration, set the Site Url to your Lovable project preview URL. Also set one Redirect URL to https://your.preview.url/*
11. Access the app and sign up a new user
11. make the new user an admin by executing the following in Supabase SQL editor:
```
update user_roles 
set role='admin'::app_role
where user_id=(select id from profiles where email='REPLACE_THIS_WITH_YOUR_REGISTERED_EMAIL')
```
That should be enough for you to have an admin user and manage other users from within the app from hereon


**Use your preferred IDE**

If you're already comfortably using your own IDE, then I think you know what to do :)
The only suggestion I have for you is to move the Supabase settings out of src/integrations/supabase/client.ts into maybe an .env file.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase


P.S. I can only offer best effort support here, unless we engage in a consulting arrangement :)
     Also, the usual disclaimers - I take no responsibility for how people will use this project and assume no liability for any damage or loss caused by its use.
