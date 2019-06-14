import axios from 'axios';

export default class Search{
  constructor(query){
    this.query = query;
  }

  async getResults(){
    try{
      const proxy = 'https://cors-anywhere.herokuapp.com/';
      const key = '153f3e4c1af106c7faad783be7c02376';
      const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.result = res.data.recipes;
      // console.log(this.result);
      } catch(error){
          alert(error);
      }
    }


}