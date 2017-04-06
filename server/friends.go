package main;

import (
	"net/http"
	"encoding/json"
	"log"
)

type FriendRequest struct {
	User, Friend usr
}

func handleFriends( w http.ResponseWriter, req *http.Request ) {
	if req.Method == http.MethodGet {
		getFriends(w, req);
	} else {
		var fr FriendRequest;
		var u, f User;
		defer req.Body.Close();
		json.NewDecoder(req.Body).Decode(&fr);
		db.Where(&User{Email: fr.User.Email}).First(&u);
		db.Where(&User{Email: fr.Friend.Email}).First(&f);
		if req.Method == http.MethodPost {
			addFriend(u, f, w);
		} else if req.Method == http.MethodDelete {
			deleteFriend(u, f, w);
		}
	}
}

func getFriends(w http.ResponseWriter, req *http.Request) {
	var user User;
	s := req.URL.Query()["Email"];
	if len(s) > 0 {
		db.Where(&User{Email: s[0]}).First(&user);
		fr := findFriends(user);
		r, _ := json.Marshal(fr);
		log.Println("successfully retrieved friends")
		w.Write(r);		
	} else {
		badRequest(w, "user email not found", http.StatusBadRequest);
	}
}

func findFriends(u User) []UserResponse {
	var fID []UserFriend;
	var FriendResponses []UserResponse;
	db.Where(&UserFriend{UserID: u.ID}).Find(&fID);
	for _, uf := range fID {
		var friend User;
		if uf.UserID > 0 {
			db.Where(&User{ID: uf.FriendID}).First(&friend);
			res := getUser(friend);
			FriendResponses = append(FriendResponses, res);
		}
	}
	return FriendResponses;
}


func addFriend(p User, f User, w http.ResponseWriter) {
	db.Create(&UserFriend{UserID: p.ID, FriendID: f.ID});
	db.Create(&UserFriend{UserID: f.ID, FriendID: p.ID});
	successRequest(w, "successfully added friend", "added friend");
}

func deleteFriend(p User, f User, w http.ResponseWriter) {
	var u UserFriend;
	db.Where(&UserFriend{UserID: p.ID, FriendID: f.ID}).First(&u);
	if u.FriendID > 0 {
		db.Delete(&u);
	}
	successRequest(w, "successfully removed friend", "deletedfriend");
}
