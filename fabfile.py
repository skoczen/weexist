from fabric.api import *

env.PROJECT_NAME = "weexist"
env.GITHUB_USER = "skoczen"
env.GITHUB_REPO = env.PROJECT_NAME
env.VIRTUALENV_NAME = env.PROJECT_NAME
env.HEROKU_APP_NAME = env.PROJECT_NAME
# If you're using https://github.com/ddollar/heroku-accounts
env.HEROKU_ACCOUNT = None


def initial_setup():
    local("echo cd `pwd` >> ~/.virtualenvs/%(VIRTUALENV_NAME)s/bin/postactivate" % env)
    local("git remote rename origin artechetype")
    local("git remote add origin git@github.com:%(GITHUB_USER)s/%(GITHUB_REPO)s.git" % env)
    if env.HEROKU_APP_NAME:
        if env.HEROKU_ACCOUNT:
            local("git remote add heroku git@heroku.%(HEROKU_ACCOUNT)s:%(HEROKU_APP_NAME)s.git" % env)
        else:
            local("git remote add heroku git@heroku.com:%(HEROKU_APP_NAME)s.git" % env)
        local("heroku create --stack cedar %(HEROKU_APP_NAME)s" % env)

    local("git push -u origin")
    local("source ~/.virtualenvs/%(VIRTUALENV_NAME)s/bin/activate; pip install -r requirements.unstable.txt" % env)
    local("source ~/.virtualenvs/%(VIRTUALENV_NAME)s/bin/activate; pip freeze requirements.unstable.txt > requirements.txt" % env)

def run_ve(cmd):
    env.cmd = cmd
    local("source ~/.virtualenvs/%(VIRTUALENV_NAME)s/bin/activate;cd project;%(cmd)s" % env)

def deploy():
    run_ve("./manage.py collectstatic --noinput --settings=envs.live")
    run_ve("./manage.py compress --force --settings=envs.live")
    run_ve("./manage.py sync_static --gzip --expires --settings=envs.live")
    deploy_code()

def deploy_code():
    run_ve("git push heroku live:master")
    run_ve("heroku run project/manage.py syncdb")
    run_ve("heroku run project/manage.py migrate")
    run_ve("heroku restart")