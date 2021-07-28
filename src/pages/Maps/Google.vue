<template>
  <div class="tables-basic">    
    <b-container fluid class="container-fluid p-0">
    <b-row no-gutters class="mt-0">
      <b-col cols="4">
        <Widget
          title="<h5> Последние <span class='fw-semi-bold'>Сообщения</span></h5><p><p>" customHeader>
          <!-- customHeader settings close -->           
          
          <div  class="table-responsive">
            <p v-if = "messages.isThereData === 0"><b-badge variant="warning" class="text-gray-dark">Объект куда установлено устройство не передвигался  либо устройство выключено <br>последние 7 дней</b-badge></p>
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th class="hidden-sm-down">Имя</th>                  
                  <th class="hidden-sm-down">Батарейка</th>
                  <th class="hidden-sm-down">Информация</th> 
                </tr>
              </thead>
              <tbody>

                <tr v-for="row in messages.message" :key="row.messengerId">
                  <td> {{row.latest_message.messengerName}} </td>
                  <td v-if="row.latest_message.batteryState === 'GOOD'"> <b-badge variant="success">Нормальная</b-badge> </td>
                  <td v-else-if="row.latest_message.batteryState === 'LOW'"> <p><b-badge variant="warning" class="text-gray-dark">Низкая</b-badge></p> </td>                  
                  <td>                    
                      <p class="mb-0">
                        <small>
                          <span class="fw-semi-bold">Модель устройства:</span>
                          <span class="text-muted">&nbsp; {{  row.latest_message.modelId }}</span>
                        </small>
                      </p>
                      <p class="mb-0">
                        <small>
                          <span class="fw-semi-bold">Широта:</span>
                          <span class="text-muted">&nbsp; {{ row.latest_message.latitude }}</span>                        
                        </small>
                      </p>                    
                      <p class="mb-0">
                        <small>
                          <span class="fw-semi-bold">Долгота:</span>
                          <span class="text-muted">&nbsp; {{ row.latest_message.longitude }}</span>                        
                        </small>
                      </p>                     
                      <p class="mb-0">
                        <small>
                          <span class="fw-semi-bold">Номер устройства: </span>
                          <span class="text-muted">&nbsp; {{ row.latest_message.messengerId }}</span>                        
                        </small>
                      </p>
                      <p class="mb-0">
                        <small>
                          <span class="fw-semi-bold">Время получения данных: </span>
                          <span class="text-muted">&nbsp; {{ row.dateTimeS  }}</span>                        
                        </small>
                      </p>
                  </td>                  
                </tr> 
              </tbody>
            </table>
          </div>
          <!-- <div class="clearfix">
            <div class="float-right">
              <b-button variant="default" class="mr-xs" size="sm" v-on:click="addZabor" v-if="paths.length<1">Добавить гео-ограждение</b-button>
              <b-button variant="default" class="mr-xs" size="sm" v-on:click="removeZabor" v-else>Удалить гео-ограждение</b-button>              
            </div>            
          </div> -->
        </Widget>
      </b-col>
      <b-col cols="8">        
        <div class="mapContainer">
          <GmapMap
            :center="center"
            :zoom="16"
            map-type-id="hybrid"            
            style="width: 100%; height: 100vh"
            :options="{
              zoomControl: true,
              mapTypeControl: false,
              mapTypeControlOptions: true,
              scaleControl: false,
              rotateControl: false,
              fullscreenControl: true,
              disableDefaultUI: true
            }"
          >
            <gmap-polygon :paths="paths" :editable="true" @paths_changed="updateEdited($event)">
            </gmap-polygon>
            <ul v-if="edited" @click="edited = null">
              <li v-for="(path, index1) in edited" :key="index1">
                <ol>
                  <li v-for="(point, index) in path" :key="index">
                    {{point.lat}}, {{point.lng}}
                  </li>
                </ol>
              </li>
            </ul>
          <GmapMarker 
          :key="index"
          v-for="(m, index) in markers" 
          :position="m.position"
          @click="center=m.position"         
          />
          </GmapMap>
        </div>
      </b-col>
    </b-row>
    </b-container>
  </div>
</template>

<script>
import Vue from 'vue';
import Widget from '@/components/Widget/Widget';
import Sparklines from '../../components/Sparklines/Sparklines'
import axios from 'axios'


