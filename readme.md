#Webjinx

###Build
Currently fairly simple build process:
`grunt dev` - for building DEV environment
`grunt dist` - for building DIST environment

Grunt DEV has watcher for JS, SCSS and HTML files in /src/

I am using RequireJS to build JavaScript

Note: to add support for Susy highlighting in PhpStorm use 
Preference -> Languages and Frameworks

I choose php and added paths to 
`node_modules/susy/sass`
`node_modules/susy/sass/susy`

Also added in main scss file paths
`@import '../../node_modules/susy/sass/susy';`
`@import '../../node_modules/susy/sass/su';`

Otherwise it says "found only by name"