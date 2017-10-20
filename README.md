# Mod resource sharing UI module for stripes

The UI module for the resource sharing functionality for the folio project.

To install you'll need yarn installed globally. Then execute:
```
yarn 
```
Which should install the dependencies for this project.

To run you will need to ensure that OKAPI is up and running.

Then from the root of this project execute:

```
webpack --watch
```
This command will cause webpack to build our local library that can then be used as a stripes module.

In another window you can then start the stripes application, also from the root of this project:

```
yarn start
```
 