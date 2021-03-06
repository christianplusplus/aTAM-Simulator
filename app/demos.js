var demo0 = `Seed

0.4,0.2,0
0,0,0,0,0,0
2,2,2,0,0,0
true
--
Scaffold

1,1,1
1,xy,xz,0,0,0
2,1,1,2,0,0
false
--
Scaffold

1,1,1
xy,1,yz,0,0,0
1,2,1,0,2,0
false
--
Scaffold

1,1,1
xz,yz,1,0,0,0
1,1,2,0,0,2
false
--
Scaffold

1,1,1
2,xy,xz,1,0,0
2,1,1,2,0,0
false
--
Scaffold

1,1,1
xy,2,yz,0,1,0
1,2,1,0,2,0
false
--
Scaffold

1,1,1
xz,yz,2,0,0,1
1,1,2,0,0,2
false
--
Scaffold

1,1,1
3,xy,xz,2,0,0
2,1,1,2,0,0
false
--
Scaffold

1,1,1
xy,3,yz,0,2,0
1,2,1,0,2,0
false
--
Scaffold

1,1,1
xz,yz,3,0,0,2
1,1,2,0,0,2
false
--
Scaffold

1,1,1
4,xy,xz,3,0,0
2,1,1,2,0,0
false
--
Scaffold

1,1,1
xy,4,yz,0,3,0
1,2,1,0,2,0
false
--
Scaffold

1,1,1
xz,yz,4,0,0,3
1,1,2,0,0,2
false
--
Scaffold

1,1,1
5,xy,xz,4,0,0
2,1,1,2,0,0
false
--
Scaffold

1,1,1
xy,5,yz,0,4,0
1,2,1,0,2,0
false
--
Scaffold

1,1,1
xz,yz,5,0,0,4
1,1,2,0,0,2
false
--
Scaffold

1,1,1
6,xy,xz,5,0,0
2,1,1,2,0,0
false
--
Scaffold

1,1,1
xy,6,yz,0,5,0
1,2,1,0,2,0
false
--
Scaffold

1,1,1
xz,yz,6,0,0,5
1,1,2,0,0,2
false
--
Scaffold

1,1,1
7,xy,xz,6,0,0
2,1,1,2,0,0
false
--
Scaffold

1,1,1
xy,7,yz,0,6,0
1,2,1,0,2,0
false
--
Scaffold

1,1,1
xz,yz,7,0,0,6
1,1,2,0,0,2
false
--
Scaffold

1,1,1
8,xy,xz,7,0,0
2,1,1,2,0,0
false
--
Scaffold

1,1,1
xy,8,yz,0,7,0
1,2,1,0,2,0
false
--
Scaffold

1,1,1
xz,yz,8,0,0,7
1,1,2,0,0,2
false
--
Scaffold

1,1,1
9,xy,xz,8,0,0
2,1,1,2,0,0
false
--
Scaffold

1,1,1
xy,9,yz,0,8,0
1,2,1,0,2,0
false
--
Scaffold

1,1,1
xz,yz,9,0,0,8
1,1,2,0,0,2
false
--
Filler

0.6,1,0.8
xy,xy,10,xy,xy,0
1,1,1,1,1,0
false
--
Filler

0.6,1,0.8
xz,10,xz,xz,0,xz
1,1,1,1,0,1
false
--
Filler

0.6,1,0.8
10,yz,yz,0,yz,yz
1,1,1,0,1,1
false
--
Filler3D

0,0.4,0.8
10,10,10,10,10,10
1,1,1,1,1,1
false`;
var demo1 = `SEED
SEED
1,0.8,0.6
SE,SU,SS,SW,SD,SN
2,2,2,2,2,2
true
--
NORTH
NORTH
1,0.8,0.6
H,Z,SN,H,Z,SN
1,1,2,1,1,2
false
--
SOUTH
SOUTH
1,0.8,0.6
H,Z,SS,H,Z,SS
1,1,2,1,1,2
false
--
EAST
EAST
1,0.8,0.6
SE,,V,SE,,V
2,0,1,2,0,1
false
--
WEST
WEST
1,0.8,0.6
SW,,V,SW,,V
2,0,1,2,0,1
false
--
UP
UP
1,0.8,0.6
H,SU,V,H,SU,V
1,2,1,1,2,1
false
--
DOWN
DOWN
1,0.8,0.6
H,SD,V,H,SD,V
1,2,1,1,2,1
false
--
INT
INT
1,0.8,0.6
H,Z,V,H,Z,V
1,1,1,1,1,1
false`;
var demo2 = `SEED
M0*L
1,0.8,0.6
-99,,-99,-99,,M0*L
0,0,0,0,0,2
true
--
M1*L|-99|M0*L|-99
M1*L
1,0.8,0.6
-99,,M0*L,-99,,M1*L
0,0,2,0,0,2
false
--
0*L|-99|M1*L|M
0*L
1,0.8,0.6
-99,,M1*L,M,,0*L
0,0,2,2,0,2
false
--
M1|M|-99|M
M1
1,0.8,0.6
M,,-99,M,,M1
2,0,0,0,0,1
false
--
1L|-99|0*L|c*
1L
1,0.8,0.6
-99,,0*L,c*,,1L
0,0,2,1,0,1
false
--
M1*|c*|M1|-99
M1*
1,0.8,0.6
c*,,M1,-99,,M1*
1,0,1,0,0,2
false
--
M1|*|M0*|-99
M1
1,0.8,0.6
*,,M0*,-99,,M1
1,0,2,0,0,1
false
--
0|*|M1*|M
0
1,0.8,0.6
*,,M1*,M,,0
1,0,2,2,0,1
false
--
0*L|-99|0L|*
0*L
1,0.8,0.6
-99,,0L,*,,0*L
0,0,1,1,0,2
false
--
0*L|-99|1L|*
0*L
1,0.8,0.6
-99,,1L,*,,0*L
0,0,1,1,0,2
false
--
0*|c*|0|c
0*
1,0.8,0.6
c*,,0,c,,0*
1,0,1,1,0,2
false
--
0|c|0|c
0
1,0.8,0.6
c,,0,c,,0
1,0,1,1,0,1
false
--
M0|c|M0|-99
M0
1,0.8,0.6
c,,M0,-99,,M0
1,0,1,0,0,1
false
--
1|c|1|c
1
1,0.8,0.6
c,,1,c,,1
1,0,1,1,0,1
false
--
M1|c|M1|-99
M1
1,0.8,0.6
c,,M1,-99,,M1
1,0,1,0,0,1
false
--
0|*|0|*
0
1,0.8,0.6
*,,0,*,,0
1,0,1,1,0,1
false
--
0|*|1|*
0
1,0.8,0.6
*,,1,*,,0
1,0,1,1,0,1
false
--
1|*|0*|c
1
1,0.8,0.6
*,,0*,c,,1
1,0,2,1,0,1
false
--
1|c*|1|c*
1
1,0.8,0.6
c*,,1,c*,,1
1,0,1,1,0,1
false`;
var demo3 = `SEED
SEED
1,0.8,0.6
SE,,SS,SW,,SN
2,0,2,2,0,2
true
--
UP
UP
1,0.8,0.6
H,,SN,H,,SN
1,0,2,1,0,2
false
--
DN
DN
1,0.8,0.6
H,,SS,H,,SS
1,0,2,1,0,2
false
--
RT
RT
1,0.8,0.6
SE,,V,SE,,V
2,0,1,2,0,1
false
--
LT
LT
1,0.8,0.6
SW,,V,SW,,V
2,0,1,2,0,1
false
--
INT
INT
1,0.8,0.6
H,,V,H,,V
1,0,1,1,0,1
false`;
var demos = {
    'cube': demo0,
    'grow2d': demo3,
    'grow3d': demo1,
    'counter': demo2
};