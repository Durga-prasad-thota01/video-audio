import React, { Component } from 'react'

export default class Nav extends Component {
    render() {
        return (
            <div>
                 <nav>
    <div class="nav-wrapper black-text white">
      <a href="#" class="brand-logo center"></a>  
      <ul id="nav-mobile" class="left hide-on-med-and-down">
     {/* <li>   <i class="code material-icons ">menu</i> </li> */} 
       <li>
      
    </li>    
      </ul>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
      {/*  <li> <i class="material-icons silver-text">notifications</i></li>   */} 
     <li><b style={{margin:"10px"}}>Demo</b></li>
     <li class=" collection-item avatar">
      <img src ="./images/pi.png" width="45px" height="45px"  class="circle" style={{marginRight:"60px",marginTop:'8px'}}/>
      </li>       
                                
      </ul>
    </div>
  </nav>

 
            </div>
        )
    }
}