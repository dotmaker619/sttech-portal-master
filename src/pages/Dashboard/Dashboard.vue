<template>
  <div class="dashboard-page">
    <h1 class="page-title"><br>&nbsp;&nbsp; Обзорная панель</h1>
    <b-row>
      <b-col lg="3" sm="6" xs="12">
        <div class="pb-xlg h-100">
          <Widget class="h-100 mb-0" title="Общее число устройств" close>
            <div class="d-flex justify-content-between align-items-center mb-lg">
              <h1>{{dashboard_nums.total_number_of_devices}}</h1>
              <i class="la  text-primary la-lg rotate-315" />
            </div>
            <!-- <h5> Модель устройств: &nbsp;&nbsp; </h5>   -->
            <div class="d-flex flex-wrap justify-content-between">                            
            </div>
          </Widget>
        </div>
      </b-col>
      <b-col lg="3" sm="6" xs="12">
        <div class="pb-xlg h-100">
          <Widget class="h-100 mb-0" title="Общее число сообщений" close>
            <highcharts :options="donut"></highcharts>
          </Widget>
        </div>
      </b-col>
      <b-col lg="3" sm="6" xs="12">
        <div class="pb-xlg h-100">
          <Widget class="h-100 mb-0" title="Батарейка" close>
                        <div class="d-flex flex-wrap justify-content-between">
              <div class="">
                <h2>{{dashboard_nums.num_of_low_bat_devices}}</h2><p class="mb-0 mc">Низкий заряд</p>
              </div>              
              <div class="">
                <h2>{{dashboard_nums.num_of_good_bat_devices}}</h2><p class="mb-0 mc">Нормальный заряд</p>
              </div>
            </div>           
          </Widget>
        </div>
      </b-col>
      <b-col lg="3" sm="6" xs="12">
        <div class="pb-xlg h-100">
          <Widget class="h-100 mb-0" title="Сообщения за сегодня" close>
            <div v-for="row in full_response" :key="row.messengerId">
              <div class="d-flex align-items-center mb-sm">
                <h5>
                <p class="width-300"> <span class='fw-semi-bold'>{{row.messengerName}}</span> отправил &nbsp;&nbsp; <span class='fw-semi-bold'>{{row.num_of_messages_for_today}}</span> сообщений </p>              
                </h5>             
              </div>
            </div>
            <!-- <div class="d-flex align-items-center mb-sm">
              <h5>
              <p class="width-300"> <span class='fw-semi-bold'>Karaker</span> отправил &nbsp;&nbsp; <span class='fw-semi-bold'>3</span> сообщений </p>              
              </h5>              
            </div>              -->
          </Widget>
        </div>
      </b-col>
   </b-row>   
    <b-row>
        <b-col xs="12">
          <Widget
            title="<h5>История <span class='fw-semi-bold'>Сообщений</span></h5>"
            bodyClass="widget-table-overflow"
            customHeader
          >
            <div class="table-responsive">
              <table class="table table-striped table-lg mb-0 requests-table">
                <thead>
                  <tr class="text-muted">
                    <th>НАЗВАНИЕ</th>
                    <th>ВРЕМЯ ПОЛУЧЕНИЯ</th>
                    <th>СТАТУС УСТРОЙСТВА</th>
                    <th>НОМЕР</th>
                    <th>СТАТУС БАТАРЕЙКИ</th>                    
                    <th>ШИРОТА</th> 
                    <th>ДОЛГОТА</th> 
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="row in all_10_messages"
                    :key="row.unixTime"
                  >
                    <td>{{row.messengerName}}</td>
                    <td>{{row.dateTimeS}}</td>
                    <td>{{row.modelId}}</td>
                    <td>{{row.messengerId}}</td>
                    <td>{{row.batteryState}}</td>
                    <td>{{row.latitude}}</td>
                    <td>{{row.longitude}}</td>                    
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
import Widget from '@/components/Widget/Widget';
import BigStat from './components/BigStat/BigStat';
import { Chart } from 'highcharts-vue';
import axios from 'axios'

