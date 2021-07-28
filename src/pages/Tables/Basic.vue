<template>
  <div class="tables-basic">
    <h2 class="page-title"><br>&nbsp;&nbsp;Мои  <span class="fw-semi-bold">Устроиства</span></h2>
    <b-row>
      <b-col>
        <Widget
          title="<h5>Список <span class='fw-semi-bold'>Устройств</span></h5>"
          customHeader settings close
        >
          <div class="table-resposive">
            <table class="table table-hover table-stripped">
              <thead>
                <tr>
                  <th class="hidden-sm-down">#</th>
                  <th>Фото</th>
                  <th>Название</th>
                  <th class="hidden-sm-down">Номер</th>
                  <th class="hidden-sm-down">Последнее сообщение</th>
                  <th class="hidden-sm-down">Батарейка</th>                                    
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in messages.message" :key="row.messengerId">
                  <td>{{row.messengerId}}</td>
                  <td>
                    <img class="img-rounded" :src="row.picture" alt="" height="100" />
                  </td>
                  <td>{{row.latest_message.messengerName}}</td>
                  <td>{{row.latest_message.messengerId}}</td>
                  <td > {{row.dateTimeS}}  </td>
                  <td v-if="row.latest_message.batteryState === 'GOOD'" > <b-badge variant="success" >НОРМАЛЬНЫЙ</b-badge> </td>   
                  <td v-else-if="row.latest_message.batteryState === 'LOW'"> <p><b-badge variant="warning" class="text-gray-dark">НИЗКИЙ</b-badge></p> </td>                            
                </tr>
              </tbody>
            </table>
          </div>          
        </Widget>
      </b-col>
    </b-row>    
  </div>
</template>

<script>
import Vue from 'vue';
import Widget from '@/components/Widget/Widget';
import Sparklines from '../../components/Sparklines/Sparklines'
import axios from 'axios'

