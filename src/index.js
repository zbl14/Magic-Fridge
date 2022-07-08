import $ from "jquery";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/styles.css";
import RecipeService from "./services/recipes-service";

let ingredient = "";
let health, cuisineType, mealType;

async function makeApiCall() {
  const response = await RecipeService.getRecipe(
    ingredient,
    health,
    cuisineType,
    mealType
  );
  getElements(response);
}

function getElements(response) {
  if (response.hits) {
    if (response.hits.length == 0) {
      $(".showErrors").text(
        `Sorry, we couldn't find a recipe based on your selection. Please try something else. `
      );
    } else {
      for (let i = 0; i < response.hits.length; i++) {
        $(".showRecipes").append(`
        <div class="card border-info mb-3" ">
          <img src="${
            response.hits[i].recipe.images.REGULAR.url
          }" class="card-img-top" alt="a photo of meal">
          <div class="card-body">
            <h5 class="card-title">${response.hits[i].recipe.label}</h5>
            <p class="card-text">Total time: ${
              response.hits[i].recipe.totalTime
            } mins</p>
            <p class="card-text">Total calories: ${parseFloat(
              response.hits[i].recipe.calories
            ).toFixed(2)}</p>
            <p class="card-text">Total Fat: ${parseInt(
              response.hits[i].recipe.totalNutrients.FAT.quantity
            )}${response.hits[i].recipe.totalNutrients.FAT.unit}</p>
            <p class="card-text">Total Carbs: ${parseInt(
              response.hits[i].recipe.totalNutrients.CHOCDF.quantity
            )}${response.hits[i].recipe.totalNutrients.CHOCDF.unit}</p>
            <p class="card-text">Total Protein: ${parseInt(
              response.hits[i].recipe.totalNutrients.PROCNT.quantity
            )}${response.hits[i].recipe.totalNutrients.PROCNT.unit}</p>
            <div class="ingredientListTitle">
              <p>Ingredient List</p>
              <div id="showIngredient${i}" class="ingredientList"> 
              </div>
            </div>  
            <a href="${response.hits[i].recipe.url}" 
            class="btn btn-info center">See full recipe</a>
          </div>
        </div>
        `);
        let ingredientArr = response.hits[i].recipe.ingredientLines;
        let ingredientStr = `<ul><li> ${ingredientArr.join(
          "</li><li>"
        )} </li></ul>`;
        $(`#showIngredient${i}`).append(`${ingredientStr}`);
      }
    }
  } else {
    $(".showErrors").text(
      `There was an error processing your request: ${response}`
    );
  }
}

let clearFields = () => {
  ingredient = "";
  health = $("#health").val("");
  cuisineType = $("#cuisineType").val("american");
  mealType = $("#mealType").val("breakfast");
  $(".showErrors").text("");
};

$(document).ready(function () {
  $("h5#instruction").click(function () {
    $(".instruction").slideToggle();
  });
  $("h3#Vegetable").click(function () {
    $(".vegetables").slideToggle();
  });
  $("h3#Beef").click(function () {
    $(".beef").slideToggle();
  });
  $("h3#Pork").click(function () {
    $(".pork").slideToggle();
  });
  $("h3#Poultry").click(function () {
    $(".poultry").slideToggle();
  });
  $("h3#Fish").click(function () {
    $(".fish").slideToggle();
  });
  $("h3#ShellFish").click(function () {
    $(".shellfish").slideToggle();
  });
  $("h3#Dairy").click(function () {
    $(".dairyProducts").slideToggle();
  });
  $("h3#Grain").click(function () {
    $(".grain").slideToggle();
  });
  $("#submit").click(function () {
    $(".card").remove();
    $("input:checkbox[type='checkbox']:checked").each(function () {
      const checkedItem = $(this).val();
      ingredient = ingredient.concat(" ", checkedItem);
    });
    health = $("#health").val();
    cuisineType = $("#cuisineType").val();
    mealType = $("#mealType").val();
    makeApiCall();
    clearFields();
  });
});
