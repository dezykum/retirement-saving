import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef , Renderer2, ElementRef, ViewChild } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import * as AWS from 'aws-sdk';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { DataStoreService } from '../../services/data-store.service';
import { ActivatedRoute } from '@angular/router';



import {trigger, state, style, animate, transition, keyframes} from '@angular/animations';

@Component( {
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  animations: [
trigger('enterAnimation', [
  state('inactive', style({
    transform: 'translateY(100%)',
    opacity: 0
})),
state('active', style({
  transform: 'translateY(0%)',
  opacity: 1
})),
transition('inactive => active', animate('500ms', style({transform: 'translateY(0%)', opacity: 1}))),
transition('active => inactive', animate('500ms', style({transform: 'translateY(100%)', opacity: 0})))
])
],
  styleUrls: [ './chatbot.component.scss' ],
  encapsulation: ViewEncapsulation.Emulated
} )
export class ChatbotComponent implements OnInit {

  public message: string;
  public userMessageCollection: Array<string> = new Array;
  public chatConversation: Array<any> = new Array;
  public messageIndex: number;
  public isCaretUp: boolean;
  public isCaretDown: boolean;
  public state = 'active';
  public isStarDisabled = false;
  public intentName = '';
  public intentId = '';
  public displayStars:boolean = false;
  public displayCarousel: boolean = false;
  public carouselDataCollection = [];
  public carouselData = [];
  public selectedItem = '';
  public carouselList = [];
  public selectedIndex : any;
  public isIndexOne: boolean = false;
  public isCalender = false;
  public urlString = location.href;
  public typingStatement :boolean=false;
  public currenturl;

  paramval:{ name:String, intentnameVal: String};


  public myCredentials = new AWS.CognitoIdentityCredentials( { IdentityPoolId: 'us-east-1:2063fcc9-c31a-49bb-a2dd-c5511338e8bd' } );
    public config = new AWS.Config( {
        credentials: this.myCredentials,

        region: 'us-east-1'
    } );
    public lexUserId = 'chatbot-demo' + Date.now(); ;
    public sessionAttributes = {};
    public parameters = {
     botAlias: 'RetirementSavings',
     //botAlias: 'SetUpAndCheckDeposits',
      botName: 'RetirementSavings',
      inputText: 'HI',
      userId: this.lexUserId,
      //sessionAttributes: this.sessionAttributes
  };

  constructor( public sanetizer: DomSanitizer,  private cdr: ChangeDetectorRef, public router: Router,private route: ActivatedRoute, public dataStore: DataStoreService ) {
    AWS.config.update( this.config );

}

  ngOnInit () {
   
   this.paramval={

    name:this.route.snapshot.params['name'],
    intentnameVal:this.route.snapshot.params['intentid'],
    //faq:this.route.snapshot.params['faq']

   }


   if(typeof this.paramval.intentnameVal==="undefined"){

    this.paramval.name='Heather';
   }

  //  console.log("params" +this.route.snapshot.params['name'] + " intent" + this.paramval.intentnameVal );
  this.toggleChatBot(true);

  }

  buttonColor :string ="#ffffff";
  buttonTextColor :string ="#000000";

  buttonColor1 :string ="#ffffff";
  buttonTextColor1 :string ="#000000";

  buttonColor2 :string ="#ffffff";
  buttonTextColor2 :string ="#000000";

  buttonColor3 :string ="#ffffff";
  buttonTextColor3 :string ="#000000";

  buttonColor4 :string ="#ffffff";
  buttonTextColor4 :string ="#000000";

 button = [{ text: "Yes" },{ text: "No" }];
 welcomebutton = [];

cardButton = [];

