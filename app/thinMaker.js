var id;
var ts;
var origin = [0, 0, 0];
var seedColor = [0,.5,0];
var writeColor = [.5,0,0];
var readColor = [0,.5,.5];
var fillColor = [0,0,.5];

function makeThin(N, k)
{
    id = 0;
    ts = new TileSet();
    
    var d = Math.floor(k/3);
    var m = Math.ceil(Math.pow(N/5,1/d));
    var l = Math.ceil(Math.log(m)/Math.log(2))+1;
    var s = Math.pow(m,d)-Math.floor((N-3*l-1)/(3*l+2));
    var c = k%3;
    var r = (N+1)%(3*l+2)
    
    switch(c)
    {
        case 0:
            seedStart0('<seed,col,'+d+',1>');
            break;
        case 1:
            seedStart1('<seed,col,'+d+',1>');
            break;
        case 2:
            seedStart2('<seed,col,'+d+',1>');
            break;
    }
    
    for(var i = 1; i <= d; i++)
    {
        for(var j = 1; j <= 3*l-3; j++)
        {
            upColumn('<seed,col,'+i+','+j+'>','<seed,col,'+i+','+(j+1)+'>');
        }
        if(ithFromRight(ithFromRight(s,i,m),l-1,2))
            seedMsb1('<seed,col,'+i+','+(3*l-2)+'>','<seed,bit,'+i+','+(l-1)+'>');
        else
            seedMsb0('<seed,col,'+i+','+(3*l-2)+'>','<seed,bit,'+i+','+(l-1)+'>');
        for(var j = 2; j <= l - 1; j++)
        {
            if(ithFromRight(ithFromRight(s,i,m),j-1,2))
                seedBit1('<seed,bit,'+i+','+j+'>','<seed,bit,'+i+','+(j-1)+'>');
            else
                seedBit0('<seed,bit,'+i+','+j+'>','<seed,bit,'+i+','+(j-1)+'>');
        }
    }
    
    seedBit1('<seed,bit,'+d+','+1+'>','<seed,bit,'+d+','+0+'>');
    
    for(var i = 1; i <= d - 1; i++)
    {
        seedBit0('<seed,bit,'+i+','+1+'>','<seed,bit,'+i+','+0+'>');
        seedSpacer('<seed,bit,'+(i+1)+','+0+'>','<seed,col,'+i+','+1+'>');
    }
    
    seedEnd('<seed,bit,1,0>','<inc,read,1>','<inc,read,0>');
    
    for(var i = 0; i <= l - 2; i++)
    {
        for(var j = 0; j < Math.pow(2, i); j++)
        {
            var u = bin(j, i);
            
            counterRead0('<inc,read,0'+u+'>','<inc,read,10'+u+'>','<inc,read,00'+u+'>');
            counterRead1('<inc,read,1'+u+'>','<inc,read,11'+u+'>','<inc,read,01'+u+'>');
            counterRead0('<copy,read,0'+u+'>','<copy,read,10'+u+'>','<copy,read,00'+u+'>');
            counterRead1('<copy,read,1'+u+'>','<copy,read,11'+u+'>','<copy,read,01'+u+'>');
        }
    }
    
    for(var i = 0; i <= 2*m - 1; i++)
    {
        if(ithFromRight(i,l,2))
            counterReadMsb1('<copy,read,'+bin(i,l)+'>','<copy,write,'+bin(i,l)+'>','<d_fill>');
        else
            counterReadMsb0('<copy,read,'+bin(i,l)+'>','<copy,write,'+bin(i,l)+'>','<d_fill>');
    }
    
    for(var i = 0; i <= 2*m - 3; i++)
    {
        if(ithFromRight(i,l,2))
            counterReadMsb1('<inc,read,'+bin(i,l)+'>','<copy,write,'+bin(i+2,l)+'>','<d_fill>');
        else
            counterReadMsb0('<inc,read,'+bin(i,l)+'>','<copy,write,'+bin(i+2,l)+'>','<d_fill>');
    }
    
    counterReadMsb1('<inc,read,'+bin(2*m-2,l)+'>','<inc,write_all_0s,1>','<d_fill>');
    
    for(var i = 1; i <= l - 1; i++)
    {
        counterWrite0('<inc,write_all_0s,'+i+'>','<inc,write_all_0s,'+(i+1)+'>');
    }
    
    for(var i = 0; i < Math.pow(2, l-1); i++)
    {
        var u = bin(i, l-1);
        counterWrite0('<copy,write,'+u+'0>','<copy,write,'+u+'>');
        counterWrite1('<copy,write,'+u+'1>','<msd,write,'+u+'>');
    }
    
    for(var i = 1; i <= l-2; i++)
    {
        for(var j = 0; j < Math.pow(2, i); j++)
        {
            var u = bin(j, i);
            
            counterWrite0('<copy,write,'+u+'0>','<copy,write,'+u+'>');
            counterWrite1('<copy,write,'+u+'1>','<copy,write,'+u+'>');
            counterWrite0('<msd,write,'+u+'0>','<msd,write,'+u+'>');
            counterWrite1('<msd,write,'+u+'1>','<msd,write,'+u+'>');
        }
    }
    
    counterWriteMsb0('<inc,write_all_0s,'+l+'>','<inc,down_z_0,1>');
    counterWriteMsb0('<copy,write,0>','<copy,down_z_0,1>');
    counterWriteMsb1('<copy,write,1>','<copy,down_z_0,1>');
    counterWriteMsb0('<msd,write,0>','<msd,down_z_0,1>');
    counterWriteMsb1('<msd,write,1>','<msd,down_z_0,1>');
    
    for(var i = 1; i <= 3*l-2; i++)
    {
        downColumn('<inc,down_z_0,'+i+'>','<inc,down_z_0,'+(i+1)+'>');
        downColumn('<copy,down_z_0,'+i+'>','<copy,down_z_0,'+(i+1)+'>');
    }
    for(var i = 1; i <= 3*l-3; i++)
        downColumn('<msd,down_z_0,'+i+'>','<msd,down_z_0,'+(i+1)+'>');
    
    counterReturnColumnStart('<inc,down_z_0,'+(3*l-1)+'>','<inc,down_z_1,'+1+'>');
    counterReturnColumnStart('<copy,down_z_0,'+(3*l-1)+'>','<copy,down_z_1,'+1+'>');
    
    for(var i = 0; i <= l - 1; i++)
    {
        counterReturnColumn('<inc,down_z_1,'+i+'>','<inc,down_z_1,'+(i+1)+'>');
        counterReturnColumn('<copy,down_z_1,'+i+'>','<copy,down_z_1,'+(i+1)+'>');
    }
    
    counterReturnColumnEnd('<inc,down_z_1,'+l+'>','<inc,read,1>','<inc,read,0>');
    counterReturnColumnEnd('<copy,down_z_1,'+l+'>','<copy,read,1>','<copy,read,0>');
    
    if(d == 1)
    {
        returnRowSingle('<msd,down_z_0,'+(3*l-2)+'>','<inc,read,1>','<inc,read,0>','<d_fill>');
    }
    else
    {
        returnRowStart('<msd,down_z_0,'+(3*l-2)+'>','<return,1>','<d_fill>');
        for(var i = 1; i <= d-2; i++)
            returnRow('<return,'+i+'>','<return,'+(i+1)+'>');
        returnRowEnd('<return,'+(d-1)+'>','<inc,read,1>','<inc,read,0>');
    }
    
    upColumn('<inc,read,'+bin(2*m-1,l)+'>','<roof,col,2>');
    upColumn('<roof,col,2>','<roof,col,3>');
    upColumn('<roof,col,'+(l+3)+'>','<roof,col,'+(l+4)+'>');
    upColumn('<roof,col,'+(l+4)+'>','<roof,col,'+(l+5)+'>');
    
    for(var i = 3; i <= l+2; i++)
        roofChimney('<roof,col,'+i+'>','<roof,col,'+(i+1)+'>','<roof,filler,1>');
    
    for(var i = 1; i <= d-1; i++)
        roofFiller('<roof,filler,'+i+'>','<roof,filler,'+(i+1)+'>');
    
    roofCap('<roof,col,'+(l+5)+'>','<roof,r_shingle,1>','<roof,l_shingle,1>');
    
    for(var i = 1; i <= c+2;i++)
        roofLeftShingle('<roof,l_shingle,'+i+'>','<roof,l_shingle,'+(i+1)+'>','<d_fill>');
    for(var i = 1; i <= 3*d-3;i++)
        roofRightShingle('<roof,r_shingle,'+i+'>','<roof,r_shingle,'+(i+1)+'>','<d_fill>');
        
    downColumn('<d_fill>','<d_fill>');
    
    return ts;
}

