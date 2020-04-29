
 import React,{Component} from 'react';
import './Video.css';

 import io from 'socket.io-client';

class Video extends React.Component {
    constructor(props) {
        super(props)

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
       console.log(success)
     })

     this.socket.on('offerOrAnswer',(sdp)=>{
  this.textref.value=JSON.stringify(sdp)

  this.pc.setRemoteDescription(new RTCSessionDescription(sdp))

     })
this.socket.on('candidate', (candidate)=>{
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

      this.pc= new RTCPeerConnection(pc_config)
      this.pc.onicecandidate=(e)=>{
        if(e.candidate){
         //console.log(JSON.stringify(e.candidate))
      this.sendToPeer('candidate', e.candidate)
       }
     }
      this.pc.oniceconnectionstatechange=(e)=>{
      console.log(e)
      }

      this.pc.onaddstream=(e)=>{
        this.remoteVideoref.current.srcObject = e.stream
    
      }

   const constraints ={
     // audio:true,
     video:true
   
   }

   const success=(stream)=>{
     window.localStream = stream
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
    this.socket.emit(messageType,{
      socketID:this.socket.id,
      payload
    })
  }

  createOffer=()=>{
    console.log('Offer')
     this.pc.createOffer({offerToRecieveVideo: 1})
     .then(sdp=>{
      // console.log(JSON.stringify(sdp))
       this.pc.setLocalDescription(sdp)
       this.sendToPeer('offerOrAnswer', sdp)

         })
       }
 
         setRemoteDescription= () =>{
           const desc = JSON.parse(this.textref.value)
           this.pc.setRemoteDescription(new RTCSessionDescription(desc))
         }

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
        return (
            <div>
            <div className="row">
           


            <div class="card col s6" >
            
            <video
           
             ref={this.localVideoref}
             autoPlay> </video>
            </div>
        
          
    <br/>
            <div className="card col s6 ">
           
            <video
              ref={this.remoteVideoref}
               autoPlay> </video>
               </div>
            
               
            <div className="row">
            <div className="col s12">


            <a class="btn-floating btn-large waves-effect waves-light green" onClick={this.createOffer} ><i class="material-icons">call</i></a>

            <a class="btn-floating btn-large waves-effect waves-light red"  onClick={this.createAnswer} ><i class="material-icons">call_end</i></a>

               <br/>
               <textarea ref={ref=>{this.textref=ref}}/>
              {/*  <br/>
                <button onClick={this.setRemoteDescription}>set Remote Desc</button>
                <button onClick={this.addCandidate}>Add Candidate</button> 
              */}
              </div>
              </div>
              </div>
                </div>
        );
    }
}


export default Video;
