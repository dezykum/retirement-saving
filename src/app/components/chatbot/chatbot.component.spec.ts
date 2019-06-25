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
  public isvideo: boolean = false;
  public isCalender = false;
  public urlString = location.href;
  public typingStatement :boolean=false;
  public currenturl;

  paramval:{ name:String, intentnameVal: String};


  public myCredentials = new AWS.CognitoIdentityCredentials( { IdentityPoolId: 'us-east-1:8ffa13fa-7b21-44b2-a598-9b35a7f6c5a8' } );
    public config = new AWS.Config( {
        credentials: this.myCredentials,
        

        region: 'us-east-1'
    } );
    public lexUserId = 'chatbot-demo' + Date.now(); ;
    public sessionAttributes = {};
    public parameters = {
      botAlias: 'STAgent',
      botName: 'SunTrustAgent',
      inputText: 'HI',
      userId: this.lexUserId,
      //sessionAttributes: this.sessionAttributes
  };


  // @ViewChild('carouselGuide') d1:ElementRef;

  // constructor( private http: Http, private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef,
  // private elRef: ElementRef, private renderer: Renderer2) {
  //   this.sendMessage( 'Hi! this is banking chatbot' );
  //   AWS.config.update( this.config );
  // }
  constructor( public sanetizer: DomSanitizer,  private cdr: ChangeDetectorRef, public router: Router,private route: ActivatedRoute, public dataStore: DataStoreService ) {
    AWS.config.update( this.config );
    //this.sendMessage( 'Hi! this is banking chatbot' );

}

  ngOnInit () {
   //console.log( window.performance.getEntries())
   //console.log(PerformanceMeasure);





   this.paramval={

    name:this.route.snapshot.params['name'],
    intentnameVal:this.route.snapshot.params['intentid'],
    //faq:this.route.snapshot.params['faq']

   }








   if(typeof this.paramval.intentnameVal==="undefined"){

    this.paramval.name='John';
   }

   console.log("params" +this.route.snapshot.params['name'] + " intent" + this.paramval.intentnameVal );
  this.toggleChatBot(true);

  // if(this.paramval.intentnameVal === "CheckDepositStatus"){
  //   this.sendMessage('this is an ivr flow');
  // }else if ( (this.paramval.intentnameVal === "SetupPayments")){
  //   this.sendMessage('loan mortgage ivr flow starts here');
  // }
  //   var abc=this.message;
  //   console.log(abc);
  //   if(this.userMessageCollection.length ===0){
  //

  //   }
  //   this.sendMessage(abc);
  //   console.log(this.sendMessage(abc));
  // }




  }

 button = [{ text: "Yes" },{ text: "No" }];
 welcomebutton = [];
 accNum = [{ text: "5699" },{ text: "5482" }];
 radio1 = [{ text: "6125437-Mortgage Account Number" },{ text: "2141587- Mortgage Account Number" }];
 radio = [{ text: "$1800(Minimum Payment)" },{ text: "$2100(Minimum payment + 1 extra annual payment to shorten the mortgage to 25 years)" },
 { text: "$2400(Minimum payment + 2 extra annual payments to shorten the mortgage to 20 years)" }];


  sendMessage ( postback?: any, event?: any ) {




    if ( this.message || postback ) {


      if(event!=undefined && event.srcElement.innerHTML.trim()=='Add to Cart' && this.selectedItem==''){

      }
      else{
        if ( postback ) {
          this.message = postback;
          if ( event && event.currentTarget.tagName === 'BUTTON' ) {
            // console.log("event: ",event.srcElement.innerHTML.trim());

              event.target.parentNode.querySelectorAll( 'button' ).forEach( ele => {
                // console.log("button : ", ele.innerHTML)
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

  buttonClick1(button){
    this.message =button.text;
    this.chatConversation.push( {
      'from': 'user', 'message': this.message
    } );
    this.sendMessage(button.postback);

  }

  radioClick(radio){
    if(radio == '$2100(Minimum payment + 1 extra annual payment to shorten the mortgage to 25 years)'){
      this.message="option two"
    }
    this.chatConversation.push( {
      'from': 'user', 'message': radio
    } );
    radio =this.message;
    this.sendMessage(radio);
    console.log(this.sendMessage(radio));
  }


  radioClick1(radio1){
    if(radio1 == '6125437-Mortgage Account Number'){
      this.message="6125437"
    }else if(radio1 == '2141587- Mortgage Account Number'){
      this.message="2141587"
    }
    this.chatConversation.push( {
      'from': 'user', 'message': radio1
    } );
    radio1 =this.message;
    this.sendMessage(radio1);
   // console.log(this.sendMessage(radio1));
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
  parseFunc(event){
    var newdateValue=event.value;
    var newdate = newdateValue.getDate()
    if (newdate===11 || newdate===12 || newdate===13){
      newdate= newdate + 'th'
    }else{
    var lastDigit = newdate % 10;

      if(lastDigit === 1){
        newdate= newdate + 'st'
      } else if(lastDigit === 2){
        newdate= newdate + 'nd'
      } else if (lastDigit === 3){
        newdate= newdate + 'rd'
      } else if (lastDigit === 0 || lastDigit > 3){
        newdate= newdate + 'th'
      }
    }
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
    var newTimeValue=hours + ":" + minute;
    this.sendMessage(newTimeValue);
    this.message = newTimeValue;
    this.chatConversation.push( {
      'from': 'user', 'message': this.message
    } );
    this.message = null;
  }


  createChatConversation () {

    //const url = 'https://api.api.ai/v1/query?v=20150910';


    if(this.selectedItem!=='' && this.message=='add to cart'){
      this.message ="please add "+this.selectedItem+" to my cart";
    }
    if(this.message=='submit'){
        this.message ="Added "+this.selectedItem+" of $100 to my cart";
        this.selectedItem = ''
    }
    //this.message = null;
    // console.log("message in query: ",this.message)
   // const body = { 'query': this.message, 'lang': 'en', 'sessionId': 1234567890 };
   // const headers = new Headers( {
      //'Content-Type': 'application/json',
    //  'Authorization': 'Bearer ebf0b4b9fa244009be929464ef166b9b'  // client access token
    //} );
    //const options = new RequestOptions( { headers: headers } );
    const isEoc = this.message === 'call customer agent';



   // this.http.post( url, body, options ).subscribe( data => {


   const params = Object.assign( {}, this.parameters, { inputText: this.message } );

   const lexruntime = new AWS.LexRuntime();
   lexruntime.config.update( this.config );
   lexruntime.postText( params, ( err, data ) => {

   // lexruntime.postText( params, ( err, data ) => {
    //this.http.post( params, null, null ).subscribe( data => {
      if ( err ) {

        console.log( 'error' + err );
    }
   if ( data ) {
      let res =JSON.stringify(data)

        this.sessionAttributes = data.sessionAttributes;
        console.log(JSON.stringify(data)+ "new way");
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
     }, 1000);
    }
        // this.chatConversation.push( {
        //   'from': 'bot', 'message': data.message, 'slotToElicit': data.slotToElicit, 'intentName':data.intentName
        // } );


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

          if( (this.intentName==('connect_live_agent') && messageBody.messageIndex == 1 ) ){
            messageBody.from = 'live_agent'
          }

          if(this.intentName=='check_store_location-submit'){
            // console.log("intent name : ",this.intentName)
            // this.d1.nativeElement.insertAdjacentHTML('afterend', '<div class="two">two</div>')
          }
          var closeMsg = this.message;
    if ((closeMsg.toLowerCase() =='bye') || (closeMsg.toLowerCase() =='good bye')){
      this.toggleChatBot(false);
    }
    this.message = null;
    this.showResponsePreloader();


          // console.log("messagebody star status : ",messageBody.displayStars)
          this.chatConversation.push( messageBody );
          // this.cdr.detectChanges();
          if ( messages.length > 1 && index + 1 < messages.length ) {
            this.showResponsePreloader();
            this.selectedIndex = 10;
          }
          this.cdr.detectChanges();
        }, isEoc ? 5000 : 2000 * ( index + 1 ) );
      } );
    } );

console.log("chat Conversation index: ",this.chatConversation.length-1)
  }



  public getCurrentTime () {
    const d = new Date();
    const time = d.toLocaleTimeString();
    const currentTime = { time: time, message: '' };
    if ( d.getHours() < 12 ) {
        currentTime.message = 'Good Morning '+ this.paramval.name + '! <br/>';
    } else if ( d.getHours() <= 12 && d.getHours() < 16 ) {
        currentTime.message = 'Good Afternoon '+ this.paramval.name + '<br/>';
    } else {
        currentTime.message = 'Good Evening '+ this.paramval.name + '!<br/>';
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
     var botDefaultresponse= this.getCurrentTime().message  + ' '+  'Thank you for being our valuable Customer. I see you just used our online portal to look at your accounts. <br/><br/>Is there something I can help with, today?'
     // var testButton = [];
    if(this.paramval.intentnameVal==='SetupPayments'){

      botDefaultresponse= this.getCurrentTime().message  + ' '+  'Thank you for being our valuable Customer. I understand that you want to setup autopayments.Do you still want to continue?<br/><br/>';
       this.welcomebutton = [{ text: "Yes",postback: 'loan mortgage ivr flow starts here' }, {text: "No", postback: "No"}];
       var messageBody1 = {
         'from': 'bot', 'message': botDefaultresponse, 'button': this.welcomebutton, 'intentName' : 'defaultIntent'
              };
this.chatConversation.push(messageBody1);

    }
    else if(this.paramval.intentnameVal==='CheckDepositStatus'){

        botDefaultresponse= this.getCurrentTime().message  + ' '+  'I understand that you want to know about the check deposits. Do you still want to continue?<br/><br/>'
        // buttons.push({text:'yes', postback: 'yes'},{text:'no', postback: 'no'});
         this.welcomebutton = [{ text: "Yes",postback: 'this is an ivr flow' },{text: "No", postback: "No"}];
         var messageBody2 = {
           'from': 'bot', 'message': botDefaultresponse, 'welcomebutton': this.welcomebutton, 'intentName' : 'defaultIntent'
         };
  this.chatConversation.push(messageBody2);
      // botDefaultresponse= this.getCurrentTime().message  + ' '+  'Thank you for being our valuable Customer. I understand you want to know about check deposits and I will help you.'

    }

     if(this.chatConversation.length){ }
     else{

    setTimeout(()=>{
       this.chatConversation.push( {
         'from': 'bot', 'message': botDefaultresponse

        } );
    }, 1500);
    //    if(this.currenturl == "http://localhost:4200/abc"){
    //      console.log("firebase url");
    //      setTimeout(()=>{
    //        this.chatConversation.push( {
    //          'from': 'bot', 'message': botDefaultresponse

    //        } );
    //   }, 1500);
    //   this.chatConversation.push( {
    //    'from': 'bot', 'message': 'I wanted to know why I had not seen a check deposit post yet'

    //  } );

    //    }

    //    if(this.currenturl == "http://localhost:4200/def"){
    //      setTimeout(()=>{
    //        this.chatConversation.push( {
    //          'from': 'bot', 'message': 'Hello! How can I help you with your mortgage today?'

    //        } );
    //   }, 1500);
    //   this.chatConversation.push( {
    //    'from': 'bot', 'message': 'I got a mail that SunTrust has aquired my loan and I need to set up automatic payments.'

    // } );

    //    }



     }


   } else {
     this.state = 'inactive';
     this.chatConversation.length=0;
   }
 }
 ngAfterViewInit() {
  this.cdr.detectChanges();
}

onStarClick(e){
  this.isStarDisabled = true;
  // console.log(e.rating);
  if(e.rating==5){
    this.sendMessage('5 star' );
  }
  else{
    this.sendMessage('not 5 star' );
  }
}

/*onCarouselClick(query){
  // console.log(query)
  this.sendMessage(query);
}

getCarouselData(intentName){
  // this.carouselData.length=0;
if(intentName==="order-refrigerator"){
this.carouselData.length=0;
  for(var i = 0; i<3; i++){
    this.carouselData[i] = this.carouselDataCollection[i];
  }
  // console.log(this.carouselData)
}
if(intentName==="order-Dishwashers"){
  this.carouselData.length=0;
  for(var i = 0; i<3; i++){
    this.carouselData[i] = this.carouselDataCollection[i+3];
  }
  // console.log(this.carouselData)
}
if(intentName==="order-microwave"){
  this.carouselData.length=0;
  for(var i = 0; i<3; i++){
    this.carouselData[i] = this.carouselDataCollection[i+6];
  }
  // console.log(this.carouselData)
}
this.displayCarousel = true;
}*/

selectItem(itemName,item){
  // console.log(itemName);
  this.selectedItem = itemName;
  // console.log(item);
  this.selectedIndex = item;
  // this.d1.nativeElement.insertAdjacentHTML('afterend', '<div class="two">two</div>')

}




}