function ithFromRight(s, i, m)
{
    s = s.toString(m);
    var index = s.length - i;
    return index < 0 ? 0 : Number(s[index]);
}

function bin(n, l)
{
    n = n.toString(2);
    if(n.length > l)
        return n.substring(n.length - l);
    return n.padStart(l, '0');
}

function upColumn(inGlue, outGlue)
{
    ts.add(new Tile('upColumn', fillColor, origin, ['','',inGlue,'','',outGlue], [0,0,1,0,0,1], false));
}

function downColumn(inGlue, outGlue)
{
    ts.add(new Tile('downColumn', fillColor, origin, ['','',outGlue,'','',inGlue], [0,0,1,0,0,1], false));
}

function seedStart0(outGlue)
{
    ts.add(new Tile('seedStart0', seedColor, origin, ['','','','','',outGlue], [0,0,0,0,0,1], true));
}

function seedStart1(outGlue)
{
    ts.add(new Tile('seedStart1', seedColor, origin, [id,'','','','',''], [1,0,0,0,0,0], true));
    ts.add(new Tile('seedStart1', seedColor, origin, ['','','',id++,'',outGlue], [0,0,0,1,0,1], false));
}

function seedStart2(outGlue)
{
    ts.add(new Tile('seedStart2', seedColor, origin, [id,'','','','',''], [1,0,0,0,0,0], true));
    ts.add(new Tile('seedStart2', seedColor, origin, [id+1,'','',id,'',''], [1,0,0,1,0,0], false));id++;
    ts.add(new Tile('seedStart2', seedColor, origin, ['','','',id++,'',outGlue], [0,0,0,1,0,1], false));
}