export default {
  name: 'Dashboard',
  components: {
    Widget, BigStat, highcharts: Chart
  },
  data() {
    return {
      dashboard_nums: {
        total_number_of_devices: 0,
        num_of_low_bat_devices: 0,
        num_of_good_bat_devices: 0
      },
      all_10_messages: [],
      full_response: [],
      donut_nums: {
        accessories: [],
        nums: []
      }
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
          axios({url: 'http://46.101.236.239:5000/getData/all_messages', data: input_data, method: 'POST'})
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
                
                //this.messages.message.push({text: "Объект куда установлено устройство не передвигался либо устройство выключено последние 7 дней"})
            
            } else { 
                
                ans = "var 'response' has not " + prop + " property"; 
                console.log(ans);

                var resp_message = resp.data.response;                      

                console.log("function getTheDevices");
                console.log(input_data.login);                
                
                // проверяем message состоит из одного элемента или из нескольких
                if (!Array.isArray(resp_message)) {        
                  console.log("is not Array")          

                  console.log(resp_message.names);  

                  this.full_response = resp_message.names;
                  
                  
                  resp_message.names.forEach(this.myfunction)
                  
                  this.dashboard_nums.total_number_of_devices = resp_message.total_number_of_devices;
                  this.dashboard_nums.num_of_low_bat_devices = resp_message.total_number_of_low;
                  this.dashboard_nums.num_of_good_bat_devices = resp_message.total_number_of_good;
                  
                  
                  
                  //resp_message.forEach(this.MarkerDrop);
                  // this.messages.message = resp_message;
                  // console.log(this.messages.message)                
                } 
              } 
               
          })
          .catch(err => {
            console.log("Need to check something")
            console.log(err)
          })
        })
    },
    myfunction(value) {
            
      value.ten_messages.forEach(this.convertDates)
      this.all_10_messages = this.all_10_messages.concat(value.ten_messages)
      this.donut_nums.accessories.push(value.messengerName);
      this.donut_nums.nums.push(value.total_num_of_messages);
      
      console.log("myfunction donut_nums")
      console.log(this.donut_nums.nums);

      console.log("Inside myfunction")
      console.log(this.all_10_messages)
    },
    convertDates(value, index, theArray) {
      
      var date = new Date(value.dateTime);
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
    getRandomData() {
      const arr = [];

      for (let i = 0; i < 25; i += 1) {
        arr.push(Math.random().toFixed(1) * 10);
      }

      return arr;
    },
    getRevenueData() {
      
      console.log("call getRevenueData")

      const data = [];
      const seriesCount = this.donut_nums.accessories.length;
      const accessories = this.donut_nums.accessories;//['SMX', 'Direct', 'Networks'];      

      for (let i = 0; i < seriesCount; i += 1) {
        data.push({
          label: accessories[i],
          data: this.donut_nums.nums[i]//  Math.floor(Math.random() * 100) + 1,
        });
      }
      console.log(data);

      return data;
    }
  },
  computed: {
    
    donut() {
    
      let revenueData = this.getRevenueData();
      let {danger, info, primary} = this.appConfig.colors;
      let series = [
        {
          name: 'Revenue',
          data: revenueData.map(s => {
            return {
              name: s.label,
              y: s.data
            }
          })
        }
      ];
      return {
        chart: {
          type: 'pie',
          height: 120
        },
        credits: {
          enabled: false
        },
        title: false,
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: false
            },
            borderColor: null,
            showInLegend: true,
            innerSize: 60,
            size: 100,
            states: {
              hover: {
                halo: {
                  size: 1
                }
              }
            }
          }
        },
        colors: [danger, info, primary],
        legend: {
          align: 'right',
          verticalAlign: 'middle',
          layout: 'vertical',
          itemStyle: {
            color: '#495057',
            fontWeight: 100,
            fontFamily: 'Montserrat'
          },
          itemMarginBottom: 5,
          symbolRadius: 0
        },
        exporting: {
          enabled: false
        },
        series
      };
    }
  }
};
</script>

<style src="./Dashboard.scss" lang="scss" />
