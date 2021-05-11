`use strict`;

let colorBtn=document.querySelectorAll(".filter_color_box");
let mainContainer=document.querySelector(".main_container");
let alltaskBtn=document.querySelector(".allTask");
let btnArr=document.querySelectorAll(".icon_container");
let plusBtn=btnArr[0]
let crossBtn=btnArr[1];
let crossState = false;
let body=document.body;
let taskArr=[];

// to get the stored data from local storage
if(localStorage.getItem("allTask")){
  taskArr=JSON.parse(localStorage.getItem("allTask"));
    for(let i=0;i<taskArr.length;i++){
        let {id,color,task,lockState,taskState}=taskArr[i];
        createTask(color,task,false,lockState,taskState,id);
    }
}

// To filter the task according to their colors
for(let i=0;i<colorBtn.length;i++){
    colorBtn[i].addEventListener("click",function(e){
       let color=colorBtn[i].classList[1];
       console.log("color is",color);
       switch(color){
            case "red": mainContainer.style.background="rgb(253, 186, 174)";
                        break;
            case "blue":mainContainer.style.background="#dff9fb";
                        break;
            case "green":mainContainer.style.background="rgb(197, 245, 197)";
                        break;
            case "black":mainContainer.style.background="#7C7C7C";
                        break;
       }
       let taskBoxArr=mainContainer.getElementsByClassName("task_container");
        for(let i=0;i<taskBoxArr.length;i++){
            let taskFilter=taskBoxArr[i].children[0];
            let taskColor=taskFilter.classList[1];
            console.log(taskColor);
            if(color==taskColor){
                taskBoxArr[i].style.display="block";
            }else{
                taskBoxArr[i].style.display="none";
            }
        }
    })
}

plusBtn.addEventListener("click",createModal);
crossBtn.addEventListener("click",getCrossState);
alltaskBtn.addEventListener("click",showAllTask);

// *****************************************************************Modal Container*****************************************************
function showAllTask(){
    mainContainer.style.background="#ecf0f1";
    let taskBoxArr=mainContainer.getElementsByClassName("task_container");
    for(let i=0;i<taskBoxArr.length;i++){
        taskBoxArr[i].style.display="block";
    }
}

function createModal(){
    let modalContainer=document.querySelector(".modal_container_box");
    // if modal container isn't present,then make one
    if(modalContainer==null){
        modalContainer=document.createElement("div");
        modalContainer.setAttribute("class","modal_container_box");
        modalContainer.innerHTML=`<div class="content_box">
                                    <textarea class="modal_input" 
                                    placeholder="Enter Your text"></textarea>
                                </div>
                                <div class="filter_box_main">
                                <div class="color_option_box red">
                                </div>
                                <div class="color_option_box blue">
                                </div>
                                <div class="color_option_box green">
                                </div>
                                <div class="color_option_box black">
                                </div>
                                </div>`;
        body.appendChild(modalContainer);
        mainContainer.style.opacity=0.5;
        handleModal(modalContainer);
    }
    let textarea=modalContainer.querySelector(".modal_input");
    textarea.value="";
    
}
function handleModal(modalContainer){
    let cColor="black";
    let filterElements=document.querySelectorAll(".color_option_box");
    filterElements[3].classList.add("border");
    // loop to change the border on color options wrt clicking
    for(let i=0;i<filterElements.length;i++){
        filterElements[i].addEventListener("click",function(){
             filterElements.forEach((color)=>{
                 color.classList.remove("border");
             });
             filterElements[i].classList.add("border");
             cColor=filterElements[i].classList[1];
        })
    }
    let textArea=document.querySelector(".modal_input");
    textArea.addEventListener("keydown",function(e){
        if(e.key=="Enter" && textArea.value!=""){
            modalContainer.remove();
            mainContainer.style.opacity=1;
            createTask(cColor,textArea.value,true);
        }
    }) 

}
// ****************************************************************Task Containers*******************************************************
function createTask(color,task,flag,lockState,taskState,id){
    let task_container=document.createElement("div");
    let uifn=new ShortUniqueId();
    let uid=id||uifn();
    let lstate=false||lockState;
    let tstate=false||taskState;
    // creating the taskcontainer once a task is added
    task_container.setAttribute("class","task_container");
    task_container.innerHTML=`<div class="task_filter ${color}"></div>
                              <h3 class="uid">
                                #${uid}
                                <i class="fas fa-check-circle"></i>
                              </h3>
                              <div class="task_desc"contenteditable="true">
                                ${task}
                                <i class="fas fa-lock"></i>
                              </div>`;
    mainContainer.appendChild(task_container);

    let taskFilter=task_container.querySelector(".task_filter");
    let lock=task_container.querySelector(".fa-lock");
    let taskStateEle=task_container.querySelector(".fa-check-circle");
    let taskDesc=task_container.querySelector(".task_desc");
    // condition to check if the entered task is added from UI or from local storage
    if(flag==true){
        let obj={"task":task,"id":`${uid}`,"color":color,"lockState":lstate,"taskState":tstate};
        taskArr.push(obj);
        let stringArr=JSON.stringify(taskArr);
        localStorage.setItem("allTask",stringArr);
    }else{
        if(lockState){
            lock.classList.add("lock_active");
            lockDesc(lock);
        }
        if(taskState){
            taskStateEle.classList.add("lock_active");
        }
    }
    // adding event listners on clicks
    lock.addEventListener("click",getLockState);
    taskStateEle.addEventListener("click",getTaskState);
    taskFilter.addEventListener("click",changeTaskColor);
    task_container.addEventListener("click",deleteTask);
    taskDesc.addEventListener("keypress",editTask);

}