function seedMsb0(inGlue, outGlue)
{
    ts.add(new Tile('seedMsb0', seedColor, origin, ['','',inGlue,'','',id], [0,0,1,0,0,1], false));
    ts.add(new Tile('seedMsb0', seedColor, origin, ['','',id,'','',id+1], [0,0,1,0,0,1], false));id++;
    ts.add(new Tile('seedMsb0', seedColor, origin, [id+1,'',id,'','',''], [1,0,1,0,0,0], false));id++;
    ts.add(new Tile('seedMsb0', seedColor, origin, [id+1,'','',id,'',''], [1,0,0,1,0,0], false));id++;
    ts.add(new Tile('seedMsb0', seedColor, origin, ['','',id+1,id,'',''], [0,0,1,1,0,0], false));id++;
    ts.add(new Tile('seedMsb0', seedColor, origin, ['','','',id+1,'',id], [0,0,0,1,0,1], false));id++;
    ts.add(new Tile('seedMsb0', seedColor, origin, [id,'',id+1,'','',''], [1,0,1,0,0,0], false));id++;
    ts.add(new Tile('seedMsb0', seedColor, origin, ['','',outGlue,'','',id++], [0,0,1,0,0,1], false));
}

function seedMsb1(inGlue, outGlue)
{
    ts.add(new Tile('seedMsb1', seedColor, origin, ['','',inGlue,'','',id], [0,0,1,0,0,1], false));
    ts.add(new Tile('seedMsb1', seedColor, origin, ['','',id,'','',id+1], [0,0,1,0,0,1], false));id++;
    ts.add(new Tile('seedMsb1', seedColor, origin, [id+1,'',id,'','',''], [1,0,1,0,0,0], false));id++;
    ts.add(new Tile('seedMsb1', seedColor, origin, ['',id+1,'',id,'',''], [0,1,0,1,0,0], false));id++;
    ts.add(new Tile('seedMsb1', seedColor, origin, [id+1,'','','',id,''], [1,0,0,0,1,0], false));id++;
    ts.add(new Tile('seedMsb1', seedColor, origin, ['','',id+1,id,'',''], [0,0,1,1,0,0], false));id++;
    ts.add(new Tile('seedMsb1', seedColor, origin, ['','','',id+1,'',id], [0,0,0,1,0,1], false));id++;
    ts.add(new Tile('seedMsb1', seedColor, origin, [id,'','','',id+1,''], [1,0,0,0,1,0], false));id++;
    ts.add(new Tile('seedMsb1', seedColor, origin, ['',id,id+1,'','',''], [0,1,1,0,0,0], false));id++;
    ts.add(new Tile('seedMsb1', seedColor, origin, ['','',outGlue,'','',id++], [0,0,1,0,0,1], false));
}

