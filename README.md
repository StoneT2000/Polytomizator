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
- Poly art can be auto-generated by computer. A combination of randomness and edge detection algorithms help make the poly art look better. Level of detail can also be set to change the look of the generated art
- Can auto-generate two kinds of poly art, normal, and cubic like
### Downloading and Loading Work
- Creates poly art from triangulization and can be downloaded at high resolutions
- Save created points and colors in between browsing sessions (Just don't clear cache)
- Save poly art to a .svg file for further editing or manual scaling


## Planned Features
- Other cool/interesting forms of poly art that can be generated by computer

## Some poly art made by this program
<p align="center">
  <img src ="https://github.com/StoneT2000/StoneT2000.github.io/blob/master/images/NasaShuttle.jpg" width="399" height="auto"></img>
  <img src ="https://github.com/StoneT2000/StoneT2000.github.io/blob/master/images/NasaShuttlePoly.jpg" width="399" height="auto"></img>
  <img src ="https://github.com/StoneT2000/StoneT2000.github.io/blob/master/images/MountainHimilayas.jpg" width="800" height="auto"></img>
  <img src ="https://github.com/StoneT2000/StoneT2000.github.io/blob/master/images/MountainHimilayasPoly.jpg" width="800" height="auto"></img>
  <img src ="https://github.com/StoneT2000/StoneT2000.github.io/blob/master/images/PolytomizationFlowerEffect2.gif" width="800" height="auto"></img>
</p>

## Further Technical Details

### How it works:
Vertices stored in a hash map for quick searches (make's erasing of points far faster)

Delaunay Triangulization algorithm generates triangles from vertices.
Program finds the average color of all pixels within each triangle and stores into an array for colors.
Program then runs a loop through all the triangles and displays the triangles and their corresponding colors.

#### Image Downloading
To download an enlarged image, the canvas is enlarged, the coordinates of all the triangles are scaled upwards, creating larger triangles. Then the canvas is downloaded.

The SVG file is created by creating a text file with the proper SVG formatting. The program goes through all the triangle vertices and their colors to create a svg file (primarily using the <polygon ... /> tag. Allows users to import these shapes into a program that parses SVG files.

#### Poly Art Auto Generation
Algorithms run are done on a seperate thread using web-workers, allowing for a nice loading screen to be displayed.

Edge detection algorithms created through the convolution of a 3x3 smoothing kernel and 3x3 edge detection kernel. The kernels create a photo where edges are bright, which are detected by scanning through the entire array of pixels and for those that are bright, a vertex is placed at its position, also depending on a some randomness.

Rest of the points are just filler vertices placed randomly on the canvas, but with the average spacing between neighboring filler vertices being fairly similar.

Once scanned and filtered with edges detected, it doesn't need to be run again unless a new image is put up.

## Acknowledgements
Many thanks to Vincent for helping make this better
and many others as well
