class testcls{
    constructor(a,b){
        this.a=a;
        this.b=b;
    }
    add(){
        return this.a+this.b;
    }
    static add2(){
        return this.a*this.b*2;
    }
}
module.exports = testcls;