function seedSpacer(inGlue, outGlue)
{
    ts.add(new Tile('seedSpacer', seedColor, origin, [id,'','','','',inGlue], [1,0,0,0,0,1], false));
    ts.add(new Tile('seedSpacer', seedColor, origin, [id+1,'','',id,'',''], [1,0,0,1,0,0], false));id++;
    ts.add(new Tile('seedSpacer', seedColor, origin, ['','','',id++,'',outGlue], [0,0,0,1,0,1], false));
}

function seedBit0(inGlue, outGlue)
{
    ts.add(new Tile('seedBit0', seedColor, origin, [id,'','','','',inGlue], [1,0,0,0,0,1], false));
    ts.add(new Tile('seedBit0', seedColor, origin, ['','',id+1,id,'',''], [0,0,1,1,0,0], false));id++;
    ts.add(new Tile('seedBit0', seedColor, origin, ['','','',id+1,'',id], [0,0,0,1,0,1], false));id++;
    ts.add(new Tile('seedBit0', seedColor, origin, [id,'',id+1,'','',''], [1,0,1,0,0,0], false));id++;
    ts.add(new Tile('seedBit0', seedColor, origin, ['','',outGlue,'','',id++], [0,0,1,0,0,1], false));
}

function seedBit1(inGlue, outGlue)
{
    ts.add(new Tile('seedBit1', seedColor, origin, ['',id,'','','',inGlue], [0,1,0,0,0,1], false));
    ts.add(new Tile('seedBit1', seedColor, origin, [id+1,'','','',id,''], [1,0,0,0,1,0], false));id++;
    ts.add(new Tile('seedBit1', seedColor, origin, ['','',id+1,id,'',''], [0,0,1,1,0,0], false));id++;
    ts.add(new Tile('seedBit1', seedColor, origin, ['','','',id+1,'',id], [0,0,0,1,0,1], false));id++;
    ts.add(new Tile('seedBit1', seedColor, origin, [id,'','','',id+1,''], [1,0,0,0,1,0], false));id++;
    ts.add(new Tile('seedBit1', seedColor, origin, ['',id,id+1,'','',''], [0,1,1,0,0,0], false));id++;
    ts.add(new Tile('seedBit1', seedColor, origin, ['','',outGlue,'','',id++], [0,0,1,0,0,1], false));
}

function seedEnd(inGlue, outGlue1, outGlue2)
{
    ts.add(new Tile('seedEnd', seedColor, origin, [id,'','','','',inGlue], [1,0,0,0,0,1], false));
    ts.add(new Tile('seedEnd', seedColor, origin, ['','','',id,'',id+1], [0,0,0,1,0,1], false));id++;
    ts.add(new Tile('seedEnd', seedColor, origin, ['',id+1,id,'','',outGlue1], [0,1,1,0,0,1], false));id++;
    ts.add(new Tile('seedEnd', seedColor, origin, ['','','','',id++,outGlue2], [0,0,0,0,1,1], false));
}

function counterRead0(inGlue, outGlue1, outGlue2)
{
    ts.add(new Tile('counterRead0', readColor, origin, ['','',inGlue,'','',id], [0,0,1,0,0,1], false));
    ts.add(new Tile('counterRead0', readColor, origin, ['','',id,'','',id+1], [0,0,1,0,0,1], false));id++;
    ts.add(new Tile('counterRead0', readColor, origin, ['','',id,'',id+1,outGlue2], [0,0,1,0,1,1], false));id++;
    ts.add(new Tile('counterRead0', readColor, origin, ['',id++,'','','',outGlue1], [0,1,0,0,0,1], false));
}

function counterRead1(inGlue, outGlue1, outGlue2)
{
    ts.add(new Tile('counterRead1', readColor, origin, ['','',inGlue,'','',id], [0,0,1,0,0,1], false));
    ts.add(new Tile('counterRead1', readColor, origin, ['','',id,'','',id+1], [0,0,1,0,0,1], false));id++;
    ts.add(new Tile('counterRead1', readColor, origin, ['',id+1,id,'','',outGlue1], [0,1,1,0,0,1], false));id++;
    ts.add(new Tile('counterRead1', readColor, origin, ['','','','',id,outGlue2], [0,0,0,0,1,1], false));
}

