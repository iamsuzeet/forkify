import axios from 'axios';
import { key , proxy} from '../config';

export default class Recipe {
  constructor(id){
    this.id = id;
  }

  async getRecipe(){
    try{
      const res = await axios(`${proxy}https://www.food2fork.com/api/get/?key=${key}&rId=${this.id}`);
      // console.log(res.data.recipe.ingredients);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
      
    } catch(err) {
      console.log(err);
      alert('Something went wrong :(');    
    }
  }

  calcTime(){
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings(){
    this.servings = 4;
  }

  parseIngredients(){
    const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
    const unitsShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
    const units = [...unitsShort, 'kg','g'];
    const newIngredients = this.ingredients.map(el => {
        
        // 1) Uniform units
        let ingredient = el.toLowerCase();
        unitsLong.forEach((unit, i) => {
          ingredient = ingredient.replace(unit,unitsShort[i]);
        });

        // 2) Remove parenthesis
        ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

        // 3) Parse ingredients into count,unit and ingredient
        const arrIng = ingredient.split(' ');
        const unitIndex = arrIng.findIndex(e12 => units.includes(e12));
        // console.log(unitsShort);

        let objIng;
        if(unitIndex > -1){
          //there is a unit
          //ex 1 1/2 cup (arrCount = 1 1/2)
          //ex 4 cupts , (arrCount = 4)
          const arrCount = arrIng.slice(0, unitIndex);
          // console.log(arrCount);
          let count;
          if(arrCount.length === 1){
            count = eval(arrIng[0].replace('-','+'));
          } else{
            count = eval(arrIng.slice(0, unitIndex).join('+'));
          }

          objIng = {
            count,
            unit:arrIng[unitIndex], 
            ingredient: arrIng.slice(unitIndex + 1).join(' ')
          }
        } else if(parseInt(arrIng[0],10)) {
          //there is no unit but 1st element is number
          objIng = {
            count: parseInt(arrIng[0],10),
            unit: '',
            ingredient: arrIng.slice(1).join(' ')
          }
        } else if(unitIndex === -1){
          //there is no unit and no number in 1st position
          objIng = {
            count:1,
            unit: '',
            ingredient
          }
        }
        // console.log(objIng);
        return objIng;
        
    });
    this.ingredients = newIngredients;
    // console.log(this.ingredients);
  }

  updateServings(type){
    //servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

    //ingredients
    this.ingredients.forEach(ing => {
      ing.count *= (newServings / this.servings);
    })

    this.servings = newServings;

  }
}