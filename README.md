DxE Philly API
==============
Used by dxephilly.org to pull out Facebook events. It's located at [api.dxephilly.org](api.dxephilly.org).

You can query:

* `/facebook/events`
* `/facebook/events/upcoming`
* `/facebook/events/upcoming/next`

That's it for now.

Note that this app depends on the presence of a `FACEBOOK_ACCESS_TOKEN` environment variable. You can add this to Dokku during deployment, or use a file called `env.js` during local development. See `env.example.js`.

Local Development
-----------------
WIP

Deployment
----------
This app is deployed with Dokku. [Learn about](https://github.com/directactioneverywhere/dxe-learn2dokku) how DxE Tech deploys with Dokku. The Dokku git remote is:

    dokku@dxephilly.org:api

License
=======
dxephilly-api is licensed under GNU GPL version 3.0. For the full license see the LICENSE file.