 dayButton = [{ text: "Today" },{ text: "Yesterday" },{ text: "Earlier Than Yesterday" }];

 
  sendMessage ( postback?: any, event?: any ) {
    if ( this.message || postback ) {


      if(event!=undefined && event.srcElement.innerHTML.trim()=='Add to Cart' && this.selectedItem==''){

      }
      else{
        if ( postback ) {
          this.message = postback;
          if ( event && event.currentTarget.tagName === 'BUTTON' ) {
            
              event.target.parentNode.querySelectorAll( 'button' ).forEach( ele => {
                
                ele.disabled = true;
                if ( event.target !== ele ) {
                  ele.classList.remove( 'btn-primary' );
                  ele.classList.add( 'disabled' );
                }
              } );
          }
        } else {
          this.userMessageCollection.push( this.message );
          this.messageIndex = this.userMessageCollection.length;

		   this.chatConversation.push( {
            'from': 'user', 'message': this.message, 'timeStamp': this.getTime()
          } );
          this.getCaretPos();
        }
        this.createChatConversation();
      }
      this.message = null;
    }
  }

  onSelect(query){
    this.sendMessage(query);
  }


  accClick(accVal){
    
    if(accVal == 'Permanent Address'){
      this.message="Permanent address 1"
    }
    this.message =accVal;
    this.chatConversation.push( {
      'from': 'user', 'message': this.message
    } );
    this.sendMessage(accVal);

  }

  buttonClick(button){
    this.message =button;
    this.chatConversation.push( {
      'from': 'user', 'message': this.message
    } );
    this.sendMessage(button);

  }

  policyNameClick(policyNames){
    if(policyNames == 'Home'){
      this.message="Policy #12345 - Home"
    }
    this.message =policyNames;
   // this.buttonColor4 = '#F4F4F6';
    //this.buttonTextColor4 ='#F4F4F6';
    this.chatConversation.push( {
      'from': 'user', 'message': this.message
    } );
    this.sendMessage(policyNames);

  }


  addButtonClick(addButtons){
    this.message =addButtons;
    this.buttonColor1 = '#F4F4F6';
    this.buttonTextColor1 ='#F4F4F6';
    this.chatConversation.push( {
      'from': 'user', 'message': this.message
    } );
    this.sendMessage(addButtons);

  }


  cardButtonClick(cardButtons){
    this.message =cardButtons;
    this.buttonColor2 = '#F4F4F6';
    this.buttonTextColor2 ='#F4F4F6';

    this.chatConversation.push( {
      'from': 'user', 'message': this.message
    } );
    this.sendMessage(cardButtons);

  }


  maybeButtonClick(maybeButtons){
    this.message =maybeButtons;
    this.buttonColor3 = '#F4F4F6';
    this.buttonTextColor3 ='#F4F4F6';
    this.chatConversation.push( {
      'from': 'user', 'message': this.message
    } );
    this.sendMessage(maybeButtons);
    
  }
  
  acceptDeclineButtonClick(acceptDeclineButtons){
    this.message =acceptDeclineButtons;
    this.chatConversation.push( {
      'from': 'user', 'message': this.message
    } );
    this.sendMessage(acceptDeclineButtons);
    
  }


  buttonClick1(button){
    this.message =button.text;
    this.chatConversation.push( {
      'from': 'user', 'message': this.message
    } );
    this.sendMessage(button.postback);

  }

  radioClick1(radio1){
    this.message=radio1;
    this.chatConversation.push( {
      'from': 'user', 'message': radio1
    } );
    this.sendMessage(this.message);
  }

  policyInquirylClick(policyInquiryVal){
    this.message=policyInquiryVal;
    this.chatConversation.push( {
      'from': 'user', 'message': policyInquiryVal
    } );
    this.sendMessage(this.message);
 
  }

  addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
  changeFunc(event){
    var newdateValue=event.value;
    var newdate = newdateValue.getFullYear() + '/' +(newdateValue.getMonth() + 1) + '/' + newdateValue.getDate()
    this.sendMessage(newdate);
    this.message =newdate
    this.chatConversation.push( {
      'from': 'user', 'message': this.message

    } );

    this.message = null;
  }
  
