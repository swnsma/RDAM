function Data()
{
    this.Production =  []
    this.Consumption =  []
    this.Ticks = []
    this.return_en =return_en(this.Production,this.Consumption);
}

var return_en = function(a,b){
    var c=[]
    if(a)
    {
        c[0]=a;
        c[1]=b;
        return c;
    }
    return [];
}
