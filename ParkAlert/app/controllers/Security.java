package controllers;

import models.User;

public class Security extends Secure.Security {

	static boolean authentify(String username, String password) {
        validation.required(username);
        validation.required(password);
        

        if (validation.hasErrors()) {
        	validation.addError("password", "Credenciais vazias");
        	validation.keep();
        	return false;
        }
        
        if (!User.connect(username, password)) {
        	validation.addError("password", "Credenciais erradas");
        	validation.keep();
        	return false;
        }
        return true;

	}
	
	static void onDisconnected() {
		Application.index();
	}

//	static void onAuthenticated() {
//		Application.index();
//	}
	
	static boolean check(String profile) {
//		if ("admin".equals(profile)) {
//			for (Role role : User.find("byEmail", connected()).<User> first().roles) {
//				if (role.isAdmin()) {
//					return true;
//				}
//			}
//		}
		return false;
	}

}
