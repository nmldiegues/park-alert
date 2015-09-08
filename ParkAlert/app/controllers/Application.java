package controllers;

import java.util.ArrayList;
import java.util.List;

import com.restfb.DefaultFacebookClient;
import com.restfb.FacebookClient;
import com.restfb.exception.FacebookOAuthException;

import misc.Pair;
import misc.ValidationError;
import models.Park;
import models.Report;
import models.User;
import play.data.validation.Required;
import play.libs.Crypto;
import play.mvc.Controller;

public class Application extends Controller {

	public static void index() {
		render();
	}

	public static void register() {
		render("Application/register.html");
	}

	public static void doRegister(String username, 
			String password, String email, String cellphone) {
		ValidationError error = User.createNormalUser(validation, username, password, email, cellphone);
		if (error != null) {
			validation.addError(error.getField(), error.getMessage());
			render("Application/register.html");
		}
		
		forceSecureLogin(username);
		PrivateWeb.actions();
	}
	
	public static void doLogin(@Required String username, @Required String password) {
		if (User.connect(username, password)) {
			forceSecureLogin(username);
			PrivateWeb.actions();
		} else {
			validation.addError("password", "Credenciais erradas");
			validation.keep();
			boolean reload = true;
			render("Application/index.html", reload);
		}
	}

	public static void facebookLogin(@Required int uid, @Required String fbToken) {
		com.restfb.types.User fbUser = null;
		try {
			FacebookClient facebookClient = new DefaultFacebookClient(fbToken);
			fbUser = facebookClient.fetchObject("me", com.restfb.types.User.class);
		} catch (FacebookOAuthException e) {
			System.out.println("FB error: " + e.getErrorType() + " " + e.getErrorMessage());
			// TODO handle error, do not log in the user!
		}
		String socialId = fbUser.getId();
		String name = fbUser.getName();
		String email = fbUser.getEmail();
		User.findOrCreateSocialUser(socialId, name, email);
		forceSecureLogin(name);
		try {
			Secure.redirectToOriginalURL();
		} catch (Throwable e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private static void forceSecureLogin(String handle) {
		session.put("username", handle);
		response.setCookie("rememberme", Crypto.sign(handle) + "-" + handle, "30d");
	}

	protected static String createReportsJSON(List<Report> reports) {
		String output = "[ ";
		for (Report report : reports) {
			output += "{ \"id\": " + report.id + ", \"latitude\": " + report.latitude + ", \"longitude\":" + report.longitude + ", \"date\": " + report.date + ", \"fade\": " + report.fade + " }, ";  
		}
		output = output.substring(0, output.length() - 2);
		output += " ]";
		return output;
	}

	protected static String createParksJSON(List<Park> parks) {
		String output = "[ ";
		for(Park park : parks) { // there should only be one park, so the padding at the end of the string is unnecessary. but for now assume multiple parks

			output += "{ \"latitude\": " + park.latitude + ", \"longitude\": " + park.longitude +  " }, ";

		}
		output = output.substring(0, output.length() - 2);
		output += " ]";
		return output;
	}

	//name, rank, score, requester?
	public static String createRanksJSON(ArrayList<Pair<String,Pair<Long,Pair<Long,Boolean>>>> ranks) {
		System.out.println(ranks.size());
		String output = "[ ";
		for(Pair<String,Pair<Long,Pair<Long,Boolean>>> p : ranks) {

			output += 	"{ \"username\": \"" + p.getFirst() + "\"" + 
						", \"rank\": " + p.getSecond().getFirst() + 
						", \"score\": " + p.getSecond().getSecond().getFirst() +
						", \"requester\": " + p.getSecond().getSecond().getSecond() +
						" }, ";

		}
		output = output.substring(0, output.length() - 2);
		output += " ]";
		return output;
	}

}