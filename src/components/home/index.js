import {useState,useEffect} from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useHistory, Link} from "react-router-dom";
import './index.css'
import deleteIcon from './../../images/deleteIcon-64.png'
import updateIcon from './../../images/updateIcon-64.png'
import addIcon from './../../images/addUser.png'
import profileIcon from './../../images/profile.png'
import Navigation from './../navigation/Navigation'
import CreateForm from './../forms/CreateForm'
import UpdateForm from './../forms/UpdateForm'

const Index = ()=> {
	let articleCreate =  document.getElementById("article-create");
	let articleUpdate =  document.getElementById("article-update");
	let notif = document.getElementById("notif");
	/*---*/
	const [employees, setEmployees] = useState([])
	const [user, setUser] = useState('')
	const [error, setError] = useState("")
	const [notification, setNotification] = useState('')
	const [idEmployee, setIdEmployee] = useState('')
	const [open, setOpen] = useState(false);
	
	let history = useHistory();

	//Update Employee------------------------------------------------------------
	const openUpdateForm = (id)=>{
 		setIdEmployee(id)
 		articleUpdate.style.display = "block";
 		articleCreate.style.display = "none";
	}
	const onSubmitUpdate = (emplUpdated)=> {
		setError('')
		setNotification('')
		const {first_name,last_name,email,age,grade,degree,grade_seniority,entry_date,social_situation} = emplUpdated;
		console.log('social_situation updated=> ',social_situation)
		if (first_name && last_name && email && age && grade_seniority && degree && grade_seniority && entry_date && social_situation) {
			fetch(`http://localhost:5000/employee/${idEmployee}`, {
			method : 'put',
			headers : {
				'Content-Type' : 'application/json', 
				'Authorization': 'Bearer ' + localStorage.getItem("token")
			},
			body : JSON.stringify({first_name,last_name,email,age,grade,degree,grade_seniority,social_situation})
			})
			.then(response=>response.json())
			.then(data=>{
				if (data.success){
					getAllEmpl()
					setNotification("employe updated successfully")
					setIdEmployee('')
					articleUpdate.style.display = "none";
					notif.style.display = "block"
					setTimeout(function(){ notif.style.display = "none" }, 3000);
				}
				else
					setError("unable to update employe")
			})
			.catch( err=> {
				console.log(err)
				setError(err.message + ". unable to update employe")
			} )
		}else{
			setError("All fields are required, please fill them all ")
		}
	}

	//Create Employee------------------------------------------------------------
	const onSubmitCreate = (newEmpl)=>{
		//let socialSituation = document.getElementById("social_situation").value;
		const {first_name,last_name,email,age,grade,degree,grade_seniority,entry_date,social_situation} = newEmpl;
		setError('')
		setNotification('')
		if (first_name && last_name && email && age && grade_seniority && degree && grade_seniority && entry_date && social_situation) {
			fetch("http://localhost:5000/employee", {
			method : 'post',
			headers : {
				'Content-Type' : 'application/json', 
				'Authorization': 'Bearer ' + localStorage.getItem("token")
			},
			body : JSON.stringify(newEmpl)
			})
			.then(response=>response.json())
			.then(data=>{
				if (data.success){
					getAllEmpl()
					setNotification("employe created successfully")
					articleCreate.style.display = "none";
					notif.style.display = "block"
					setTimeout(function(){ notif.style.display = "none" }, 3000);
				}
				else
					setError("unable to create employe")
			})
			.catch( err=> {
				console.log(err);
				setError(err.message)
			} )
		}else{
			setError("All fields are required, please fill them all ")
		}
		
	}
	const openCreateForm = ()=>{
		articleCreate.style.display = "block";
 		articleUpdate.style.display = "none";
	}

	//Delete Employee--------------------------------------------------------------
	const deleteEmpl = ()=>{
		console.log("delete",idEmployee)
		fetch(`http://localhost:5000/employee/${idEmployee}`, {
		method : 'delete',
		headers : {
			'Content-Type' : 'application/json', 
			'Authorization': 'Bearer ' + localStorage.getItem("token")
		},})
		.then(response=>response.json())
		.then(data=>{
			if (data.success){
				getAllEmpl()
				setNotification("employe was deleted successfully")
				notif.style.display = "block"
				setTimeout(function(){ notif.style.display = "none" }, 3000);
			}
			else{
				setNotification("unable to delete employe")
				notif.style.display = "block"
				setTimeout(function(){ notif.style.display = "none" }, 3000);
			}
		})
		.catch( err=> {
			console.log(err)
			setNotification("unable to delete employe")
			notif.style.display = "block"
			setTimeout(function(){ notif.style.display = "none" }, 3000);
		} )
		setOpen(false);
	}

 	const handleClickOpen = (id) => {
 		setIdEmployee(id)
    	setOpen(true);
  	};

	const handleClose = () => {
	    setOpen(false);
  	};

	//Get All Employee--------------------------------------------------------------
	const getAllEmpl = ()=>{
		setUser(localStorage.getItem("user"))
		fetch('http://localhost:5000/employees', {
		method : 'post',
		headers : {
			'Content-Type' : 'application/json', 
			'Authorization': 'Bearer ' + localStorage.getItem("token")
		},
		body : JSON.stringify({"page": 1})
		})
		.then(response=>response.json())
		.then(data=>{
			if (data.success){
				setEmployees(data.data)
			}
			else
				history.push("/signin")
		})
		.catch( err=> console.log(err) )
	}

	useEffect(() => {
		getAllEmpl();
	}, [])


return (
	<>
		<CreateForm onSubmitCreate={onSubmitCreate} error={error} />
		<UpdateForm onSubmitUpdate={onSubmitUpdate} error={error} idEmployee={idEmployee} />
		<p id="notif" className="white bg-green" > {notification} </p>
		{!employees.length ? (
				<div>
					<h1 className='f1 tc'>LOADING...</h1>
					<h2>if data does not load try to add employees</h2>
					<img onClick={openCreateForm} className="hover-bg-green br-100 center mt0 pt0 pa2 pointer" src={addIcon} alt="add employe"/>
				</div>
			)
		: (
			<div>
		<Navigation path="/" />
		<div className="w-90 center" >
			<h1>Welcome <span className='i green' >{user} ...</span></h1>
			<span>
				<img onClick={openCreateForm} className="hover-bg-green br-100 fr mt0 pt0 pa2 pointer" src={addIcon} alt="add employe"/>
				<img onClick={ ()=> history.push("/profile")} className=" hover-bg-green br-100 fl mt0 pt0 pa2 pointer" src={profileIcon} alt="add employe"/>
			</span>
			<table id="customers">
			  <thead>
				 <tr>
				    <th>First name</th>
				    <th>Last name</th>
				    <th>Email</th>
				    <th>Age</th>
				    <th>Social Situation</th>
				    <th>Degree</th>
				    <th>Grade</th>
				    <th>Grade seniority</th>
				    <th>Entry date</th>
				    <th>Created at</th>
				    <th>Updated at</th>
			   	</tr>
			  </thead>
			  <tbody>
			  	{
			  		employees.map((employe,index)=>{
			  			return <tr key={index+employe.first_name} >
			  				<td>{employe.first_name}</td>
			  				<td>{employe.last_name}</td>
			  				<td>{employe.email}</td>
			  				<td>{employe.age}</td>
			  				<td>{employe.social_situation}</td>
			  				<td>{employe.degree}</td>
			  				<td>{employe.grade}</td>
			  				<td>{employe.grade_seniority}</td>
			  				<td>{new Date(employe.entry_date).toDateString()}</td>
			  				<td>{employe.created_at.slice(0,10)}</td>
			  				<td>{employe.updated_at.slice(0,10)}</td>
			  				<td className="w2" onClick={ ()=> openUpdateForm(employe.uid)} ><img className="w-90 pointer" src={updateIcon} alt="delete employe"/> </td>
			  				<td className="w2"  >
		  						<img onClick={ ()=> handleClickOpen(employe.uid)} className="w-90 pointer" src={deleteIcon} alt="delete employe"/> 
						      	<Dialog
							        open={open}
							        onClose={handleClose}
							        aria-labelledby="alert-dialog-title"
							        aria-describedby="alert-dialog-description"
							      >
							        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
							        <DialogContent>
							          <DialogContentText id="alert-dialog-description">
							            are you sure you want to delete this employe?
							          </DialogContentText>
							        </DialogContent>
							        <DialogActions>
							          <Button onClick={handleClose} color="primary">
							            Disagree
							          </Button>
							          <Button onClick={ ()=> deleteEmpl()} color="primary" autoFocus>
							            Agree
							          </Button>
							        </DialogActions>
							      </Dialog>
			  				</td>
			  			</tr>
			  		})
			  	}
			  </tbody>
			</table>
		</div>
		</div>
		)

		}
	</>
)
}
export default Index