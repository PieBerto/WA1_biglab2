# BigLab 2

## Team name: TEAM_NAME

Team members:
* s302298 DE CRISTOFARO JACOPO
* s301607 ARPINO VITTORIO 
* s301174 BERTORELLE PIETRO
* s297925 BATTIPAGLIA ANTONIO

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _labs_](https://polito-wa1-aw1-2022.github.io/materials/labs/BigLab2/BigLab2.pdf). In the same repository, you can find the [instructions for GitHub Classroom](https://polito-wa1-aw1-2022.github.io/materials/labs/GH-Classroom-BigLab-Instructions.pdf), covering BigLabs and exam sessions.

Once you cloned this repository, please write the group name and names of the members of the group in the above section.

In the `client` directory, do **NOT** create a new folder for the project, i.e., `client` should directly contain the `public` and `src` folders and the `package.json` files coming from BigLab1.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to GitHub.
This should be already automatically excluded from the `.gitignore` file, but double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.
Remember that `npm install` should be executed inside the `client` and `server` folders (not in the `BigLab2` root directory).

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## Registered Users

Here you can find a list of the users already registered inside the provided database. This information will be used during the fourth week, when you will have to deal with authentication.
If you decide to add additional users, please remember to add them to this table (with **plain-text password**)!

| email | password | name |
|-------|----------|------|
| john.doe@polito.it | password | John |
| mario.rossi@polito.it | password | Mario |
| testuser@polito.it | password | testuser |

## List of APIs offered by the server

Provide a short description for API with the required parameters, follow the proposed structure.

* [HTTP Method] [URL, with any parameter]
* [One-line about what this API is doing]
* [Sample request, with body (if any)]
* [Sample response, with body (if any)]
* [Error responses, if any]

#### **GET /films?filter**

- **Return an array containing all films or the films that match the filter query parameters (if it is specified)**.
- **Request body**: empty.
- **Response**: `200 OK` (success); body: An array of objects, each describing id, title, favorite, watchdate, rating, user

    ```
    [
        {
            "id":1,
           "title" : "Pulp Fiction",
            "favorite" : 1,
            "watchdate" : "2022-03-11",
            "rating" : 5,
            "user" : 1
        },
        {
            "id":2,
           "title" : "21 Grams",
            "favorite" : 1,
            "watchdate" : "	2022-03-17",
            "rating" : 4,
            "user" : 1
        },
        ....
    ]

    ```

- **Error responses**:  `500 Internal Server Error` (generic error).



#### **GET /films/:id**

- **Return a a Film, given its id**
- **Request header : req.params.id to retrieve id**
- **Request body**: empty.
- **Response**: `200 OK` (success); body: An object describing the Film

    ```
        {
            "id":1,
           "title" : "Pulp Fiction",
            "favorite" : 1,
            "watchdate" : "2022-03-11",
            "rating" : 5,
            "user" : 1
        }

    ```

- **Error responses**:  `500 Internal Server Error` (generic error), `404 Not Found` (no Film associated to id).

#### **POST /films/**

- **Creates a new Film.**
- **Request header has a line: Content-type/application/json**
- **Request body**: a JSON object containing title, favorite, watchdate, rating, user
- **Response**: `201 Created` (success); 
    ```
        {
           "title" : "new Film",
            "favorite" : 0,
            "watchdate" : "2022-05-30",
            "rating" : 3,
            "user" : 1
        }

    ```

- **Error responses**:  `500 Internal Server Error` (generic error)

#### **PATCH /films/:id**

- **Modify a Film.**
- **Request header : req.params.id to retrieve id**
- **Request header has a line: Content-type/application/json**
- **Request body**: a JSON object containing favorite
- **Response**: `200 OK` (success); 
    ```
        {
           "newFavorite": 1
        }

    ```

- **Error responses**:  `422 Unprocessable Entity` (Body of JSON is wrong), `404 Not Found` (Film does not found)

#### **DELETE /films/:id**

- **Delete a Film from its id.**
- **Request header : req.params.id to retrieve id**
- **Response**: `200 OK` (success); 
- **Error responses**: `500 Internal Server Error` (Generic Error) 

#### **PUT /films/:id**

- **Modify a Film.**
- **Request header : req.params.id to retrieve id**
- **Request header has a line: Content-type/application/json**
- **Request body**: a JSON object containing title, favorite, watchdate, rating, user
- **Response**: `200 OK` (success); 
    ```
        {
           "title" : "new Film",
            "favorite" : 0,
            "watchdate" : "2022-05-30",
            "rating" : 3,
            "user" : 1
        }

    ```

- **Error responses**:  `422 Unprocessable Entity` (Body of JSON is wrong),`500 Internal Server Error` (Generic Error)



   










