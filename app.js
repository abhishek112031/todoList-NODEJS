const path=require('path');
const express=require('express');
const fs=require('fs');
const cors=require('cors');

const app=express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

function existingTodos(){
    const existing=fs.readFileSync(path.join(__dirname,'todo.json'),'utf-8')
    let data;
    if(!existing){
        data=[];
    }else{

     data=JSON.parse(existing);
    }
    return data;

}

app.post('/add-todo',(req,res,next)=>{
    const id=new Date().toISOString();
    const {name,age,sex,city}=req.body;
    
    let data=existingTodos();
   
    let obj={id,name,age,sex,city};
    data.push(obj);

    fs.writeFileSync(path.join(__dirname,'todo.json'),JSON.stringify(data));
    res.status(201).json({message:'success',newTodo:obj})

});

app.get('/all-todos',(req,res,next)=>{
  
    const objData=existingTodos();
    res.status(200).json({message:'successful',allTodo:objData})

});

app.get('/todos/:id',async (req,res,next)=>{
    try{

        let id=req.params.id;
        const existing=existingTodos();
        if(existing.length){
    
            const reqTodo=existing.filter((elem)=>{
                return elem.id===id;
            });
            console.log(existing,reqTodo)
            if(!reqTodo.length){

               return res.status(500).json({message:'id did not matched!!'})
            }
            res.status(200).json({message:'success',todo:reqTodo[0]});
            
        
        }
        else{
            
            res.status(500).json({message:'empty todo!!'})
        }
    }
    catch(err){
        res.status(500).json({message:err})
    }
})

app.put('/todos/:id',(req,res,next)=>{
    //for completely replace oblect:
    // should define null value handelling functions
    try{

        const id=req.params.id;
        const {name,age,sex,city}=req.body;
        console.log('CITY=',city)
    
        const existing=existingTodos();
        if(existing.length){

            
            // const updated=existing.filter((elem)=>{
            //     return elem.id===id;
            // });
            // const tobeUpdatedIdx=existing.indexOf(updated[0]);
            // existing[tobeUpdatedIdx].name=name;
            // existing[tobeUpdatedIdx].age=age;
            // existing[tobeUpdatedIdx].sex=sex;
            // existing[tobeUpdatedIdx].city=city;
            let newtodo;
            const updated=existing.map(elem=>{
                if(elem.id===id){
                  
                    newtodo={...elem,name,age,sex,city};
                    return newtodo
                }
                return elem;
            })
        
        
            console.log('===>',updated);
            fs.writeFileSync(path.join(__dirname,'todo.json'),JSON.stringify(updated));
            res.status(200).json({message:'success!!!',alltodos:updated,todo:newtodo})
        }
        else{
            res.status(500).json({message:'empty todo!!'})

        }
    
    }catch(err){
        res.status(500).json({message:'err'})
    }



    
})


//only field is updated:
app.patch('/todos/:id',(req,res,next)=>{
    //for completely replace oblect:
    try{
        const existing=existingTodos();

        const id=req.params.id;

        const reqTodo=existing.filter(elem=>{
            return elem.id===id;
        });
        const name=req.body.name||reqTodo[0].name;
        const age=req.body.age||reqTodo[0].age;
        const sex=req.body.sex||reqTodo[0].sex;
        const city=req.body.city||reqTodo[0].city;



     
        console.log('CITY=',city)
    
       
        if(existing.length){
            let newtodo;
            const updated=existing.map(elem=>{
                if(elem.id===id){
                 
                    newtodo={...elem,name,age,sex,city};
                    return newtodo;
                }
                return elem;
            })
        
        
            console.log('===>',updated);
            fs.writeFileSync(path.join(__dirname,'todo.json'),JSON.stringify(updated));
            res.status(200).json({message:'success!!!',alltodos:updated,todo:newtodo})
        }
        else{
            res.status(500).json({message:'empty todo!!'})

        }
    
    }catch(err){
        res.status(500).json({message:'err'})
    }



})

app.delete('/remove/:id',(req,res,next)=>{
    const id =req.params.id;

    const existing=existingTodos();
    const afterDeletionTodos=existing.filter(elem=>{
        return elem.id!==id;
    })
    fs.writeFileSync(path.join(__dirname,'todo.json'),JSON.stringify(afterDeletionTodos));
    res.status(200).json({message:'delete success!!!',alltodos:afterDeletionTodos})


})


app.listen(3000)

