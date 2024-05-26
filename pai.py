import math
r = input('Please enter radius:')
r = float(r)
pi = math.pi
c = 2 * pi * r
s = pi * r * r
print('Circumference is {:.2f}, Round area is {:.2f}'.format(c,s))