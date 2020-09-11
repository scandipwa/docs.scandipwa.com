---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: How To Contribute
description: How to contribute? Find out here.

# Micro navigation
micro_nav:
  enabled: true
  url: '/docs/installation/docker'
  title: Docker

---

## How To Contribute: From Install To Pull-Request
<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/BWBvjkpIaY8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Topics covered in this tutorial:
- [Setting up ScandiPWA](#setting-up-scandipwa)
- [Making A Contribution: Front-End](#making-a-contribution-front-end)
- [Making A Contribution: Back-End](#making-a-contribution-back-end)


## Setting up ScandiPWA
The first thing you need to do is make sure you have [forked](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) and [cloned](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) the `scandipwa-base` project.

First, let's open up the terminal and navigate to the project's directory.

```bash
cd ~/Myproject/scandipwa-base/
ls -la # confirm that we're in the right place
```
Previously, in the [Linux Docker set-up](https://docs.scandipwa.com/docs/linux.html) we already created aliases for `docker-compose` commands. Here's a little refresher:
```bash
# use `dc` to start without `frontend` container
alias dc="docker-compose -f docker-compose.yml -f docker-compose.local.yml -f docker-compose.ssl.yml"

# use `dcf` to start with `frontend` container
alias dcf="docker-compose -f docker-compose.yml -f docker-compose.local.yml -f docker-compose.ssl.yml -f docker-compose.frontend.yml"

# use `inapp` to quickly get inside of the app container
alias inapp="docker-compose -f docker-compose.yml -f docker-compose.local.yml -f docker-compose.ssl.yml -f docker-compose.frontend.yml exec -u user app"

# use `infront` to quickly get inside of the frontend container
alias infront="docker-compose -f docker-compose.yml -f docker-compose.local.yml -f docker-compose.ssl.yml -f docker-compose.frontend.yml exec -w /var/www/public/app/design/frontend/Scandiweb/pwa/ frontend"

# use `applogs` to quickly see the last 100 lines of app container logs
alias applogs="docker-compose logs -f --tail=100 app"

# use `frontlogs` to quickly see the last 100 lines of frontend container logs
alias frontlogs="docker-compose -f docker-compose.yml -f docker-compose.local.yml -f docker-compose.ssl.yml -f docker-compose.frontend.yml logs -f --tail=100 frontend"
```
We can also look for a specific alias by piping:
```bash
alias|grep dcf
```
If we want to contribute we run:
```bash
docker-compose -f docker-compose.yml -f docker-compose.local.yml -f docker-compose.ssl.yml -f docker-compose.core.yml
```
Instead of the `docker-compose.frontend.yml` we use `docker-compose.core.yml`, where `core` stands for contribution.

Before this, though, we need to make sure that we've cloned our theme in the correct place. 

Let's make a new folder in the `scandipwa-base/src` folder. We'll use this later for composer packages in order to locally connect to them.
```bash
mkdir src/localmodules
```
Next, we need to fork the [ScandiPWA base theme](https://github.com/scandipwa/base-theme) and clone it in the `src/localmodules` folder.

After returning to the `scandipwa-base` folder we need to run one of our previously aliased commands in order to recreate the docker set-up without front-end:
```bash
dc up -d
```
You can read more about the `docker-compose up` command [here](https://docs.docker.com/compose/reference/up/).

Next, we use `applogs` to check-out the last 100 lines of app container logs.

If you see the `Connection to Redis failed` error, you need to force-recreate:
```bash
dc up -d --force-recreate
```
Next we run the `inapp` alias to get inside of the app container and [execute](https://docs.docker.com/engine/reference/commandline/exec/) an interactive `bash` shell in it:
```bash
inapp bash
```
Let's go to the `localmodules/base-theme/` folder and run `npm ci` to get a clean install of the necessary dependencies.
```bash
cd localmodules/base-theme/
npm ci
```
After installing the modules we can `exit` the app for now.
Now, back in the `scandipwa-base` folder run the following to compose the core contribution file:
```bash
dc -f docker-compose.core.yml up -d
```
The `docker-compose.core.yml` and `docker-compose.frontend.yml` files are the same except for the command `pm2-watch`, which in the `core` file is replaced by `dev-server-core`. 

In `frontend` the vendor folders are mapped, however, in `core` only the `base-theme` is mapped.

This is because a fall-back mechanism is not needed when you're contributing - every file in the theme is present.

> **Note**
>
> Never use `docker-compose.core.yml` and `docker-compose.frontend.yml` at the same time.

Next, use `frontlogs` to see if `core` has compiled and type `scandipwa.local` in your browser to check-out if everything is working.

Next, using whatever text editor you fancy, open the folder `src/local-modules/base-theme` and start customising!

## Making A Contribution: Front-End
> **Note**
>
> Your feature branches must be made from the stable branch.

Note that any contributions must be made to the stable branch, which at this point is `2.x-stable`.

So, after you've made the changes save them, [`checkout`](https://git-scm.com/docs/git-checkout) to the latest stable [branch](https://git-scm.com/docs/git-branch) and [`git stash pop`](https://git-scm.com/docs/git-stash)

The standard sequence after making changes:
```bash
git stash save
git branch <stable-branch-name> HEAD
git checkout -b <your-branch-name> # add a descriptive branch name
git stash pop
```
Check-out the git reference [here](https://git-scm.com/docs).

After doing this you can commit as usual:
```bash
git add <files>
git commit -m "your-message"
git push
git push -u origin <your-branch-name>
```
After this you should see <your-branch-name> in your GitHub account and create a pull request.

After this the pull request will be reviewed by our fabulous maintainers and either be approved or closed.

## Making A Contribution: Back-End
Clone the repo the same way as previously, you can choose e.g. `store-graphql`.

If you want to contribute to one of the back-end features, you have to select a one patch number higher than that of the available ones.

So if the latest release is 1.0.2, yours will be 1.0.3

First we need to find out which version we currently have, so let's enter the container:
```bash
inapp bash
composer info scandipwa/store-graphql
```
At this current time latest version is 1.0.2
```bash
composer config repo.<your-name> path <your/path>
```
Or in this specific case:
```bash
composer config repo.store path localmodules/store-graphql/
cat composer.json # check that there's a store module
```
So now we need to make sure that store is installed on our local system as a higher version.

Using a text editor open `src/localmodules/store-graphql` open `composer.json` file and specify a new version, in this case `1.0.3`.

> **Note**
>
>Do not commit the `composer.json` changes.

Next, let's update:
```bash
composer update scandipwa/store-graphql
```
After this the `src/localmodules/store-graphql` will be symlinked with the vendor folders. This way any change you perform on the origin folder will be reflected in Magento.

After making changes, `exit` the container and go to the `store-graphql` directory.
```bash
cd src/localmodules/store-graphql
```
We can check out if our changes are registered by using `git status`.

After this we can use a similar sequence as previously:
```bash
git checkout -b feature-branch-1
git add src
git commit -m "Some message"
git push
git push origin feature-branch-1
```
We can use `git status` at any time to see what the state of our commit is.

After this we can go to our GitHub account and open a pull request.