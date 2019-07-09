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

### Quantified Self Endpoints

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
