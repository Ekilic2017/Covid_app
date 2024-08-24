import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const covidUrl= 'https://covid-19-statistics.p.rapidapi.com/reports'
   const headers= {
      'x-rapidapi-key': '74883c6017mshfd9b34233041822p187e6fjsn140e7142916f',
      'x-rapidapi-host': 'covid-19-statistics.p.rapidapi.com'
    }
const getData=createAsyncThunk("covid/getData",async({code,query})=>{
 //api'a gönderilecek parametreleri hazırla
   const params={iso:code,q:query};
      //covid verilerini alma
  const req1= axios.get(covidUrl,{params,headers})
  const req2 = axios.get(
    code
      ? `https://restcountries.com/v3.1/alpha/${code}`
      : `https://restcountries.com/v3.1/name/${query}`
  );
//todo api isteklerini daha verimli atma
//her iki api isteğini aynı anda paralel şekilde atıyoruz
const responses=await Promise.all([req1,req2])
//region nesnesindeki değerleri bir üst nesne ile aynı değere çıkarma
const covid={...responses[0].data.data[0]
  ,...responses[0].data.data[0].region,};
  //gereksiz değerleri kaldır
  delete covid.cities;
  delete covid.region;
  console.log(covid)
  //payloadı return ettik
return {covid,country:responses[1].data[0]};
});
export default getData