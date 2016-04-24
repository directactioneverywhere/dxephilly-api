DxE Philly API
==============
Used by dxephilly.org to pull out Facebook events. It's located at [api.dxephilly.org](api.dxephilly.org).

You can query:

* `/facebook/events`
* `/facebook/events/upcoming`
* `/facebook/events/upcoming/next`

That's it for now.

Note that you need to drop in a file called `facebook_access_token` in the project directory in order to run this locally. Any access token will do, as this information is all public.

Deployment
----------
If you have Dokku access to the server, you can add the remote.

    git remote add dokku dokku@dxephilly.org:api.dxephilly.org

Then push it to that remote to deploy.

    git push dokku master
