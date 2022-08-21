# Create html with a basic scene for Menu maybe, with a button to start the game, and a score menu.
Import Three.js module, gltf loader, orbit controls, etc.

# Create the canva and scene objects (scene, camera, light, renderer, event listeners, 3D models)
Choosing classes and inheritance or namespace to put all the functions and variables?

# Create the shape of pieces 
Multidimensional arrays? Using sprites or 2D array, or 3D box geometries?

# Create the board (Grid?!)
Multidimensional arrays with subarrays where we can draw block indexes or insert images to those blocks? 2D grid or 3D box geometries?

# Create the gameplay logic (keyboard input, movement, collision detection, scoring, etc.)
This needs to be seen how to implement it. 

# The falling of shapes (pieces)
Need to create a function that will move the shape down every second or less. Maybe every second fall down one row. 
row++. But we need to check for overlaps between falling shapes and landed shapes. 

- check first for any collision, then if not, the shape can move down ?
- to make it possible, define the new position of the shape ?
- create a landed[] array
- loop through the grid blocks, and then check if the landed[] is occupied ?
*for tetris.shape[row].length; i++ etc*
*then if statement: if landed[row] !== 0 etc* (row blocks will have values of 0 & 1)
- if there are all 0, then it means the row is free and there will be no collision.

# The landing of shapes and collision detection
- check if our shape collides with a row block with value 1. If yes it means we have a collision, so it has landed. 
- If it has landed, add this shape to landed[] array.
- With the similar loop to check for collision, check if shape row & column isn't 0, add to landed[]. 
*if shape[row][column] !== 0, then landed[row + shape.row][column + shape.column] etc something like that ?!?

- Another check is to check if the shape is landing the ground, not only checking collision with other shapes.
- Check for collision && check if the new position of the shapes is below the very bottom of the game box.If the shape ends up below that, make the shape *landed*.

# Make the logic of moving and rotating of the shapes
- Every second the shape falls down...
- If the user presses the left key, move the shape by one column left. The same if right key.
- If the user presses R, rotate the shape

- make sure the shape will not collide with any other block that are landed. (use the loops above?)

- Re-render the screen each time the shape moves

- Check if by pressing left again & again, the shape moves too much left. With the same logic above for checking if the shape is below the game field, check if the shape is too far on the sides. Make a range maybe from -1 to 1 and check both sides where the shape will be.

- to rotate, alter the shape's shape, without altering the shape position. 
- (Using math? Saving all possible rotations of the shape in an array? and then use one of those rotation combinations?)

- Re-render everything after the shape rotates.

# Possible issues
- Some problems may arise with this. For example if the user presses R again after the shape has collided or landed. Or if the shape is out of the game field when rotated etc.

- Find a solution to check for overlaps with landed blocks.
- So, if there's a collision, or if the shape is out of the game field bounds, block the rotation of the shape!

- Another thing, might be performance issue with collision detection. Shapes will be some kind of aligned axis in a specified point.Keep one axis static (like z) another axis moving (like y), and x free on input? If we move a shape and the space it needs to move is occupied, then we have a collision. 
- Should find the simplest solution for it. Best would be O(1) complexity. Or at least O(n). 

- Rotation can be complex. Would be good to keep somehow the basic block's shape in a rotated form, so we can apply only position and quickly check for collision.

# Main checks implementation
# 1
- Check if the shape falls, call this every second or so:
*if check true, set the shape to new position
*if check false, make the shape land or collide.
# 2
- Check if the user hits arrow keys, to move the shape left or right. Call it when user hits the keys.
*if no problem with collision, bounds etc, if other checks passes, only move the shape to left or right.
# 3
- Check if the user hits R to rotate the shape. 
*if no problem with collision, bounds etc, if other checks passes, only then move the shape to left or right.

- Compare the checks with one another to make sure no bugs and problems.


