package controllers;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import messages.FacebookLogin;
import messages.ParkRemovalRequest;
import messages.ParkRequest;
import messages.RevalidateLogin;
import messages.TwitterLogin;
import misc.Comparador;
import misc.Pair;
import misc.ValidationError;
import models.Notification;
import models.Park;
import models.Report;
import models.Token;
import models.User;
import play.mvc.Controller;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

public class Android extends Controller {

	public static void user(String username) {
		System.out.println(username);
		User u = User.find("byUsername",username).first();
		if(u==null) {
			renderJSON("");
		} else {
			renderJSON(u);
		}
	}

	private static final String PROBLEMS_WITH_JSON = "jsonProblems";
	
	public static void newUser(String body) {
		try {
			String json = URLDecoder.decode(body,"UTF-8");
			// tem um "=" no fim nao sei porque
			if (json.charAt(json.length() - 1) == '=') {
				json = json.substring(0, json.length()-1);
			}
			Gson gson = new Gson();
			User tmp = gson.fromJson(json, User.class);
			ValidationError error = User.createNormalUser(validation, tmp.username, tmp.password, tmp.email, tmp.cellphone);
			if (error != null) {
				renderJSON(error.getAndroidError());
			}
			renderJSON("ok");
		} catch (JsonSyntaxException e) {
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		// Some exception took place
		renderJSON(PROBLEMS_WITH_JSON);
	}

	public static void newReport(long tokenId, String tokenValue, String type,
			double latitude, double longitude) {
		validateToken(tokenId, tokenValue);

		Token token = Token.findById(tokenId);
		token.owner.report(latitude, longitude, type);

		renderJSON("ok");
	}	

	public static void registAndroid(long tokenId, String tokenValue, String registID) {
		System.out.println("tokenID: "+tokenId+" tokenVal: "+tokenValue+" registID: "+registID);
		validateToken(tokenId, tokenValue);

		Token token = Token.findById(tokenId);
		System.out.println(token.owner.username);
		token.owner.c2dmID = registID;
		token.owner.save();
		renderJSON("ok");
	}

	public static void loginNormal(String username, String passwordAttempted) {
		if (User.connect(username, passwordAttempted)) {
			User u = User.find("byUsername", username).first();
			Token token = u.generateToken();
			if (token != null) {
				renderJSON(token.id + ":" + token.value);
			}
		}

		renderJSON(WRONG_LOG_IN);
	}

	public static void revalidateToken(String body) {
		RevalidateLogin msg = null;
		String json;
		try {
			json = URLDecoder.decode(body,"UTF-8");
			// tem um "=" no fim nao sei porque
			if (json.charAt(json.length() - 1) == '=') {
				json = json.substring(0, json.length()-1);
			}
			Gson gson = new Gson();
			msg = gson.fromJson(json, RevalidateLogin.class);
		} catch (UnsupportedEncodingException e) {
			renderJSON(WRONG_LOG_IN);
		}

		long tokenId = Long.parseLong(msg.tokenId);
		String tokenValue = msg.tokenValue;
		validateToken(tokenId, tokenValue);

		renderJSON("ok");
	}

	public static void loginFacebook(String body) {
		try {
			String json = URLDecoder.decode(body,"UTF-8");
			// tem um "=" no fim nao sei porque
			if (json.charAt(json.length() - 1) == '=') {
				json = json.substring(0, json.length()-1);
			}
			Gson gson = new Gson();
			FacebookLogin fb = gson.fromJson(json, FacebookLogin.class);

			User u = User.findOrCreateSocialUser(fb.socialId, fb.name, fb.email);
			Token token = u.generateToken();
			if (token != null) {
				renderJSON(token.id + ":" + token.value);
			}

			renderJSON(WRONG_LOG_IN);
		} catch (UnsupportedEncodingException e) {
			renderJSON(WRONG_LOG_IN);
		}
	}

	public static void loginTwitter(String body){
		try{
			String json = URLDecoder.decode(body,"UTF-8");
			// tem um "=" no fim nao sei porque
			if (json.charAt(json.length() - 1) == '=') {
				json = json.substring(0, json.length()-1);
			}
			Gson gson = new Gson();
			TwitterLogin twitter = gson.fromJson(json, TwitterLogin.class);

			User u = User.findOrCreateSocialUser(twitter.screenName, twitter.name, null);
			Token token = u.generateToken();
			if (token != null) {
				renderJSON(token.id + ":" + token.value);
			}

			renderJSON(WRONG_LOG_IN);
		} catch (UnsupportedEncodingException e) {
			renderJSON(WRONG_LOG_IN);
		}
	}

	public static void parkRemote(String body) {
		ParkRequest parkRequest = null;
		try {
			String json = URLDecoder.decode(body,"UTF-8");
			// tem um "=" no fim nao sei porque
			if (json.charAt(json.length() - 1) == '=') {
				json = json.substring(0, json.length()-1);
			}
			Gson gson = new Gson();
			parkRequest = gson.fromJson(json, ParkRequest.class);

		} catch (JsonSyntaxException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		long tokenId = Long.parseLong(parkRequest.tokenId);
		String tokenValue = parkRequest.tokenValue;
		double latitude = parkRequest.latitude;
		double longitude = parkRequest.longitude;

		validateToken(tokenId, tokenValue);

		Token token = Token.findById(tokenId);
		token.owner.parkCar(latitude, longitude);
		renderJSON("ok");
	}

	public static void removeParkRemote(String body) {
		ParkRemovalRequest unparkRequest = null;
		try {
			String json = URLDecoder.decode(body,"UTF-8");
			// tem um "=" no fim nao sei porque
			if (json.charAt(json.length() - 1) == '=') {
				json = json.substring(0, json.length()-1);
			}
			Gson gson = new Gson();
			unparkRequest = gson.fromJson(json, ParkRemovalRequest.class);

		} catch (JsonSyntaxException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		long tokenId = Long.parseLong(unparkRequest.tokenId);
		String tokenValue = unparkRequest.tokenValue;

		validateToken(tokenId, tokenValue);

		Token token = Token.findById(tokenId);
		token.owner.unpark();
		renderJSON("ok");
	}

	public static void recentReports(long tokenId, String tokenValue) {
		validateToken(tokenId, tokenValue);

		Token token = Token.findById(tokenId);
		User user = token.owner;
		List<Report> reports = user.fetchNewReportsSince(request.date.getTime(), true);

		if (reports.isEmpty()) {
			renderJSON("[ ]");
		}

		renderJSON(Application.createReportsJSON(reports));
	}

	public static void parkState(long tokenId, String tokenValue) {
		validateToken(tokenId, tokenValue);

		Token token = Token.findById(tokenId);
		User user = token.owner;

		List<Park> parks = user.parks;

		if(parks.isEmpty() || parks.get(parks.size() - 1).removed) {
			renderJSON("[ ]");
		}

		List<Park> resultList = new ArrayList<Park>();
		resultList.add(parks.get(parks.size() - 1));
		renderJSON(Application.createParksJSON(resultList));

	}

	public static void getReport(long tokenId, String tokenValue, long reportId) {
		validateToken(tokenId, tokenValue);

		Report report = Report.findById(reportId);
		List<Report> list = new ArrayList<Report>();
		if (report == null) {
			renderJSON("[ ]");
		} else {
			list.add(report);
			renderJSON(Application.createReportsJSON(list));
		}
	}

	private static final String WRONG_LOG_IN = "wrongLogIn";

	private static boolean validateToken(long tokenId, String tokenValue) {
		Token token = Token.findById(tokenId);
		if (token == null || !token.value.equals(tokenValue)) {
			renderJSON(WRONG_LOG_IN);
			// unreachable statement
			return false;
		}

		if (token.validity.after(new Date())) {
			return true;
		}

		// token is stale, let's generate a new one (because it was valid) and send it to the user
		Token newToken = token.owner.generateToken();
		renderJSON("repeat:" + newToken.id + ":" + newToken.value);
		// unreachable statement
		return true;
	}

	public static void registrationID(String body) {

		// Username, c2dmID, token

	}

	public static void confirmNotif(long nid) {

		final Logger LOGGER2 = Logger.getLogger("MessageLog");
		LOGGER2.setLevel(Level.INFO);
		LOGGER2.info("Trying to confirm "+nid);

		Notification n = Notification.findById(nid);
		n.confirm();

		final Logger LOGGER = Logger.getLogger("MessageLog");
		LOGGER.setLevel(Level.INFO);
		LOGGER.info("Notification was confirmed.");

		System.out.println("Notification was confirmed!");

	}

	public static void denyNotif(long nid) {
		final Logger LOGGER2 = Logger.getLogger("MessageLog");
		LOGGER2.setLevel(Level.INFO);
		LOGGER2.info("Trying to deny "+nid);

		Notification n = Notification.findById(nid);
		n.deny();

		final Logger LOGGER = Logger.getLogger("MessageLog");
		LOGGER.setLevel(Level.INFO);
		LOGGER.info("Notification was denied.");

		System.out.println("Notification was denied!");
	}

	public static void getRanks(long tokenId, String tokenValue, int amount) {
		validateToken(tokenId, tokenValue);

		Token token = Token.findById(tokenId);
		User user = token.owner;
		ArrayList<Pair<String,Pair<Long,Pair<Long,Boolean>>>> ranks = new ArrayList<Pair<String,Pair<Long,Pair<Long,Boolean>>>>();

		List<User> users = User.findAll();
		for (User u : users) {
			ranks.add(new Pair<String,Pair<Long,Pair<Long,Boolean>>>(u.username, 
											new Pair<Long,Pair<Long,Boolean>>(0L, 
																new Pair<Long,Boolean>(u.getScore(),
																		(u.username.equals(user.username)? true : false)))));
		}

		Collections.sort(ranks, new Comparador());
		long ii=1;
		for(Pair<String,Pair<Long,Pair<Long,Boolean>>> p : ranks) {
			p.getSecond().setFirst(ii);
			ii++;
		}
		
		ArrayList<Pair<String,Pair<Long,Pair<Long,Boolean>>>> ret = new ArrayList<Pair<String,Pair<Long,Pair<Long,Boolean>>>>();
		int index = 0;
		
		for(int i=0;i<ranks.size();i++) {
			if(ranks.get(i).getFirst().equals(user.username)) {
				index = i;
				break;
			}
		}
		
		if(index<amount-1) {
			for(int i=0;i<ranks.size() && i<amount;i++) {
				ret.add(ranks.get(i));
			}
			renderJSON(Application.createRanksJSON(ret));
			return;
		}
		
		if(index==amount-1) {
			for(int i=0;i<ranks.size() && i<amount+1;i++) {
				ret.add(ranks.get(i));
			}
			renderJSON(Application.createRanksJSON(ret));
			return;
		}
		
		if(index>amount-1) {
			for(int i=0;i<amount;i++) {
				ret.add(ranks.get(i));
			}
			if(amount==index) {
				ret.add(ranks.get(index));
				if(ranks.size()>=index+1) {
					ret.add(ranks.get(index+1));
				}
			} else {
				ret.add(ranks.get(index-1));
				ret.add(ranks.get(index));
				if(ranks.size()>index+1)
					ret.add(ranks.get(index+1));
			}
		}
		renderJSON(Application.createRanksJSON(ret));
		return;		
	}
	
	public static void closeReports(long tokenId, String tokenValue,
			double latitude, double longitude) {
		validateToken(tokenId, tokenValue);
		
		List<Report> reports = Report.getCloseReports(latitude, longitude);
		
		if (reports.isEmpty()) {
			renderJSON("[ ]");
		}

		renderJSON(Application.createReportsJSON(reports));
	}
}
