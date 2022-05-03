/**
 * author: Andrew
 */
 import React from 'react';
 import Header from './Header';
 import Footer from './Footer';
 import {VscSettings}  from 'react-icons/vsc';
 
 class Delete_User extends React.Component{
     constructor(props){
         super(props);

         this.state = {
            last_name: '',
            users:[]
         }
     }

    componentDidMount(){
        fetch('http://localhost:3001/api/0.1/user/' + user_id,{
            method:'DELETE',
            headers:{
                'Content-Type':'application/json'
            },
            }).then((response) => {return response.json()})
            .then(json => alert(json.result.message)) // Prompt: either successfully deleted or not
        }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        this.setState({[name]: value});
    }

    handleSubmit = (e) => {
        let connection = mysql.createConnection(config);

        let sql = `DELETE FROM user WHERE last_name = ?`;

        connection.query(sql, this.state.last_name, (error, results, fields) => {
          if (error)
            return console.error(error.message);
        });

        connection.end();
    }
 
     render(){
        return(
         <div>
             <Header/>
             <div className='delete-user-body'>
             <form>
             <h1> Delete Users </h1>
                Delete User: <input type = "text" name = "last_name" placeholder = "Search by Last Name"
                value = {this.state.last_name} onChange = {this.handleUserInput} required></input>
                <button onClick={this.handleSubmit}><i ><VscSettings /></i></button>
             </form>
             </div>
             <Footer/>
         </div>
         );
     }
 }
 
 export default Delete_User;
