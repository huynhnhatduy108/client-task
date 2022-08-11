import "./App.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CATEGORY_TASK, URL_SERVER } from "./contants";

function App() {
    const [listTask, setListTask] = useState([]);
    const [nameTask, setNameTask] = useState("");
    const [categoryTask, setCategoryTask] = useState("education");
    const [currentID, setCurrentID] = useState(null);

    useEffect(() => {
        getListTask();
    }, [])

    const getListTask =()=>{
        axios.get(`${URL_SERVER}/task`)
            .then(function (response) {
                if (response.status ===200){
                    setListTask(response.data.data)
                    console.log("response", response.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const handleRadom = async ()=>{
        axios.get('https://www.boredapi.com/api/activity')
            .then(function (response) {
                if (response.status === 200){
                    const {data:{activity, type }} = response;
                    setNameTask(activity);
                    setCategoryTask(type);
                }   
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const handleSubmit = ()=>{
        if (currentID){
            const data = {
                name: nameTask,
                category: categoryTask,
            }
            axios.put(`${URL_SERVER}/task/${currentID}`, data)
                .then(function (response) {
                    if (response.status ===200 || response.status ===201){
                        setCurrentID(null);
                        setNameTask("");
                        setCategoryTask("education");
                        getListTask();
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }else{
            const data ={
                name: nameTask,
                category: categoryTask,
                isCompleted: false,
            }
            axios.post(`${URL_SERVER}/task`, data)
                .then(function (response) {
                    if (response.status ===200 || response.status ===201){
                        setCurrentID(null);
                        setNameTask("");
                        setCategoryTask("education");
                        getListTask();
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    const handleCheckBox = (id) =>{
        const temp = [...listTask]
        const index = temp.findIndex((item)=> item._id === id);
        if (index>-1){
            temp[index].isCompleted = !temp[index].isCompleted
            setListTask(temp);
            axios.put(`${URL_SERVER}/task/${id}`, temp[index])
                .then(function (response) {
                    if (response.status ===200 || response.status ===201){
                        console.log("response", response.data);
                        return
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        
    }

    const handleUpdate = (id) =>{
        const task =  [...listTask].find((item)=> item._id === id);
        if (task){
            setCurrentID(id);
            setNameTask(task.name);
            setCategoryTask(task.category);
        }
    }

    const handleDelete = (id) =>{
        if (window.confirm("Are you sure delete this task!")) {
            const temp = [...listTask].filter((item)=> item._id !== id);
            setListTask(temp);
            axios.delete(`${URL_SERVER}/task/${id}`)
            .then(function (response) {
                if (response.status ===200){
                    console.log("response", response.data);
                    return;
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        } else {
            console.log("cancel delete")
        }
    }

    return (
        <div className="App">
            <div className="grid wide">
                <div className="container">
                    <div className="row no-gutters">
                        <div className="col l-6 m-6 c-6">
                            <div className="todo__task">
                                <h3>TO DO Task</h3>
                                <div className="todo__task-input">
                                    <div className="todo__task-input-label"><label>Task Name</label></div>
                                    <input type="text" className="" value={nameTask} onChange={(e)=>setNameTask(e.target.value)}/>
                                </div>
                                <div className="todo__task-select">
                                    <div className="todo__task-select-label"><label>Category</label></div>
                                    <select value={categoryTask} onChange={(e)=>setCategoryTask(e.target.value)}>
                                        {CATEGORY_TASK.map((item, index)=>
                                            <option value={item} key={item}>{item}</option>
                                        )}
                                    </select>
                                </div>
                                <div className="list__button">
                                    <div className="button__radom" onClick={handleRadom}>Radom</div>
                                    <div className="button__submit" onClick={handleSubmit}>Submit</div>
                                </div>
                            </div>
                        </div>
                        <div className="col l-6 m-6 c-6">
                            <div className="list__task">
                                {listTask.length && listTask.map((item)=> 
                                    <div className="item__task" key={item._id}>
                                        <div className="item__task-left">
                                            <div className="item__check-box">
                                                <input type="checkbox" checked={item.isCompleted} onChange={()=>handleCheckBox(item._id)}/>
                                            </div>
                                            <div  className="item__info">
                                                <h4 className="item__info-name">{item.category}</h4>
                                                <div className="item__info-category">{item.name}</div>
                                            </div>
                                        </div>
                                        <div  className="item__update-delete">
                                            <div className="item__btn-update" onClick={()=>handleUpdate(item._id)}><i className="fa-solid fa-pen"></i></div>
                                            <div className="item__btn-delete" onClick={()=>handleDelete(item._id)}><i className="fa-solid fa-trash-can"></i></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
