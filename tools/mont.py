import sys
from PIL import Image, ImageDraw
fs=sys.argv[2:]; out=sys.argv[1]
ims=[Image.open(f) for f in fs]; w=360; h=640
cols=min(4,len(ims)); rows=(len(ims)+cols-1)//cols
M=Image.new('RGB',(cols*w,rows*(h+30)),'white'); d=ImageDraw.Draw(M)
for i,(f,im) in enumerate(zip(fs,ims)):
    x=(i%cols)*w; y=(i//cols)*(h+30); M.paste(im.resize((w,h)),(x,y+30)); d.text((x+5,y+8),f.split('/')[-1],fill='black')
M.save(out,quality=85)
