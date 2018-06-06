# Polytomizator
A small web applet that helps generate poly art using an uploaded background image.

This was made using JS and HTML. Library used was p5.js.

## Using this program
A working link to this program is provided here https://stonet2000.github.io/Polytomizator/polytomize.html

Or...

Simply download the repository's zip file, open it, and then open polytomize.html. This local method is compatible on Firefox only.


## Features
### Making Poly Art
- Upload local image files to the page to make poly art with
- Different brushes, brush sizes, and densities to play around with to add or remove points onto the canvas
- Can custom remove specific triangles if needed
- Triangulizes the points using delaunay triangulization. Algorithm used provided by https://github.com/mapbox/delaunator
- Poly art can be created instantly or with a "flowering effect" with the colors being added to the triangles starting from the center and radially expanding outwards
### Downloading and Loading Work
- Creates poly art from triangulization and can be downloaded at high resolutions
- Save created points and colors in between browsing sessions


## Planned Features
- Algorithm to have computer make the art by itself through edge detection algorithms etc.
- Exporting the canvas to a .svg file

## Some poly art made by this program
<img src ="https://github.com/StoneT2000/StoneT2000.github.io/blob/master/images/NasaShuttle.jpg" width="300" height="452.7" style="margin-left:50%;"></img>
<img src ="https://github.com/StoneT2000/StoneT2000.github.io/blob/master/images/NasaShuttlePoly.jpg" width="300" height="452.7"></img>
<img src ="https://github.com/StoneT2000/StoneT2000.github.io/blob/master/images/BlurryMountain.jpg" width="604" height="339"></img>
<img src ="https://github.com/StoneT2000/StoneT2000.github.io/blob/master/images/BlurryMountainPoly2.jpg" width="604" height="339"></img>
<img src ="https://github.com/StoneT2000/StoneT2000.github.io/blob/master/images/PolytomizationFlowerEffect.gif" width="800" height="auto"></img>
## Acknowledgements
Many thanks to ... for helping make this better
and some other people who wish to not be named