export default {
  name: 'Tables',
  components: { Widget, Sparklines },
  data() {
    return {
      messages: {
        message: [],
        isThereData: 0
      },
      // tableStyles: [
      //   {
      //     id: 1,
      //     picture: require('../../assets/tables/1.jpg'), // eslint-disable-line global-require
      //     description: 'Palo Alto',
      //     info: {
      //       type: 'JPEG',
      //       dimensions: '200x150',
      //     },
      //     date: new Date('September 14, 2012'),
      //     size: '45.6 KB',
      //     progress: {
      //       percent: 29,
      //       colorClass: 'success',
      //     },
      //   },
      //   {
      //     id: 2,
      //     picture: require('../../assets/tables/2.jpg'), // eslint-disable-line global-require
      //     description: 'The Sky',
      //     info: {
      //       type: 'PSD',
      //       dimensions: '2400x1455',
      //     },
      //     date: new Date('November 14, 2012'),
      //     size: '15.3 MB',
      //     progress: {
      //       percent: 33,
      //       colorClass: 'warning',
      //     },
      //   },
      //   {
      //     id: 3,
      //     picture: require('../../assets/tables/3.jpg'), // eslint-disable-line global-require
      //     description: 'Down the road',
      //     label: {
      //       colorClass: 'danger',
      //       text: 'INFO!',
      //     },
      //     info: {
      //       type: 'JPEG',
      //       dimensions: '200x150',
      //     },
      //     date: new Date('September 14, 2012'),
      //     size: '49.0 KB',
      //     progress: {
      //       percent: 38,
      //       colorClass: 'inverse',
      //     },
      //   },
      //   {
      //     id: 4,
      //     picture: require('../../assets/tables/4.jpg'), // eslint-disable-line global-require
      //     description: 'The Edge',
      //     info: {
      //       type: 'PNG',
      //       dimensions: '210x160',
      //     },
      //     date: new Date('September 15, 2012'),
      //     size: '69.1 KB',
      //     progress: {
      //       percent: 17,
      //       colorClass: 'danger',
      //     },
      //   },
      //   {
      //     id: 5,
      //     picture: require('../../assets/tables/5.jpg'), // eslint-disable-line global-require
      //     description: 'Fortress',
      //     info: {
      //       type: 'JPEG',
      //       dimensions: '1452x1320',
      //     },
      //     date: new Date('October 1, 2012'),
      //     size: '2.3 MB',
      //     progress: {
      //       percent: 41,
      //       colorClass: 'primary',
      //     },
      //   },
      // ],
      checkboxes1: [false, false, false, false],
      checkboxes2: [false, false, false, false, false, false],
      checkboxes3: [false, false, false, false, false, false],
    };
  },
  created() {
    console.log("Created")
    const username = this.$store.state.user
    console.log(username)
    
    this.getTheDevices({"login": username})
      
  },
  methods: {
    getTheDevices(input_data) {
      console.log("getTheDevices")
      console.log(this.$store.state.user)
      // need to get the data 
      //   paths
      //   login
      //   phone_number
      //   latest_info
      return new Promise(() => {          
          axios({url: 'http://46.101.236.239:5000/getData/devices', data: input_data, method: 'POST'})
          .then(resp => {
            // need to check whether resp.data.response contains error
            // if response does not contain the error: 
            //  -- one gps might contain 2 or more latest messages
            //  -- 
            // if response does contain error, Need to provide explanation why
            //   В данный момент объект куда установлено устройство не передвигался либо устройство выключено последние 7 дней
            //   
            //   
            var prop = 'errors';
            var ans = "";
            var resp_message2 = resp.data.response;

            console.log(resp_message2)

            if (resp_message2.hasOwnProperty(prop)) { 
            
                ans = "var 'response' has " + prop + " property"; 
                this.messages.isThereData = 0;
                this.messages.message.push({text: "Объект куда установлено устройство не передвигался либо устройство выключено последние 7 дней"})
            
            } else { 
                this.messages.isThereData = 1;
                ans = "var 'response' has not " + prop + " property"; 
                console.log(ans);

                var resp_message = resp.data.response;                      

                console.log("function getTheDevices");
                console.log(input_data.login);                
                var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' , hour: 'numeric', minute:'numeric', second: 'numeric'};
                options.timeZone = 'Asia/Almaty';
                    //options.timeZone = 'UTC';
                    //options.timeZoneName = 'short';
                
                // проверяем message состоит из одного элемента или из нескольких
                if (Array.isArray(resp_message)) {        
                  console.log("is Array")          

                  console.log(resp_message);  
                  //this.messages.message.push(resp_message);
                  resp_message.forEach(function(value, index, thearr) {

                    var dd = new Date(value.latest_message.dateTime);
                    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' , hour: 'numeric', minute:'numeric', second: 'numeric'};
                    options.timeZone = 'Asia/Almaty';
                    
                    var formatter = new Intl.DateTimeFormat('ru-RU', options);
                    
                    var dateString = formatter.formatToParts(dd).map(({type, value}) => { 
                    
                      switch (type) {
                        case 'dayPeriod': return `<b>${value}</b>`; 
                        default : return value; 
                      } 
                    
                    }).join('');
                  
                    thearr[index].dateTimeS = dateString;  

                    if(value.latest_message.modelId == 'SPOTTRACE')
                      thearr[index].picture = require('../../assets/tables/spot_trace.png')
                    else {
                      thearr[index].picture = require('../../assets/tables/SmartOne_c.png')
                    }                    
                  })

                  this.messages.message = resp_message;//this.getUnique(resp_message, 'messengerId');
                  console.log(this.messages.message)
                
                } else {

                  console.log("is not Array")
                  console.log(this.messages.message);
                 

                  //var date = new Date(this.messages.message.dateTime);
                  // const marker = {
                  //   lng: resp_message.longitude,
                  //   lat: resp_message.latitude
                  // }
                  // this.markers.push({position: marker});
                  // this.center = marker;

                  var dd = new Date(resp_message.dateTime);
                  console.log("Year")
                  console.log(dd.getFullYear()+'-' + (dd.getMonth()+1) + '-'+dd.getDate()+ '-'+dd.getHours()+ '-'+dd.getMinutes()+ '-'+dd.getSeconds())
                  console.log(resp_message.dateTime)

                  //var date = new Date(Date.UTC(2012, 11, 20, 7, 0, 0));                  
                  console.log(new Intl.DateTimeFormat('ru-RU', options).format(dd));     
                  
                  var formatter = new Intl.DateTimeFormat('ru-RU', options);


                  var dateString = formatter.formatToParts(dd).map(({type, value}) => { 
                    switch (type) {
                      case 'dayPeriod': return `<b>${value}</b>`; 
                      default : return value; 
                    } 
                  }).join('');
                  
                  resp_message.dateTimeS = dateString;  
                  if(resp_message.modelId == 'SPOTTRACE')
                    resp_message.picture = require('../../assets/tables/spot_trace.png')
                  else {
                    resp_message.picture = require('../../assets/tables/SmartOne_c.png')
                  }
                  
                  this.messages.message.push(resp_message);   
                  console.log(this.messages.message.dateTimeS)
                }                        
            } 
               
          })
          .catch(err => {
            console.log("Need to check something")
            console.log(err)
          })
        })
    },
    getUnique(arr, comp) {

                        // store the comparison  values in array
      const unique =  arr.map(e => e[comp])
        // store the indexes of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)
        // eliminate the false indexes & return unique objects
      .filter((e) => arr[e]).map(e => arr[e]);

      return unique;
    },
    parseDate(date) {
      const dateSet = date.toDateString().split(' ');
      return `${date.toLocaleString('en-us', { month: 'long' })} ${dateSet[2]}, ${dateSet[3]}`;
    },
    checkAll(ev, checkbox) {
      const checkboxArr = (new Array(this[checkbox].length)).fill(ev.target.checked);
      Vue.set(this, checkbox, checkboxArr);
    },
    changeCheck(ev, checkbox, id) {
      this[checkbox][id] = ev.target.checked;
      if (!ev.target.checked) {
        this[checkbox][0] = false;
      }
    },
    getRandomData() {
      const result = [];

      for (let i = 0; i <= 8; i += 1) {
        result.push(Math.floor(Math.random() * 20) + 1);
      }

      return [{data: result}];
    },
    getRandomColor() {
      const {primary, success, info, danger} = this.appConfig.colors;
      const colors = [info, primary, danger, success];
      return {colors: [colors[Math.floor(Math.random() * colors.length)]]}
    }
  },
};
</script>

<style src="./Basic.scss" lang="scss" scoped />