export default {
  name: 'GoogleMap',
   components: { Widget, Sparklines},
  data() {
    return {
      edited: null,      
      sanfrancisco: [37.78268, -122.41136],
      markers: [],
      center: {lat: 51.1605, lng:71.4704}, //51.1605° N, 71.4704° E
      currentPlace: null,
      messages: {
        message: [],
        isThereData: 0
      },      
         // "response": {
            //     "feedMessageResponse": {
            //         "count": 2,
            //         "feed": {
            //             "id": "0RGsKPjXg2g6lBqaaSVjn8lc6U1KXdHO6",
            //             "name": "VSE",
            //             "description": "VSE",
            //             "status": "ACTIVE",
            //             "usage": 0,
            //             "daysRange": 7,
            //             "detailedMessageShown": true,
            //             "type": "SHARED_PAGE"
            //         },
            //         "totalCount": 2,
            //         "activityCount": 0,
            //         "messages": {
            //             "message": [
            //                 {
            //                     "@clientUnixTime": "0",
            //                     "id": 1451654312,
            //                     "messengerId": "0-2502422",
            //                     "messengerName": "Karaker",
            //                     "unixTime": 1597619705,
            //                     "messageType": "STOP",
            //                     "latitude": 50.53737,
            //                     "longitude": 76.03825,
            //                     "modelId": "SPOTTRACE",
            //                     "showCustomMsg": "Y",
            //                     "dateTime": "2020-08-16T23:15:05+0000",
            //                     "batteryState": "GOOD",
            //                     "hidden": 0,
            //                     "altitude": 455
            //                 },
            //                 {
            //                     "@clientUnixTime": "0",
            //                     "id": 1451771148,
            //                     "messengerId": "0-4419326",
            //                     "messengerName": "Moxorka",
            //                     "unixTime": 1597642152,
            //                     "messageType": "UNLIMITED-TRACK",
            //                     "latitude": 50.53604,
            //                     "longitude": 76.03474,
            //                     "modelId": "SPOTTRACE",
            //                     "showCustomMsg": "Y",
            //                     "dateTime": "2020-08-17T05:29:12+0000",
            //                     "batteryState": "GOOD",
            //                     "hidden": 0,
            //                     "altitude": 434
            //                 }
            //             ]
            //         }
            //     }
            // }

      
      paths: [          
          //[ {lat: 1.382, lng: 103.802}, {lat:1.382, lng: 103.808}, {lat: 1.388, lng: 103.808}, {lat: 1.388, lng: 103.802} ],
          //
      ],
       
      phone_number: "0"
    };
  },   
  created() {
    console.log("Created")
    const username = this.$store.state.user
    console.log(username)
    
    this.getTheDevices({"login": username})
        
    console.log('Messages')
    console.log(this.messages.message[0])
      
  },
  methods: {
      
    getThePaths(input_data) {
      // need to get the data 
      //   paths
      //   login
      //   phone_number
      //   latest_info
      return new Promise(() => {          
          axios({url: 'http://46.101.236.239:5000/getData/paths', data:input_data, method: 'POST'})
          .then(resp => {
            this.paths = resp.data.paths;
            let login = resp.data.login;

            console.log(this.paths);
            console.log(login);
            
          })
          .catch(err => {
            console.log("Need to check something")
            console.log(err)
          })
        })

    },
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
            var resp_message2 = resp.data;

            console.log(resp_message2)

            if (resp_message2.hasOwnProperty(prop)) { 
            
                ans = "var 'response' has " + prop + " property"; 
                this.messages.isThereData = 0;
                this.messages.message.push({text: "Объект куда установлено устройство не передвигался либо устройство выключено последние 7 дней"})
            
            } else { 
                this.messages.isThereData = 1;
                ans = "var 'response' has not " + prop + " property"; 
                console.log(ans);

                //var resp_message = resp.data.response.feedMessageResponse.messages.message;                      
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
                  resp_message.forEach(this.myfunction)

                  //resp_message = this.getUnique(resp_message, 'messengerId');
                  resp_message.forEach(this.MarkerDrop);
                  this.messages.message = resp_message;
                  console.log(this.messages.message)
                
                } else {

                  console.log("is not Array")
                  console.log(this.messages.message);                 

                  //var date = new Date(this.messages.message.dateTime);
                  const marker = {
                    lng: resp_message.longitude,
                    lat: resp_message.latitude
                  }
                  
                  this.markers.push({position: marker});
                  this.center = marker;

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
    MarkerDrop(value) {      // latitude and longitude are inside the latest_message
      const marker = {
        lat: parseFloat(value.latest_message.latitude),
        lng: parseFloat(value.latest_message.longitude)
      }
      
      this.markers.push({position: marker});
      this.center = marker;
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
    myfunction(value, index, theArray) { 

      console.log("function myfunction")
      console.log(value)      
     
      //var date = new Date(Date.UTC(2012, 11, 20, 7, 0, 0));
      var date = new Date(value.latest_message.dateTime);
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' , hour: 'numeric', minute:'numeric', second: 'numeric'};
      options.timeZone = 'Asia/Almaty';

      // Запрашиваем день недели вместе с длинным форматом даты                    
      console.log(new Intl.DateTimeFormat('ru-RU', options).format(date));     
      
      var formatter = new Intl.DateTimeFormat('ru-RU', options);

      var dateString = formatter.formatToParts(date).map(({type, value}) => { 
        switch (type) {
          case 'dayPeriod': return `<b>${value}</b>`; 
          default : return value; 
        } 
      }).join('');
      
      theArray[index].dateTimeS = dateString;                                                           
    },
    updateEdited(mvcArray) {
      console.log("updateEdited")
      let paths = [];
      for (let i=0; i<mvcArray.getLength(); i++) {
        let path = [];
        for (let j=0; j<mvcArray.getAt(i).getLength(); j++) {
          let point = mvcArray.getAt(i).getAt(j);
          path.push({lat: point.lat(), lng: point.lng()});
        }
        paths.push(path);
      }
      this.edited = paths;

      console.log(paths[0].length)

      this.senddata({login: this.$store.state.user, paths: paths[0]})

      //let flag = this.isLatLngInZone(paths[0], this.tableStyles.feedMessageResponse.messages.message[0].latitude, this.tableStyles.response.feedMessageResponse.messages.message[0].longitude);
      //console.log(flag);

      // if flag == 0 then send sms to phone number
    },
    senddata(data_to_send) {
        return new Promise(() => {          
          axios({url: 'http://46.101.236.239:5000/data/paths', data: data_to_send, method: 'POST'})
          .then(resp => {
            let result_text = resp.data.result;

            console.log(result_text);
            
          })
          .catch(err => {
            console.log("Need to check something")
            console.log(err)
          })
        })
        // send axios request, pass login and paths
      // if response is success then everything is great
      // 
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
    },
    geolocate: function () {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    },
    dropMarkers() {
      console.log(" function dropMarker ")
       this.tableStyles.feedMessageResponse.messages.message.forEach(this.myfunction);
    },    

    addZabor() {
      this.paths.push({lat: this.center.lat, lng: this.center.lng});
      this.paths.push({lat: this.center.lat + 0.001, lng: this.center.lng});
      this.paths.push({lat: this.center.lat + 0.001, lng: this.center.lng+0.001});
      this.paths.push({lat: this.center.lat, lng: this.center.lng+0.001});
    },
    removeZabor() {
      this.paths = [];
      this.senddata({"login": this.$store.state.user, "paths": this.paths })
    },

    IsPointInsidePolygon (p, x,  y) {
      
      let i1, i2, n, N, S, S1, S2, S3, flag;
      console.log(p);
      N = p.length;

      for (n = 0; n < N; n++) {

        flag = 0;
        i1 = n < N-1 ? n + 1 : 0;
        console.log('While loop has started')
        console.log(x);
        console.log(y);
        while (flag == 0) {

          console.log('While loop inside')
          console.log(p[i1].lat);
          console.log(p[i1].lng);

          i2 = i1 + 1;
          if (i2 >= N) { i2 = 0; }
          if (i2 == (n < N-1 ? n + 1 : 0)) { break; }

          S = Math.abs (p[i1].lat * (p[i2].lng - p[n ].lng) + p[i2].lat * (p[n ].lng - p[i1].lng) +  p[n].lat  * (p[i1].lng - p[i2].lng));
          S1 = Math.abs (p[i1].lat * (p[i2].lng - y) + p[i2].lat * (y - p[i1].lng) + x * (p[i1].lng - p[i2].lng));
          S2 = Math.abs (p[n ].lat * (p[i2].lng - y) + p[i2].lat * (y - p[n ].lng) + x * (p[n ].lng - p[i2].lng));
          S3 = Math.abs (p[i1].lat * (p[n ].lng - y) + p[n ].lat * (y - p[i1].lng) + x * (p[i1].lng - p[n ].lng));
          
          if (S == S1 + S2 + S3) {
            flag = 1;
            break;
          }
          
          i1 = i1 + 1;
          if (i1 >= N) { i1 = 0; break;}
          
        }
        if (flag == 0) { break; }
      }
      return flag;
    },
    isLatLngInZone(latLngs,lat,lng) {
      // latlngs = [{"lat":22.281610498720003,"lng":70.77577162868579},{"lat":22.28065743343672,"lng":70.77624369747241},{"lat":22.280860953131217,"lng":70.77672113067706},{"lat":22.281863655593973,"lng":70.7762061465462}];
      let vertices_y = new Array();
      let vertices_x = new Array();

      let longitude_x = lng;
      let latitude_y = lat;

      //latLngs = JSON.parse(latLngs);

      var r = 0;
      var i = 0;
      var j = 0;
      var c = 0;
      var point = 0;

      for(r=0; r<latLngs.length; r++){
        vertices_y.push(latLngs[r].lat);
        vertices_x.push(latLngs[r].lng);
      }

      let points_polygon = vertices_x.length;
      
      for(i = 0, j = points_polygon; i < points_polygon; j = i++){
        point = i;
        if(point == points_polygon)
          point = 0;
        if ( ((vertices_y[point]  >  latitude_y != (vertices_y[j] > latitude_y)) && (longitude_x < (vertices_x[j] - vertices_x[point]) * (latitude_y - vertices_y[point]) / (vertices_y[j] - vertices_y[point]) + vertices_x[point]) ) )
          c = !c;
      }
        return c;
    }
  },
  mounted() {
    
    //this.dropMarkers();
    //this.geolocate();
    //  console.log(this.center.lng + 0.01)    
    
    //let flag = this.IsPointInsidePolygon(this.paths, this.tableStyles.response.feedMessageResponse.messages.message[0].latitude);
    //console.log(flag);

    //this.getThePaths({"login": "yessen "});
  }

};
</script>

<style src="./Google.scss" lang="scss" scoped />
