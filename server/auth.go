package main;
import (
	"net/http"
	"log"
	"time"
	"encoding/json"
	"golang.org/x/crypto/bcrypt"
	"github.com/dgrijalva/jwt-go"
)

type usr struct {
	Name, Password, Email, City, Image string
	Interests []string
}

func signUp(w http.ResponseWriter, req *http.Request) {
	var u usr;
	var user User;
	var city Cities;
	var id User;
	defer req.Body.Close();
	json.NewDecoder(req.Body).Decode(&u);
	if req.Method == http.MethodPost {
		db.Where(&User{ Email: u.Email }).First(&user);
		if len(user.Email) > 0 {
			http.Error(w, "Email already taken", http.StatusBadRequest);
		} else {
			if err != nil { log.Println("user structure incorrect"); }
			bp, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.MinCost);
			if err != nil { log.Println("hashing failed"); }
			db.Where(&Cities{ City_Name: u.City }).First(&city);
			db.Create(&User{Name: u.Name, Email: u.Email, Password: bp, CitiesID: city.ID });
			db.Where(&User{ Email: u.Email}).First(&id);
			initializeInterests(id.ID, u.Interests);
			sendToken(w, u);
		}
	} else if req.Method != http.MethodOptions {
		log.Println("cannot send a get request");
	}
}

func logIn(w http.ResponseWriter, req *http.Request) {
	var u usr;
	var user User;
	defer req.Body.Close();
	if req.Method == http.MethodPost {
		decoder := json.NewDecoder(req.Body);
		err := decoder.Decode(&u);
		if err != nil { log.Println("user structure incorrect"); }
		db.Where(&User{ Email: u.Email }).First(&user);	
		if len(user.Email) > 0 {
			er := bcrypt.CompareHashAndPassword(user.Password, []byte(u.Password));
			if er != nil {
				http.Error(w, "password is incorrect", http.StatusBadRequest);
			} else {
				sendToken(w, u);
			}
		} else {
			http.Error(w, "user not found in db, please signup", http.StatusFound);
		}
	} else if req.Method != http.MethodOptions {
		log.Println("post method required");
	}
}

func sendToken(w http.ResponseWriter, u usr){
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"Email": u.Email,
		"Time": time.Now(),
	});
	tokenString, _ := token.SignedString(secret);
	storeToken(tokenString, u);
	successRequest(w, tokenString, "successfully logged in");
}