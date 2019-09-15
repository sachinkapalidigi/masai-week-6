"use strict";
let employees = [];
let myStorage = window.localStorage;
let globalIndex = 0;

window.onload = ()=>{
    
    if (myStorage.getItem('employees') != null) {
        employees = [...JSON.parse(myStorage.getItem('employees'))];
        fillProfile(globalIndex);
    }     

    displayDetails(employees);
}

let createEmployeeForm = document.getElementById('createEmployeeForm');
createEmployeeForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    createEmployee();
});

class Employee {
    constructor(name,email,phone,skillSet,currentRole,dob,doj,department,team,manager,salary){
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.skillSet = skillSet;
        this.currentRole = currentRole;
        this.dob = dob;
        this.doj = doj;
        this.department = department;
        this.team = team;
        this.manager = manager;
        this.salary = salary;
        this.skillPoints = {}      
    }

    skillPointsUpdate(skill,points){
        this.skillPoints[skill] = points;
    }

}

const createEmployee = ()=>{
    // event.preventDefault();
    let inputs = document.querySelectorAll('input');
    let name = inputs[0].value+' '+inputs[1].value;
    let skillSet = inputs[4].value.split(',');
    let team = document.getElementById('inputTeam').value;
    let department = document.getElementById('inputDepartment').value;
    let employee = new Employee(name,inputs[2].value,inputs[3].value,skillSet,inputs[5].value,inputs[6].value,inputs[7].value,department,team,inputs[8].value,inputs[9].value);
    employees.push(employee);
    displayDetails(employees);
    updateLocalStorage('employees',employees);
    alert("Employee was added Successfully!")
}

const displayDetails = (arr) =>{
    
    let tbody  = document.getElementById('detailsTable').children[1];
    tbody.innerHTML = '';
    if (arr.length == 0) {
        tbody.innerHTML = '<br><br><h1>No Data to display...</h1>'
        return false;
    } else {    
        arr.forEach((element,i) => {
            let tr = document.createElement('tr');
            let th = document.createElement('td');
            th.textContent = i+1;
            tr.appendChild(th);
            let td1 = document.createElement('td');
            td1.innerHTML = `<span onclick="displayProfile(${i})">${element.name}</span>`;
            tr.appendChild(td1);
            let td2 = document.createElement('td');
            td2.textContent = element.currentRole;
            tr.appendChild(td2);
            let td3 = document.createElement('td');
            td3.textContent = element.department;
            tr.appendChild(td3);
            let td4 = document.createElement('td');
            td4.textContent = element.manager;
            tr.appendChild(td4);
            let td5 = document.createElement('td');
            td5.textContent = element.salary;
            tr.appendChild(td5);
            tbody.appendChild(tr);
        });
        return true;
    }
    
}

const updateLocalStorage = (key,arr) => {
    myStorage.setItem(key,JSON.stringify(arr));
}

const displayProfile = (index) => {
    globalIndex = index;
    fillProfile(index);
    $('#individualDisplay').tab('show');

}

const fillProfile = (index) => {
    let employeeProfileContainer = document.getElementById('employeeProfileContainer');
    let displayEmployee = employees[index];  
    employeeProfileContainer.innerHTML = `<div class="jumbotron jumbotron-fluid">
        <div class="container">
            <h1 class="display-4">${displayEmployee.name}</h1>
            <p class="lead">Date of Birth : ${displayEmployee.dob} |  Date of Joining : ${displayEmployee.doj}  |  Phone Number : ${displayEmployee.phone}</p>
            <p class="lead">Department : ${displayEmployee.department}  |  Team : ${displayEmployee.team}  |  Reporting Manager : ${displayEmployee.manager}  |  Salary : ${displayEmployee.salary}</p>
        </div>
    </div>    
    `
    displayEmployee.skillSet.forEach(skill=>{
        let row = document.createElement('div');
        row.setAttribute('class','row');
        let br = document.createElement('br');
        
        if(displayEmployee.skillPoints[skill] == undefined){
            
            row.innerHTML = `<div class="col-md-4">${skill}</div>
                                <div class="col-md-1"><button onclick="changePoints(${index},'${skill}',${false})" type="button" class="btn btn-sm btn-danger">--</button></div>
                                <div class="col-md-5">
                                <div class="progress">
                                    <div class="progress-bar bg-info" role="progressbar" style="width: 1%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                </div>
                                <div class="col-md-1"><button onclick="changePoints(${index},'${skill}',${true})" type="button" class="btn btn-sm btn-success">++</button></div>
                                `
        } else {
            row.innerHTML = `<div class="col-md-4">${skill}</div>
                                <div class="col-md-1"><button onclick="changePoints(${index},'${skill}',${false})" type="button" class=" btn-sm btn-danger">--</button></div>
                                <div class="col-md-5">
                                <div class="progress">
                                    <div class="progress-bar bg-info" role="progressbar" style="width: ${displayEmployee.skillPoints[skill]*10}%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                </div>
                                <div class="col-md-1"><button onclick="changePoints(${index},'${skill}',${true})" type="button" class="btn btn-sm btn-success">++</button></div>
                                `
        }
        employeeProfileContainer.appendChild(row);
        employeeProfileContainer.appendChild(br);
    })
    
}

const changePoints = (index,skill,add) => { 
    let points = employees[index].skillPoints[skill];
    // let newSkillPoint = employees[index].skillPoints[skill];
    if (add) {
        if (points == undefined) {
            // employees[index].skillPointsUpdate(skill,2);            
            employees[index].skillPoints[skill] = 2;
        } else if(points == 10) {
            employees[index].skillPoints[skill] = 10;

        } else {
            points = points+1;
            // employees[index].skillPointsUpdate(skill,points);
            employees[index].skillPoints[skill] = points;
        }
    } else {
        if (points == undefined) {
            // employees[index].skillPointsUpdate(skill,1);
            employees[index].skillPoints[skill] = 0;
        } else if(points == 0) {
            employees[index].skillPoints[skill] = 0;

        } else {
            points = points-1;
            employees[index].skillPoints[skill] = points;
            // employees[index].skillPointsUpdate(skill,points);
        }
    }
    updateLocalStorage('employees',employees);    
    fillProfile(index);
}