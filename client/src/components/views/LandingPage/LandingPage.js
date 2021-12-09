import axios from 'axios'
import React from 'react'
import { withRouter } from 'react-router-dom'
function LandingPage(props) {

    const onClickHandler= () =>{
        axios.get('./api/users/logout').then(response => {
            if(response.data.success){
                props.history.push("/login");
            }else{
                alert('오류가 발생했습니다. 관리자에게 문의하세요');
            }
        })
    }


    return (
        <div>
            <div style={{
                display: 'flex', justifyContent:'center', alignItems:'center', 
                width: '100%', height: '50vh'
            }}>
                <h2>START PAGE</h2>
            </div>
            <div style={{
                display: 'flex', justifyContent:'center', alignItems:'center', 
                width: '100%' }}>
                <button onClick={onClickHandler}>
                    LOGOUT
                </button>
            </div>
        </div>

    )
}

export default withRouter(LandingPage)
