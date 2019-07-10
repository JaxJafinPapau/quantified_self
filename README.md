# Quantified Self
## Turing School Project
[Original Project Description](https://backend.turing.io/module4/projects/quantified_self/qs_server_side)

### Authors:
[Jeremy Bennett](https://github.com/JaxJafinPapau); [William Peterson](https://github.com/wipegup)

## Contents:
- [Introduction](#introduction)
- [API Endpoints](#api-endpoints)
## Introduction

This project involves creating useful endpoints for a calorie tracker application.  

The code represented by [this current repo](https://github.com/JaxJafinPapau/quantified_self) keeps track of foods and the meals that may incorporate those foods. It may be found in production [here](https://qs-jb-wp.herokuapp.com/).  

The code found at [this repo](https://github.com/JaxJafinPapau/q_self_edamam_microsvc) acts as a microservice, leveraging the [Edamam](https://www.edamam.com/) API to find recepies for the foods stored in the main application. It may be found in production [here](https://frozen-ocean-70450.herokuapp.com/)

## API Endpoints
[Quantified Self](#quantified-self-endpoints)  
[Microservice](#microservice-endpoints)
### Quantified Self Endpoints
All endpoints hosted at [https://qs-jb-wp.herokuapp.com/](https://qs-jb-wp.herokuapp.com/).  

Thus a request might be `GET https://qs-jb-wp.herokuapp.com/api/v1/foods`.  
#### Foods

**`GET /api/v1/foods`**:  

Upon success:  
Status -- 200
Return all foods, serialized as:  
```
[
    {
        "id": 1,
        "name": "banana",
        "calories": 150,
        "createdAt": "2019-07-02T19:15:59.841Z",
        "updatedAt": "2019-07-02T19:15:59.841Z"
    },
    {
        "id": 2,
        "name": "apple",
        ...
    },
    ...
]
```


**`GET /api/v1/foods/:food_id`**:  

Upon success:  
Status -- 200
Return Single food, serialized as:  
```
{
    "id": 1,
    "name": "banana",
    "calories": 150,
    "createdAt": "2019-07-02T19:15:59.841Z",
    "updatedAt": "2019-07-02T19:15:59.841Z"
}
```

**`POST /api/v1/foods`**:  

Add food to database. Body of request must contain *calories* and *name* in a *JSON* body.  

E.G.:

Request body:
```
{
  food:
  {
      "name": "Orange",
      "calories": 250,
  }
}
```

Upon success:  
Status -- 201  
Body:  
```
{
    "id": 3,
    "name": "Orange",
    "calories": 250,
    "updatedAt": "2019-07-09T13:20:20.589Z",
    "createdAt": "2019-07-09T13:20:20.589Z"
}
```

**`PATCH /api/v1/foods/:food_id`**:  

Update food already in database. Body of request must contain *calories* and *name* in a *JSON* body.

E.G.:

Request:  
`PATCH /api/v1/foods/3`  

Body:  
```
{
  food:
  {
      "name": "Orange2",
      "calories": 252,
  }
}
```

Response:  
Status -- 200.  
Body:  
```
{
    "id": 3,
    "name": "Orange2",
    "calories": 252,
    "updatedAt": "2019-07-09T13:20:20.589Z",
    "createdAt": "2019-07-09T13:20:20.589Z"
}
```  

**`DELETE /api/v1/foods/:food_id`**:  

Delete food from database.  

Upon success:  
Status -- 204

#### Meals

**`GET /api/v1/meals`**:  

Upon success:  
Status -- 200
Return all meals, serialized as:  
```
[
    {
        "id": 1,
        "name": "Lunch",
        "foods": [
        {
            "id": 1,
            "name": "banana",
            "calories": 150,
            "createdAt": "2019-07-02T19:15:59.841Z",
            "updatedAt": "2019-07-02T19:15:59.841Z"
        },
        {
            "id": 3,
            "name": "Orange2",
            "calories": 252,
            "updatedAt": "2019-07-09T13:20:20.589Z",
            "createdAt": "2019-07-09T13:20:20.589Z"
        }
        ]
    },
    {
        "id": 2,
      ...
    },
    ...
]
```  

**`GET /api/v1/meals/:meal_id/foods`**:

Upon success:  
Status -- 200
Returns single meal, serialized as:
```
{
    "id": 1,
    "name": "Lunch",
    "foods": [
    {
        "id": 1,
        "name": "banana",
        "calories": 150,
        "createdAt": "2019-07-02T19:15:59.841Z",
        "updatedAt": "2019-07-02T19:15:59.841Z"
    },
    {
        "id": 3,
        "name": "Orange2",
        "calories": 252,
        "updatedAt": "2019-07-09T13:20:20.589Z",
        "createdAt": "2019-07-09T13:20:20.589Z"
    }
    ]
}
```

**`POST /api/v1/meals/:meal_id/foods/:food_id`**

Adds food to a meal. `meal_id` and `food_id` in `URI` must be valid.  

Upon success:  
Status -- 201
Message -- `Successfully added FOODNAME to MEALNAME`  

**`DELETE /api/v1/meals/:meal_id/foods/:food_id`**:  

Deletes food from meal. The food denoted by `food_id` must be a part of the meal denoted by `meal_id`.  

Upon success:
Status -- 204  

### Microservice Endpoints

All endpoints hosted at [https://frozen-ocean-70450.herokuapp.com/](https://frozen-ocean-70450.herokuapp.com/).  

Thus a request might be `GET https://frozen-ocean-70450.herokuapp.com/api/v1/recipes/calorie_search?q=100-400`.  

##### Recipe Serialization

Responses will contain serialized recipes; in `JSON`, in the below format:  
```
{
  data:
  {
    recipes: [
    {
      id: 1,
      url: 'www.example.com',
      label: 'recipe_1',
      cal_per_serving: 150,
    },
    {
      id: 2,
      ...
    },
    ...
    ]
  }
}
```

#### Recipes

**`GET /api/v1/recipes/calorie_search?q=calorie_range`**:  

Returns all recipes in the database with calories-per-serving within the given range.  

Calorie range is specified by adding the query string `q`. `q` must be a string which contains two *integers* separated by a hyphen. For example, to search for recipes with calories-per-serving between 100 and 400, the request to make is `GET /api/v1/recipes/calorie_search?q=100-400`

Upon success:  
Status -- 200

Recipes serialized as [described above](#recipe-serialization)  

**`GET /api/v1/recipes/food_search?q=food_type`**:  

Returns all recipes in the database associated with the given food.  

The food type is specified by adding the query string `q`. `q` must be a string corresponding to a food contained in the database. For example, to search for recipes with chicken, the request to make is `GET /api/v1/recipes/food_search?q=chicken`  

Upon success:  
Status -- 200

Recipes serialized as [described above](#recipe-serialization)  

**`GET /api/v1/recipes/ingredient_search?q=num_of_ingredients`**:  

Returns all recipes in the database with exactly `n` ingredients.  

The number of ingredients is specified by adding the query string `q`. `q` must be an integer corresponding to the number of ingredients you want to be used in the recipe stored in the database. For example, to search for recipes with five ingredients, the request to make is `GET /api/v1/recipes/ingredient_search?q=5`  

Upon success:  
Status -- 200

Recipes serialized as [described above](#recipe-serialization)  


**`GET /api/v1/recipes/avg_calories?q=food_type`**:  

Returns the average calories per serving of recipes associated with a given food type.  

The food type is specified by adding the query string `q`. `q` must be a string corresponding to a food contained in the database. For example, to search for recipes with chicken, the request to make is `GET /api/v1/recipes/avg_calories?q=chicken`

Upon success:  
Status -- 200

```
{
  data:
    {
        food: food_type,
        avg_calories: average calories //float
    }
}
```

**`GET /api/v1/recipes/order_by_calories?q=food_type`**:  

Returns the recipes associated with a given food type, ordered by calories per serving; ascending.  

The food type is specified by adding the query string `q`. `q` must be a string corresponding to a food contained in the database. For example, to search for recipes with chicken, the request to make is `GET /api/v1/recipes/order_by_calories?q=chicken`

Upon success:  
Status -- 200

Recipes serialized as [described above](#recipe-serialization)  
