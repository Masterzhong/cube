

//定义画布大小
let cubeObj = document.getElementById('cube')
cubeObj.width = 400
cubeObj.height = cubeObj.width*1.8
let cubeSize = cubeObj.width/10

//创建画布
let cubeCtx = cubeObj.getContext('2d')

//生成方块
function createCube(){
  cubeCtx.fillRect(0,0,cubeSize,cubeSize)
}

createCube();


class Game {
    constructor(data,size = 400){
        this.data = data
        this.Tag  = null
        this.cubeObj = document.getElementById('cube')
        this.cubeCtx = this.cubeObj.getContext('2d') 
        this.cube = [];
        this.totalCube = [];
        this.score = 0
        this.cubeType = this.randomCubeType() //模块类型
        this.dir = 0  //模块方向
        this.initSize(size) 
        this.createCube();
        this.cubeDown();
        this.cubeControl();
    }
    //初始化画布大小
    initSize(size){
        this.cubeObj.width = size
        this.cubeObj.height = cubeObj.width*1.8
        this.cubeSize = size/10
        this.cubeCtx.strokeRect(0, 0, this.cubeObj.width, this.cubeObj.height)
    }

    //随机生成
    randomCubeType(Min=0,Max=5){
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.round(Rand * Range); //四舍五入
        return num;  
    }

    //生成方块
    createCube(){
        if(this.gameover()){
            this.cubeType =this.randomCubeType()
            this.dir = 0
            data[this.cubeType][this.dir].forEach(val=>{
                this.cube.push([(val[0])*this.cubeSize,(val[1]-1)*this.cubeSize])
            }) 
        }else{
            clearInterval(this.Tag)
            alert('游戏结束')
        }
        
    }

    //检测 并 执行游戏结束
    gameover(){
        if(this.totalCube.length>0){
            if(Math.min(...this.totalCube.map(v=>v[1]))>0){
                 return true
            }else{
                 return false 
            }
        }else{
            return true
        }
    }

    //变形方块
    changeCube(){
        switch(this.cubeType){
            case 0://i
            this.dir == 0?this.dir = 1:this.dir = 0
            this.checkbord();
            break;
            case 1://o  
            this.checkbord();
            break;
            case 2://l
            this.dir == 3?this.dir = 0:this.dir++
            this.checkbord();
            break;
            case 3://反L
            this.dir == 3?this.dir = 0:this.dir++
            this.checkbord();
            break;
            case 4://z
            this.dir == 3?this.dir = 0:this.dir++
            this.checkbord();
            break;
            case 5://t
            this.dir == 3?this.dir = 0:this.dir++
            this.checkbord();
            break;
        }
 
        
    }

    checkbord(){
        let cube = [...this.cube]
        let  ischange = true
        let  newCube = null
        let  initx = cube[0][0]
        let  inity = cube[0][1]
        newCube = JSON.parse(JSON.stringify(data[this.cubeType][this.dir]))
        newCube.forEach(val=>{
           val[0] = (val[0]*(this.cubeSize))+initx
           val[1] = (val[1]*(this.cubeSize))+inity
       })
       let max = Math.max(...newCube.map(v=>v[0]))
       let min = Math.max(...newCube.map(v=>v[0]))
       //右边极限
       if(max > this.cubeObj.width-this.cubeSize){
           ischange = false
       }
       //左边极限
       if(min < 0 ){
           ischange = false
       }
       //底部极限
       newCube.forEach(val=>{
         this.totalCube.forEach(v=>{
             if(v[0] == val[0]&&v[1]-this.cubeSize == val[1]){
                 ischange = false
             }
         })
       }) 
       if(ischange){
            this.clearCube(this.cube);
            this.cube = newCube;
            this.drawCube(this.cube);
       }   
    }

    //绘制方块
    drawCube(cube){
        cube.forEach(val=>{
            cubeCtx.fillRect(val[0],val[1],cubeSize,cubeSize)
        })
        
    }


    //清空上一个状态的方块
    clearCube(cube){
        cube.forEach(val=>{
            cubeCtx.clearRect(val[0],val[1],cubeSize,cubeSize)
        })
        
    }

    //方块下落 
    cubeDown(){   
       this.Tag =  setInterval(()=>{
           //是否结束
                this.clearCube(this.cube);
                this.cubeCtx.strokeRect(0, 0, this.cubeObj.width, this.cubeObj.height)
                try{
                    let max = Math.max(...this.cube.map(v=>v[1]))
                    if(max>=this.cubeObj.height-this.cubeSize){
                        this.totalCube.push(...this.cube);
                        clearInterval(this.Tag);
                        this.drawCube(this.cube);
                        throw(true)
                    }

                    if(this.totalCube.length>0){
                        this.totalCube.forEach(x=>{
                           this.cube.forEach(y=>{
                            if(y[0] == x[0] && x[1]-cubeSize == y[1]){
                                this.totalCube.push(...this.cube);
                                clearInterval(this.Tag);
                                this.drawCube(this.cube);
                                throw(true) 
                             }
                           }) 
                        })
                    }

                    this.cube.forEach(val=>{  
                        val[1] = val[1]+this.cubeSize   
                    }) 
   

                }catch(e){
                    this.checkCube();
                    this.cube = [];
                    this.createCube();
                    this.cubeDown();
                }          

                this.drawCube(this.cube);
        },300)
    }


    //已存方块整行检测
    checkCube(){
        let count = {}
        //横坐标计数
        this.totalCube.forEach(val=>{
            if(count[val[1]]){
                count[val[1]] +=1
            }else{
                count[val[1]] = 1
            } 
        })
        let target = []
        Object.keys(count).forEach(key=>{
            if(count[key] == 10){
                target.push(Number(key))
            }
        })
        if(target.length>0){
            this.clearCube(this.totalCube)
            target = target.sort()
            this.cleanRow(target).then(totalCube=>{
                 target.forEach(val=>{
                    for(var k =0;k<totalCube.length;k++){
                        if(totalCube[k][1]<val){
                            totalCube[k][1] = totalCube[k][1] + this.cubeSize
                        }
                    } 
                }) 
                this.getScore()
                this.totalCube = totalCube
                this.drawCube(totalCube);  
            })
        }     
    }

    //得分
    getScore(){
        let scordObj = document.getElementsByClassName('scord')[0];
        scordObj.innerText = `得分：${this.score}`
    }
    
    //消除符合条件的方块行
    cleanRow(arr){
        return new Promise((resolve)=>{
            var totalCube = [...this.totalCube]
            arr.forEach(val=>{
                for(var j =0;j<totalCube.length;j++){
                    if(val == totalCube[j][1]){
                        totalCube.splice(j--,1)
                    }
                }
                this.score++
            })
            resolve(totalCube)
        })  
    }
    //左右操控 
    cubeControl(){
        window.addEventListener('keydown',e=>{
            switch(e.key){
                case 'ArrowLeft':
                this.clearCube(this.cube);
                let min =  Math.min(...this.cube.map(v=>v[0]))
                if(min>0){
                    this.cube.forEach(val=>{
                        val[0] -= this.cubeSize
                    })
                }
                this.drawCube(this.cube);
                break;
                case 'ArrowRight':
                this.clearCube(this.cube);
                let max = Math.max(...this.cube.map(v=>v[0]))
                if(max<this.cubeObj.width-this.cubeSize){
                    this.cube.forEach(val=>{
                        val[0] += this.cubeSize
                    })
                }
                this.drawCube(this.cube);
                break;
                case ' ':
                  this.changeCube();
                break;
            }
        })
    }

}

