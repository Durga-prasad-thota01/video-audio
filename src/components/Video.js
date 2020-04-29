
 import React,{Component} from 'react';
import './Video.css';

 import io from 'socket.io-client';

class Video extends React.Component {
    constructor(props) {
        super(props)
         this.state={
             show:false,
             hide:false
         }
        this.localVideoref = React.createRef()
        this.remoteVideoref = React.createRef()
    
        this.socket =null
        this.candidates =[]
    }
    
  componentDidMount =()=>{
    this.socket = io(
      '/webrtcPeer',
      {
        path :'/webrtc',
        query:{}
      }
    )
     this.socket.on('connection-success',success=>{
       console.log('sucess',success)
    
     })

     this.socket.on('offerOrAnswer',(sdp)=>{
  this.textref.value=JSON.stringify(sdp)
    console.log( JSON.stringify(sdp))

  this.pc.setRemoteDescription(new RTCSessionDescription(sdp))

     })
this.socket.on('candidate', (candidate)=>{
    console.log(candidate)
  this.candidates =[...this.candidates, candidate]
  this.pc.addIceCandidate(new RTCIceCandidate(candidate))

})


  // const pc_config = null
  const pc_config={
     "iceServers":[
     
       {
         urls : 'stun:stun.l.google.com:19302'
       }
     ]
  }
   console.log(pc_config)

      this.pc= new RTCPeerConnection(pc_config)
      this.pc.onicecandidate=(e)=>{
          console.log(e.candidate)
        if(e.candidate){
         //console.log(JSON.stringify(e.candidate))
      this.sendToPeer('candidate', e.candidate)
       }
     }
      this.pc.oniceconnectionstatechange=(e)=>{
      console.log(e)
      }

      this.pc.onaddstream=(e)=>{
          this.setState({show: true})
          
         console.log(e.stream)
        this.remoteVideoref.current.srcObject = e.stream

    
      }

   const constraints ={
     // audio:true,
     video:true
   
   }
   console.log(constraints)
   const success=(stream)=>{
     window.localStream = stream
     console.log(stream)
     this.localVideoref.current.srcObject = stream
     this.pc.addStream(stream)
   }
   const failure =(e)=>{
    console.log('getUserMedia Error: ', e)
   }

   //navigator.getUserMedia( constraints  ,success,failure)
   navigator.mediaDevices.getUserMedia ( constraints) 
   .then (success )
   .catch(failure )
 }

  sendToPeer = (messageType,payload)=>{
      console.log(messageType)
      console.log(payload)
    this.socket.emit(messageType,{
      socketID:this.socket.id,
      payload
    })
  }

  createOffer=()=>{
   
   this.setState({hide:true})
    console.log('Offer')
     this.pc.createOffer({offerToRecieveVideo: 1})
     .then(sdp=>{
      // console.log(JSON.stringify(sdp))
       this.pc.setLocalDescription(sdp)
       this.sendToPeer('offerOrAnswer', sdp)

         })
       }
 
        //  setRemoteDescription= () =>{
        //    const desc = JSON.parse(this.textref.value)
        //    this.pc.setRemoteDescription(new RTCSessionDescription(desc))
        //  }

         createAnswer =()=>{
           console.log('Answer')
           this.pc.createAnswer({offerToReceiveVideo:1})
           .then(sdp => {
            // console.log(JSON.stringify(sdp))
             this.pc.setLocalDescription(sdp)
             this.sendToPeer('offerOrAnswer', sdp)

           })
           }
           addCandidate=()=>{
             // const candidate =JSON.parse(this.textref.value)
             // console.log('Adding candidate:' ,candidate)
             // this.pc.addIceCandidate(new RTCIceCandidate(candidate))

             this.candidates.forEach(candidate => {
               console.log(JSON.stringify(candidate))
               this.pc.addIceCandidate(new RTCIceCandidate(candidate))
                 
             })
           }

    render() {
        console.log(this.remoteVideoref)
        return (
            <div>
            <div className="row">
           


            <div class="card col s6" >
            
            <video
           
             ref={this.localVideoref}
             autoPlay> </video>
            </div>
        
          
    <br/>
    {
      this.state.show  ? 
        <div className="card col s6 " style={{marginTop:"-13px"}}>
           
            <video 
              ref={this.remoteVideoref}
               autoPlay> </video>
               </div> 
        :
        <div className="card col s6 " style={{marginTop:"-13px"}}>
           {
               this.state.hide ?  <h1>Loading...</h1> :" "
           }
       
               </div>

    }
            
            
               
            <div className="row">
            <div className="col s12"  style={{display:"flex"}}>


            <a class="btn-floating btn-large waves-effect waves-light green" onClick={this.createOffer} ><i class="material-icons">call</i></a><br/>

            <a class="btn-floating btn-large waves-effect waves-light red"  onClick={this.createAnswer} ><i class="material-icons">call_end</i></a>

               
              
              {/*  <br/>
                <button onClick={this.setRemoteDescription}>set Remote Desc</button>
                <button onClick={this.addCandidate}>Add Candidate</button> 
              */}
              </div>
              <textarea ref={ref=>{this.textref=ref}}/>
              </div>
              </div>
                </div>
        );
    }
}


export default Video;
