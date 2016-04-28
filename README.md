DxE Philly API
==============
Used by dxephilly.org to pull out Facebook events. It's located at [api.dxephilly.org](api.dxephilly.org).

You can query:

* `/facebook/events`
* `/facebook/events/upcoming`
* `/facebook/events/upcoming/next`

That's it for now.

Note that this app depends on the presence of a `FACEBOOK_ACCESS_TOKEN` environment variable. You can add this to Dokku during deployment, or use a file called `env.js` during local development. See `env.example.js`.

Deployment
----------
If you have Dokku access to the server, you can add the remote.

    git remote add dokku dokku@dxephilly.org:api

Then push it to that remote to deploy.

    git push dokku master

License
-------
Copyright © 2016 DxE Tech Working Group and licensed under the GNU General Public License v3.0. See the LICENSE file for the complete license.
