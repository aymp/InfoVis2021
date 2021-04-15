class Vec3
{
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v){
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this
    }

    sub(v){
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this      
    }

    sum(){
        return this.x + this.y + this.z
    }

    min(){
        return [this.x, this.y, this.z].sort()[0]
    }

    mid(){
        return [this.x, this.y, this.z].sort()[1]
    }

    max(){
        return [this.x, this.y, this.z].sort()[2]
    }
}