  changeTime(event){
    var newTime = event.value;
   var  hours=this.addZero(newTime.getHours());
   var  minute=this.addZero(newTime.getMinutes());
   var amOrPm = (newTime.getHours() < 12) ? "AM" : "PM";
    var newTimeValue=hours + ":" + minute +   amOrPm;
	console.log(newTimeValue)
    this.sendMessage(newTimeValue);
    this.message = newTimeValue;
    this.chatConversation.push( {
      'from': 'user', 'message': this.message
    } );
    this.message = null;
  }


  createChatConversation () {

    const isEoc = this.message === 'call customer agent';
  const params = Object.assign( {}, this.parameters, { inputText: this.message } );

   const lexruntime = new AWS.LexRuntime();
   lexruntime.config.update( this.config );
   lexruntime.postText( params, ( err, data ) => {

  
      if ( err ) {
        console.log( 'error' + err );
    }
   if ( data ) {
      let res =JSON.stringify(data)

        this.sessionAttributes = data.sessionAttributes;
        //console.log(JSON.stringify(data)+ "new way");
        var newbotresponse = data.message;
        if(newbotresponse.includes("<br />")){
          var storedresponseValue = newbotresponse.split('<br />');
        for(var i=0; i <storedresponseValue.length; i++){

          var newValueBot;
          newValueBot = storedresponseValue[i];
            this.chatConversation.push( {
              'from': 'bot', 'message': newValueBot, 'slotToElicit': data.slotToElicit, 'intentName':data.intentName,'dialogState': data.dialogState
              
            } );
           

        }

        }

else{
  
       
		 setTimeout(()=>{
          this.chatConversation.push( {
            'from': 'bot', 'message': data.message, 'slotToElicit': data.slotToElicit, 'intentName':data.intentName,'dialogState': data.dialogState

          } );
		 }, 2000);
        
     
    }
        

    }




      let messages = [];
      let buttons = [];
      let radio = [];
	  let dropdown=[];//adeed here for dropdown



      messages.forEach( ( message, index ) => {
        if(message=="How would you rate your overall experience?"){
          this.isStarDisabled = false;
        }
        setTimeout( () => {
          //this.chatConversation.pop();
          const messageBody = {
            'from': isEoc ? 'agent' : 'bot', 'message': message, 'buttons': ( index !== 0 || messages.length === 1 ) ? buttons : undefined,
			'dropdown': ( index !== 0 || messages.length === 1 ) ? dropdown : undefined,//adeed here for dropdown
            timeStamp: this.getTime(), 'intentId': this.intentId, 'intentName': this.intentName, 'displayStars': (message==" How would you rate your overall experience?" ? true : false),
            messageIndex : index
          };

          

          
          var closeMsg = this.message;
    if ((closeMsg.toLowerCase() =='bye') || (closeMsg.toLowerCase() =='good bye')){
      this.toggleChatBot(false);
    }
    this.message = null;
    this.showResponsePreloader();

          this.chatConversation.push( messageBody );
          if ( messages.length > 1 && index + 1 < messages.length ) {
            this.showResponsePreloader();
            this.selectedIndex = 10;
          }
          this.cdr.detectChanges();
        }, isEoc ? 5000 : 2000 * ( index + 1 ) );
      } );
    } );

  }



  public getCurrentTime () {
	var nameValue= this.paramval.name.substring(0, 1).toUpperCase() + this.paramval.name.substring(1);
    const d = new Date();
    const time = d.toLocaleTimeString();
    const currentTime = { time: time, message: '' };
    if ( d.getHours() < 12 ) {
        currentTime.message = 'Good Morning '+ nameValue + '! <br/>';
    } else if ( d.getHours() <= 12 && d.getHours() < 16 ) {
        currentTime.message = 'Good Afternoon '+ nameValue + '<br/>';
    } else {
        currentTime.message = 'Good Evening '+ nameValue + '!<br/>';
    }
    return currentTime;
}