function counterReadMsb0(inGlue, outGlue, fill)
{
    ts.add(new Tile('counterReadMsb0', readColor, origin, ['','',inGlue,'','',id], [0,0,1,0,0,1], false));
    ts.add(new Tile('counterReadMsb0', readColor, origin, ['','',id,'','',id+1], [0,0,1,0,0,1], false));id++;
    ts.add(new Tile('counterReadMsb0', readColor, origin, ['','',id,'',id+1,''], [0,0,1,0,1,0], false));id++;
    ts.add(new Tile('counterReadMsb0', readColor, origin, ['',id,'','','',id+1], [0,1,0,0,0,1], false));id++;
    ts.add(new Tile('counterReadMsb0', readColor, origin, ['','',id,id+1,'',''], [0,0,1,1,0,0], false));id++;
    ts.add(new Tile('counterReadMsb0', readColor, origin, [id++,'',fill,'','',outGlue], [1,0,1,0,0,1], false));
}

function counterReadMsb1(inGlue, outGlue, fill)
{
    ts.add(new Tile('counterReadMsb1', readColor, origin, ['','',inGlue,'','',id], [0,0,1,0,0,1], false));
    ts.add(new Tile('counterReadMsb1', readColor, origin, ['','',id,'','',id+1], [0,0,1,0,0,1], false));id++;
    ts.add(new Tile('counterReadMsb1', readColor, origin, ['','',id,'','',id+1], [0,0,1,0,0,1], false));id++;
    ts.add(new Tile('counterReadMsb1', readColor, origin, ['','',id,id+1,'',''], [0,0,1,1,0,0], false));id++;
    ts.add(new Tile('counterReadMsb1', readColor, origin, [id++,'',fill,'','',outGlue], [1,0,1,0,0,1], false));
}

function counterWrite0(inGlue, outGlue)
{
    ts.add(new Tile('counterWrite0', writeColor, origin, ['','',inGlue,'','',id], [0,0,1,0,0,1], false));
    ts.add(new Tile('counterWrite0', writeColor, origin, [id+1,'',id,'','',''], [1,0,1,0,0,0], false));id++;
    ts.add(new Tile('counterWrite0', writeColor, origin, ['','','',id,'',id+1], [0,0,0,1,0,1], false));id++;
    ts.add(new Tile('counterWrite0', writeColor, origin, ['','',id,id+1,'',''], [0,0,1,1,0,0], false));id++;
    ts.add(new Tile('counterWrite0', writeColor, origin, [id++,'','','','',outGlue], [1,0,0,0,0,1], false));
}

function counterWrite1(inGlue, outGlue)
{
    ts.add(new Tile('counterWrite1', writeColor, origin, ['','',inGlue,'','',id], [0,0,1,0,0,1], false));
    ts.add(new Tile('counterWrite1', writeColor, origin, ['',id+1,id,'','',''], [0,1,1,0,0,0], false));id++;
    ts.add(new Tile('counterWrite1', writeColor, origin, [id+1,'','','',id,''], [1,0,0,0,1,0], false));id++;
    ts.add(new Tile('counterWrite1', writeColor, origin, ['','','',id,'',id+1], [0,0,0,1,0,1], false));id++;
    ts.add(new Tile('counterWrite1', writeColor, origin, ['','',id,id+1,'',''], [0,0,1,1,0,0], false));id++;
    ts.add(new Tile('counterWrite1', writeColor, origin, [id,'','','',id+1,''], [1,0,0,0,1,0], false));id++;
    ts.add(new Tile('counterWrite1', writeColor, origin, ['',id++,'','','',outGlue], [0,1,0,0,0,1], false));
}

function counterWriteMsb0(inGlue, outGlue)
{
    ts.add(new Tile('counterWriteMsb0', writeColor, origin, ['','',inGlue,'','',id], [0,0,1,0,0,1], false));
    ts.add(new Tile('counterWriteMsb0', writeColor, origin, [id+1,'',id,'','',''], [1,0,1,0,0,0], false));id++;
    ts.add(new Tile('counterWriteMsb0', writeColor, origin, ['','','',id,'',id+1], [0,0,0,1,0,1], false));id++;
    ts.add(new Tile('counterWriteMsb0', writeColor, origin, ['','',id,id+1,'',''], [0,0,1,1,0,0], false));id++;
    ts.add(new Tile('counterWriteMsb0', writeColor, origin, [id,'','',id+1,'',''], [1,0,0,1,0,0], false));id++;
    ts.add(new Tile('counterWriteMsb0', writeColor, origin, [id,'',id+1,'','',''], [1,0,1,0,0,0], false));id++;
    ts.add(new Tile('counterWriteMsb0', writeColor, origin, ['','',id+1,'','',id], [0,0,1,0,0,1], false));id++;
    ts.add(new Tile('counterWriteMsb0', writeColor, origin, ['','',outGlue,'','',id++], [0,0,1,0,0,1], false));
}

