function dTriangle(x1,y1,x2,y2,x3,y3,colors){
  this.hash = floor(100*(x1+x2+x3)/150) + floor((y1+y2+y3)/150);
  this.display = function(){
    
    if (noColors === false){
      var cr= colors[0]
      var cg= colors[1]
      var cb = colors[2]
      fill(cr,cg,cb);
      stroke(cr,cg,cb);
    }
    
    
    triangle(x1,y1,x2,y2,x3,y3)
  }
}
/*Using this object method to draw triangles, we need to delete the ones that get replaced. Hashmap for triangles?
Could possibly find the hashCoordinate of the average coordiante of the vertices and use that as the identifier for where the progarm should search when deleting dTriangle. Or faster, just add the coordinates up and bitshift x.
*/
