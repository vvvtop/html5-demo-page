import Image,ImageFont,ImageDraw,math,random
TEXT='A llyes'
SQRT2=math.sqrt(2)
BASE=(300,-200)
HEIGHT=15


def getMatrix(text):
	font=ImageFont.truetype('/home/vvtommy/temp/arial.ttf',9)
	im,r,matrix=font.getmask(text),font.getsize(text),[]
	reverse=range(0,r[0])
	reverse.reverse()
	count=1
	for j in reverse:
		for i in range(0,r[1]):
			tmp=im.getpixel((j,i))
			if tmp!=0:
				matrix.append((i*13,j*16,count))
				count+=1
			#end if
		#end for
	#end for
	return matrix
#end getMatrix	
def perspective(matrix,angel):
	radians=angel*math.pi/180.0
	tan=math.tan(radians)
	return [(x[0],x[1]+x[0]*(math.tan(radians)),x[2]) for x in matrix]
#end perspective
def rotete(matrix,angel):
	radians=angel*math.pi/180.0
	sin=math.sin(radians)
	cos=math.cos(radians)
	return [(math.ceil(x[0]*sin-x[1]*cos),math.ceil(x[0]*cos+x[1]*sin),x[2]) for x in matrix]
#end rotete
def createShadow(matrix,level=4):
	ret,total=[],len(matrix)
	matrix=[(x[0],x[1],x[2]+total*level,x[2],False) for x in matrix]
	for i in range(0,level):
		for x in matrix:
			ret.append((x[0]+(i+1)*HEIGHT,x[1],x[2]-total*(i+1),x[2],True))
		#end for
	#end for
	return matrix+ret
#end createShadow 

def main():
	matrix= getMatrix(TEXT)
	res= matrix
	res= perspective(matrix,33)
	res= rotete(res,63)
	res= createShadow(res)
	
	#print res
	app=[]
	count=1
	for i in [(x[0]+BASE[0],x[1]+BASE[1],x[2],x[3],x[4]) for x in res]:
		app.append('%s.%d.%d.%d.%d'%(('B','Y')[i[4]==False],count,i[0],i[1],i[2]))
		count+=1
	print '|'.join(app)
#end main	
if __name__=='__main__':
	main()
	