function counterWriteMsb1(inGlue, outGlue)
{
    ts.add(new Tile('counterWriteMsb1', writeColor, origin, ['','',inGlue,'','',id], [0,0,1,0,0,1], false));
    ts.add(new Tile('counterWriteMsb1', writeColor, origin, ['',id+1,id,'','',''], [0,1,1,0,0,0], false));id++;
    ts.add(new Tile('counterWriteMsb1', writeColor, origin, [id+1,'','','',id,''], [1,0,0,0,1,0], false));id++;
    ts.add(new Tile('counterWriteMsb1', writeColor, origin, ['','','',id,'',id+1], [0,0,0,1,0,1], false));id++;
    ts.add(new Tile('counterWriteMsb1', writeColor, origin, ['','',id,id+1,'',''], [0,0,1,1,0,0], false));id++;
    ts.add(new Tile('counterWriteMsb1', writeColor, origin, [id,'','','',id+1,''], [1,0,0,0,1,0], false));id++;
    ts.add(new Tile('counterWriteMsb1', writeColor, origin, ['',id,'',id+1,'',''], [0,1,0,1,0,0], false));id++;
    ts.add(new Tile('counterWriteMsb1', writeColor, origin, [id,'',id+1,'','',''], [1,0,1,0,0,0], false));id++;
    ts.add(new Tile('counterWriteMsb1', writeColor, origin, ['','',id+1,'','',id], [0,0,1,0,0,1], false));id++;
    ts.add(new Tile('counterWriteMsb1', writeColor, origin, ['','',outGlue,'','',id++], [0,0,1,0,0,1], false));
}

function counterReturnColumnStart(inGlue, outGlue)
{
    ts.add(new Tile('counterReturnColumnStart', readColor, origin, ['',id,'','','',inGlue], [0,1,0,0,0,1], false));
    ts.add(new Tile('counterReturnColumnStart', readColor, origin, ['','',id+1,'',id,''], [0,0,1,0,1,0], false));id++;
    ts.add(new Tile('counterReturnColumnStart', readColor, origin, ['','',id+1,'','',id], [0,0,1,0,0,1], false));id++;
    ts.add(new Tile('counterReturnColumnStart', readColor, origin, ['','',outGlue,'','',id++], [0,0,1,0,0,1], false));
}

function counterReturnColumn(inGlue, outGlue)
{
    ts.add(new Tile('counterReturnColumn', readColor, origin, ['','',id,'','',inGlue], [0,0,1,0,0,1], false));
    ts.add(new Tile('counterReturnColumn', readColor, origin, ['','',id+1,'','',id], [0,0,1,0,0,1], false));id++;
    ts.add(new Tile('counterReturnColumn', readColor, origin, ['','',outGlue,'','',id++], [0,0,1,0,0,1], false));
}

function counterReturnColumnEnd(inGlue, outGlue1, outGlue2)
{
    ts.add(new Tile('counterReturnColumnEnd', readColor, origin, ['','','',id,'',inGlue], [0,0,0,1,0,1], false));
    ts.add(new Tile('counterReturnColumnEnd', readColor, origin, [id,'','','',id+1,outGlue2], [1,0,0,0,1,1], false));id++;
    ts.add(new Tile('counterReturnColumnEnd', readColor, origin, ['',id++,'','','',outGlue1], [0,1,0,0,0,1], false));
}

var returnColor = [.5,0,.5];

function returnRowStart(inGlue, outGlue, fill)
{
    ts.add(new Tile('returnRowStart', returnColor, origin, ['',id,fill,'','',inGlue], [0,1,1,0,0,1], false));
    ts.add(new Tile('returnRowStart', returnColor, origin, [id+1,'','','',id,''], [1,0,0,0,1,0], false));id++;
    ts.add(new Tile('returnRowStart', returnColor, origin, [id+1,'','',id,'',''], [1,0,0,1,0,0], false));id++;
    ts.add(new Tile('returnRowStart', returnColor, origin, [outGlue,'','',id++,'',''], [1,0,0,1,0,0], false));
}