  showResponsePreloader () {
    this.chatConversation.push( {
      'from': 'bot', message: '<img class="mx-auto loader" src="./assets/images/loading.gif" />',
      timeStamp: this.getTime()
    } );
  }

  getMessageHistory ( func: string ) {
    const currentMessage = this.message;
	if(this.messageIndex ==0){
		console.log("hi");
	}
    if ( this.messageIndex > 0 && func === 'up' ||
      ( this.messageIndex >= 0 && this.messageIndex < this.userMessageCollection.length - 1 && func === 'down' ) ) {
      this.messageIndex = func === 'up' ? this.messageIndex - 1 : this.messageIndex + 1;
    }
    this.message = this.messageIndex === this.userMessageCollection.length ?
      currentMessage : this.userMessageCollection[ this.messageIndex ];
    this.getCaretPos();
  }

  getTime (): string {
    const date = new Date;
    return date.toLocaleString( 'en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    } );
  }

  getCaretPos (): void {
    this.isCaretUp = !!( this.messageIndex > 0 );
    this.isCaretDown = !!( this.userMessageCollection.length - this.messageIndex > 1 );
  }

  minimizeChatBot(value: boolean){

    if(value){
      this.state = 'active';
    }
    else{
      this.state = 'inactive';
    }

  }




  toggleChatBot(value: boolean) {
  if (value) {
     this.state = 'active';
     
     var botDefaultresponse = 'Hi there! How may I help you today?';
     // var testButton = [];
    if(this.paramval.intentnameVal==='cost'){

      botDefaultresponse= this.getCurrentTime().message  + ' '+  'Thank you for being our valuable Customer. I understand that you want to add a new car to your policy.<br />Do you still want to continue? ';
       this.welcomebutton = [{ text: "Yes",postback: 'this is test' }, {text: "No", postback: "No"}];
       var messageBody1 = {
         'from': 'bot', 'message': botDefaultresponse, 'button': this.welcomebutton, 'intentName' : 'defaultIntent'
              };
this.chatConversation.push(messageBody1);

    }
    else if(this.paramval.intentnameVal==='lostcard'){

        botDefaultresponse= this.getCurrentTime().message  + ' '+  "I understand that you lost your card and need a replacement. <br />I'll need to understand a little more about the card & recent transactions.<br/>Could you please confirm the last four digits of the card which was lost?"
        this.cardButton = [{ text: "1234" },{ text: "5678" }, { text: "None of the Above" }]; 
        if(botDefaultresponse.includes("<br />")){
          var storedValue = botDefaultresponse.split('<br />');
        for(var i=0; i <storedValue.length; i++){

          var newBot;
          newBot = storedValue[i];
          var messageBody2 = {
            'from': 'bot', 'message': newBot,'cardButton': this.cardButton, 'intentName' : 'cardIntent'
          };
          this.chatConversation.push(messageBody2);
           

        }

        }
        
        
        
        
        
      
 
      

    }
    else if (this.paramval.intentnameVal==='policy'){

      botDefaultresponse= this.getCurrentTime().message  + ' '+  'Thank you for being our valuable customer. I understand that you have a question about your policy. How may I help you?'
       var messageBody3 = {
         'from': 'bot', 'message': botDefaultresponse
       };
this.chatConversation.push(messageBody3);

    }

     if(this.chatConversation.length){ }
     else{

    setTimeout(()=>{
       this.chatConversation.push( {
         'from': 'bot', 'message': botDefaultresponse

        } );
    }, 600);
    

     }


   } else {
     this.state = 'inactive';
     this.chatConversation.length=0;
   }
 }
 ngAfterViewInit() {
  this.cdr.detectChanges();
}


selectItem(itemName,item){
  // console.log(itemName);
  this.selectedItem = itemName;
  // console.log(item);
  this.selectedIndex = item;
  // this.d1.nativeElement.insertAdjacentHTML('afterend', '<div class="two">two</div>')

}


}
