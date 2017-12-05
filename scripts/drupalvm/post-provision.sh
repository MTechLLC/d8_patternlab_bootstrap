#!/usr/bin/env bash
set -ev

# Determine if we are running inside or outside of the vm.
if [ ! -d /var/www/drupalvm ]
then
  cd $(dirname "$0")/../..
else
  cd /var/www/drupalvm
fi

# Provide default settings for running locally.
if [ ! -f ./web/sites/default/settings.local.php ]; then
  chmod 777 ./web/sites/default
  cp ./web/sites/default/default.settings.local.php ./web/sites/default/settings.local.php
fi

# Allow writing to settings.php
chmod 777 ./web/sites/default
chmod 666 web/sites/default/settings.php

if hash /home/vagrant/.npm-global/bin/yarn 2>/dev/null; then
  YARN=/home/vagrant/.npm-global/bin/yarn
elif hash yarn 2>/dev/null; then
  YARN=$(which yarn)
fi

if $YARN; then
  cd web/themes/custom/custom_theme
  $YARN install
  $YARN run gulp
  cd -
fi

cd web
../vendor/bin/drush si config_installer -y
../vendor/bin/drush cim -y
../vendor/bin/drush updb -y
../vendor/bin/drush cr