function returnRow(inGlue, outGlue)
{
    ts.add(new Tile('returnRow', returnColor, origin, [id,'','',inGlue,'',''], [1,0,0,1,0,0], false));
    ts.add(new Tile('returnRow', returnColor, origin, [id+1,'','',id,'',''], [1,0,0,1,0,0], false));id++;
    ts.add(new Tile('returnRow', returnColor, origin, [outGlue,'','',id++,'',''], [1,0,0,1,0,0], false));
}

function returnRowEnd(inGlue, outGlue1, outGlue2)
{
    ts.add(new Tile('returnRowEnd', returnColor, origin, [id,'','',inGlue,'',''], [1,0,0,1,0,0], false));
    ts.add(new Tile('returnRowEnd', returnColor, origin, [id+1,'','',id,'',''], [1,0,0,1,0,0], false));id++;
    ts.add(new Tile('returnRowEnd', returnColor, origin, ['','','',id,'',id+1], [0,0,0,1,0,1], false));id++;
    ts.add(new Tile('returnRowEnd', returnColor, origin, ['','',id,'',id+1,outGlue2], [0,0,1,0,1,1], false));id++;
    ts.add(new Tile('returnRowEnd', returnColor, origin, ['',id++,'','','',outGlue1], [0,1,0,0,0,1], false));
}

function returnRowSingle(inGlue, outGlue1, outGlue2, fill)
{
    ts.add(new Tile('returnRowSingle', returnColor, origin, ['',id,fill,'','',inGlue], [0,1,1,0,0,1], false));
    ts.add(new Tile('returnRowSingle', returnColor, origin, [id+1,'','','',id,''], [1,0,0,0,1,0], false));id++;
    ts.add(new Tile('returnRowSingle', returnColor, origin, [id+1,'','',id,'',''], [1,0,0,1,0,0], false));id++;
    ts.add(new Tile('returnRowSingle', returnColor, origin, ['','','',id,'',id+1], [0,0,0,1,0,1], false));id++;
    ts.add(new Tile('returnRowSingle', returnColor, origin, ['','',id,'',id+1,outGlue2], [0,0,1,0,1,1], false));id++;
    ts.add(new Tile('returnRowSingle', returnColor, origin, ['',id++,'','','',outGlue1], [0,1,0,0,0,1], false));
}

function roofChimney(inGlue, outGlue, fill)
{
    ts.add(new Tile('roofChimney', fillColor, origin, ['','',inGlue,'','',id], [0,0,1,0,0,1], false));
    ts.add(new Tile('roofChimney', fillColor, origin, ['','',id,'','',id+1], [0,0,1,0,0,1], false));id++;
    ts.add(new Tile('roofChimney', fillColor, origin, ['',id+1,id,'','',outGlue], [0,1,1,0,0,1], false));id++;
    ts.add(new Tile('roofChimney', fillColor, origin, [fill,'','','',id++,''], [1,0,0,0,1,0], false));
}

function roofFiller(inGlue, outGlue)
{
    ts.add(new Tile('roofFiller', fillColor, origin, [id,'','',inGlue,'',''], [1,0,0,1,0,0], false));
    ts.add(new Tile('roofFiller', fillColor, origin, [id+1,'','',id,'',''], [1,0,0,1,0,0], false));id++;
    ts.add(new Tile('roofFiller', fillColor, origin, [outGlue,'','',id,id+1,''], [1,0,0,1,1,0], false));id++;
    ts.add(new Tile('roofFiller', fillColor, origin, ['',id++,'','','',''], [0,1,0,0,0,0], false));
}

function roofCap(inGlue, outGlue1, outGlue2)
{
    ts.add(new Tile('roofCap', fillColor, origin, [outGlue1,'',inGlue,outGlue2,'',''], [1,0,1,1,0,0], false));
}

function roofLeftShingle(inGlue, outGlue, fill)
{
    ts.add(new Tile('roofLeftShingle', fillColor, origin, [inGlue,'',fill,outGlue,'',''], [1,0,1,1,0,0], false));
}

function roofRightShingle(inGlue, outGlue, fill)
{
    ts.add(new Tile('roofRightShingle', fillColor, origin, [outGlue,'',fill,inGlue,'',''], [1,0,1,1,0,0], false));
}