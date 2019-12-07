from PIL import Image
import numpy as np

height = 80
width = 80
rgba = 3
image_array = np.zeros((height,width,rgba));
#print(image_array[1][1])
#rgba(21,58,88, 0.5);
for y in range(height):
    for x in range(width):
        alpha = np.uint8(np.sqrt(1-x/(width-1))*255)
        image_array[y][x] = np.array([21,58,88])
#print(image_array)
image = Image.fromarray(image_array.astype('uint8'), "RGB")
#print(list(image.getdata()))
image.save("block.png")
#