function changeTaskColor(e){
//  changing the filter colors on the task container with clicks
 let taskFilterEle=e.currentTarget;
 let uidElem=taskFilterEle.parentNode.children[1];
 let uid=uidElem.innerText.split('#')[1];
 let colorArr=["red","blue","green","black"];
 let currColor=taskFilterEle.classList[1];
 let idx=colorArr.indexOf(currColor);
 let newIdx=(idx+1)%4;
 taskFilterEle.classList.remove(currColor);
 taskFilterEle.classList.add(colorArr[newIdx]);
//  updating the changed color in the local storage
 for(let i=0;i<taskArr.length;i++){
    let {id}=taskArr[i];
    if(id==uid){
        taskArr[i].color=colorArr[newIdx];
        let finalTaskArr=JSON.stringify(taskArr);
        localStorage.setItem("allTask",finalTaskArr);
        break;
    }
}

}
// ****************************************************************Task Container Functionalities****************************************
function getCrossState(e){
    let crossBtn=e.currentTarget;
    let crossBtnParent=crossBtn.parentNode;
    if(crossState==false){
        crossBtnParent.classList.add("active_cross");
    }else{
        crossBtnParent.classList.remove("active_cross");
    }
    crossState=!crossState;

}
function deleteTask(e){
    let taskContainer=e.currentTarget;
    let iEleArr=taskContainer.getElementsByTagName("i");
    let tState=iEleArr[0].classList.contains("lock_active");
    if(crossState){
        if(!tState){
            let response=confirm("The task isn't completed yet. Do you want to continue?");
            if(response){
                deleteFromStorage(taskContainer);
                taskContainer.remove();
            }
        }else{
            deleteFromStorage(taskContainer);
            taskContainer.remove();
        }
        
    }
}
function deleteFromStorage(taskContainer){
    let uidElem=taskContainer.querySelector(".uid");
    let uid=uidElem.innerText.split('#')[1];
    for(let i=0;i<taskArr.length;i++){
        let {id}=taskArr[i];
        if(id==uid){
            taskArr.splice(i,1);
            let finalTaskArr=JSON.stringify(taskArr);
            localStorage.setItem("allTask",finalTaskArr);
            break;
        }
    }
}
function getLockState(e){
    let lock=e.currentTarget;
    let uidElem=lock.parentNode.parentNode.children[1];
    let uid=uidElem.innerText.split('#')[1];
    let isPresent=lock.classList.contains("lock_active");
    let state;
    if(isPresent){
        lock.classList.remove("lock_active");
        state=false;
    }else{
        lock.classList.add("lock_active");
        state=true;
    }
    for(let i=0;i<taskArr.length;i++){
        let {id}=taskArr[i];
        if(id==uid){
            taskArr[i].lockState=state;
            let finalTaskArr=JSON.stringify(taskArr);
            localStorage.setItem("allTask",finalTaskArr);
            break;
        }
    }
    lockDesc(lock);
}
function lockDesc(lock){
    let lockDesc=lock.parentNode;
    let isPresent=lock.classList.contains("lock_active");
    if(isPresent){
        lockDesc.contentEditable=false;
    }else{
        lockDesc.contentEditable=true;
    }
}
function getTaskState(e){
    let tState=e.currentTarget;
    let uidElem=tState.parentNode.parentNode.children[1];
    let uid=uidElem.innerText.split('#')[1];
    let isPresent=tState.classList.contains("lock_active");
    let state;
    if(isPresent){
        tState.classList.remove("lock_active");
        state=false;
    }else{
        tState.classList.add("lock_active");
        state=true;
    }
    for(let i=0;i<taskArr.length;i++){
        let {id}=taskArr[i];
        if(id==uid){
            taskArr[i].taskState=state;
            let finalTaskArr=JSON.stringify(taskArr);
            localStorage.setItem("allTask",finalTaskArr);
            break;
        }
    }
}
function editTask(e){
    let taskDesc=e.currentTarget;
    let uidElem=taskDesc.parentNode.children[1];
    let uid=uidElem.innerText.split('#')[1];
    console.log("uid=",uid);
    for(let i=0;i<taskArr.length;i++){
        
        let {id}=taskArr[i];
        console.log("id=",id,"uid=",uid);
        if(id==uid){
            
            taskArr[i].task=taskDesc.innerText;
            let finalTaskArr=JSON.stringify(taskArr);
            localStorage.setItem("allTask",finalTaskArr);
            break;
        }
    }
}