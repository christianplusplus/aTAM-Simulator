### aTAM-Simulator

What is aTAM?
----------------------------------------------------------------------------------------------------------------------------------------
The abstract Tile Assembly Model is mathematical model that relates to the processes of self-assembly; so things like chemical reactions,
molecular constructions, and, most apply, DNA tiling.  Given a tile set, seed assembly, and temperature, the model builds an assembly
based on the glue attributes belonging to each tile in the tile set.

You can learn more about aTAM by following the link:
http://self-assembly.net/wiki/index.php?title=Abstract_Tile_Assembly_Model_(aTAM)


Simulation Controls
----------------------------------------------------------------------------------------------------------------------------------------
All you need to do to simulate an assembly is to hit the PLAY button. This applies one tile at a time, defaulting to one tile per frame.
The SPEED of the simulation can be controlled by the fast forward bar.

You can also PAUSE and RESET the simulation.

The STEP button applies exactly one tile to the simulation.

The END button runs the entire simulation until either no more tiles can be added or a pre-set limit is reached, only rendering the
simulation once it's finished.

----------------------------------------------------------------------------------------------------------------------------------------


Assembly Rendering Controls
----------------------------------------------------------------------------------------------------------------------------------------
You can change how the tile MODELS are rendered. The basic default models need only render 6 triangles and 9 lines per frame, per model. 
The more detailed models show the individual glues at work and require rendering 36 triangles and 9 lines per frame.

The diamond shaped CURSOR shows where the camera is targeting and can be toggled.

It's possible to lose the assembly in infinite 3D space, so there's a button the brings you back to the ORIGIN, which is where the seed
tile would be simulated.

With a mouse, you can control the ANGLE and ZOOM of the camera.

Using the W,A,S,D,C, and V keys, you can control the POSITION of the camera's target.

You can also toggle how you want the screen to be SPLIT between the assembly and the tile set; either a 50/50 split or all of just one.

----------------------------------------------------------------------------------------------------------------------------------------


Tile Set Controls
----------------------------------------------------------------------------------------------------------------------------------------
Using the directional arrows on a keyboard is how you select tiles.  The brightest tile is the one currently being selected.
You can then OPEN a tile, which allows you modify any of its attributes. You must CLOSE the tile to save any changes.  If you want to
leave the tile without saving any changes, then use the DISCARD button. You can also CREATE new tiles and DESTROY selected tiles with
their respective buttons.

You also can control how the tile set is STACKED vertically, as well as being able to ROTATE or ZOOM in on the tiles with the mouse.

----------------------------------------------------------------------------------------------------------------------------------------


Simulation Parameters
----------------------------------------------------------------------------------------------------------------------------------------
Because the memory and performance of computers is finite, the assembly has a default simulation LIMIT of 10,000 tiles. This can be
modified by the user.

Tile sets are usually created for a specific TEMPERATURE, so this variable can be changed by the user.

----------------------------------------------------------------------------------------------------------------------------------------


Tile Set Files
----------------------------------------------------------------------------------------------------------------------------------------
Users can UPLOAD and DOWNLOAD tile set files, which makes sharing them easy.

This simulator is compatible with the ISU TAS file system. When you want these types of files, in the file request box, simply
list ".tds" and ".tdp". "tds" is tile set itself. The simulators are not fully compatible. As such, the TILECOLOR, TEXTCOLOR, and
CONCENTRATION attributes will always be left blank. If you upload a tile set with LABELS, the labels will be remembered for when you
want to download a modified version of tile set but cannot be changed in the simulator. "tdp" is for seed assemblies. This simulator
does not utilize a seed assembly but rather just marks a single tile as the seed tile. Downloading a "tdp" file simply creates 
a seed assembly with only the designated seed tile in it.  Uploading from the TAS file system requires that you only choose a "tds"
file. You are then prompted to indicate which tile is the seed tile. You can actually indicate the seed tile after the tile set is
loaded first, but the simulation won't run until you do this. You can visit the ISU TAS wiki page if you want to learn more about it:
http://self-assembly.net/wiki/index.php?title=ISU_TAS

This simulator also has its own file format: ".sts".  "sts" stands for simulator tile set and is text based. Each tile in an "sts" file
is delimited by a double-dash (--) on its own line.  Each tile then has at least six lines for its attributes. You cannot have empty
lines between the double-dash and the first attribute, but you can have empty lines after the attributes. This is an example tile:

Scaffold
S
1,1,1
1,xy,xz,0,0,0
2,1,1,2,0,0
false

The first line is the tile name, which is not required to be unique.
The second line is the label. This is only for ISU TAS and does not have a special purpose in this simulator.
Next is the tile color, which is formatted as a RGB color ratio. i.e. 1,1,1 is white and 0,0,0 is black.
Next is the glue labels, which is a comma separated list with six strings. Null strings are valid input.
Next is the glue strings. This is comprised of six comma separated unsigned integer values. 0 indicates that the glue is unused.
Last is the seed Boolean. There can only be one seed.  If multiple seeds are indicated, then only the last one is set to be the seed.

----------------------------------------------------------------------------------------------------------------------------------------
