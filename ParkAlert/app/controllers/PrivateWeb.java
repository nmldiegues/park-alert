package controllers;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import misc.Comparador;
import misc.Pair;
import misc.RankComparator;
import models.Notification;
import models.Park;
import models.Rank;
import models.Report;
import models.User;
import play.mvc.Controller;
import play.mvc.With;

@With(Secure.class)
public class PrivateWeb extends Controller {

	// This controller shall comprehend the Web API for the private part of the site

	public static void ranking() {
		getRanks();
	}

	public static void stats() {
		User user = User.find("byUsername", Security.connected()).first();
		List<Report> reportsToUser = getNotificationsToUser(user);
		long timeParked = getSavedTime(user);
		double savedMoney = getSavedMoney(timeParked);
		long roundTrips = getSavedRoundtrips(timeParked);
		List<Report> reportsThatHelped = getReportsThatHelpedUsers(user);
		int days = (int)((new Date().getTime() - user.registrationDate.getTime()) / (1000 * 60 * 60 * 24));
		List<Park> parks = user.parks;
		List<Report> reports = user.reports;
		
		render("Application/stats.html", reportsToUser, roundTrips, savedMoney, days, reportsThatHelped, parks, reports);
	}
	
	protected static List<Report> getNotificationsToUser(User user) {
		return user.reportsAffectingMe;
	}
	
	protected static long getSavedTime(User user) {
		long duration = 0L;
		for (Park park : user.parks) {
			duration += park.timeParked;
		}
		return duration;
	}
	
	protected static double getSavedMoney(long duration) {
		// Taking into account the place where each park was performed, one 
		// could come up with a more precise amount of money by mapping the 
		// cost of each zone to GPS locations
		final double pricePerMinute = 0.02 / 60 / 1000;	// estimate 1.20euro per hour
		DecimalFormat twoDForm = new DecimalFormat("#.##");
		return Double.valueOf(twoDForm.format(duration * pricePerMinute));
	}
	
	protected static long getSavedRoundtrips(long duration) {
		// Assume that every 3h a new coin must be inserted
		final long hours = 1000 * 60 * 60 * 3;
		return (long)(duration / hours);
	}
	
	protected static List<Report> getReportsThatHelpedUsers(User user) {
		List<Report> reports = Report.find("select r from Report r where r.affectedSomeUser = true").fetch();
		return reports;
	}
	
	public static void actions() {
		render("Application/actions.html");
	}

	public static void park(double latitude, double longitude) {
		// We can assume a User is connected because of the Secure annotation
		User user = User.find("byUsername", Security.connected()).first();
		user.parkCar(latitude, longitude);
	}

	public static void isParked() {
		User user = User.find("byUsername", Security.connected()).first();
		for (Park park : user.parks) { 
			if (park.removed) {
				continue;
			}
			renderJSON("{ \"latitude\": " + park.latitude + ", \"longitude\": " + park.longitude + " }");
			// unreachable
			return;
		}
		renderJSON("{ \"latitude\": null, \"longitude\": null }");
	}

	public static void unpark() {
		User user = User.find("byUsername", Security.connected()).first();
		user.unpark();
	}

	public static void report(double latitude, double longitude) {
		User user = User.find("byUsername", Security.connected()).first();
		user.report(latitude, longitude, "web");
	}

	public static void anyNewReports() {
		User user = User.find("byUsername", Security.connected()).first();
		List<Report> reports = user.fetchNewReportsSince(request.date.getTime(), false);
		if (reports.isEmpty()) {
			// This maintains the HTTP connection and repeats the method in some time 
			suspend("10s");
		}
		// Have to do the JSON manually because of a cyclic dependency in User<->Report that Gson does not support
		String output = Application.createReportsJSON(reports);

		renderJSON(output);
	}

	public static void recentReports() {
		User user = User.find("byUsername", Security.connected()).first();
		List<Report> reports = user.fetchNewReportsSince(request.date.getTime(), true);
		if (reports.isEmpty()) {
			renderJSON("[ ]");
		}

		renderJSON(Application.createReportsJSON(reports));
	}

	public static void getRanks() {
		int amount = 50;

		User user = User.find("byUsername", Security.connected()).first();
		ArrayList<Rank> ranks = new ArrayList<Rank>();

		List<User> users = User.findAll();
		for (User u : users) {
			ranks.add(new Rank(u.username, 0L, u.getScore(), u.username.equals(user.username)? true : false));
		}

		Collections.sort(ranks, new RankComparator());
		long ii=1;
		for(Rank p : ranks) {
			p.rank = ii;
			ii++;
		}

		ArrayList<Rank> ret = new ArrayList<Rank>();
		int index = 0;

		for(int i=0;i<ranks.size();i++) {
			if(ranks.get(i).username.equals(user.username)) {
				index = i;
				break;
			}
		}

		if(index<amount-1) {
			for(int i=0;i<ranks.size() && i<amount;i++) {
				ret.add(ranks.get(i));
			}
			render("Application/ranking.html", ranks);
			return;
		}

		if(index==amount-1) {
			for(int i=0;i<ranks.size() && i<amount+1;i++) {
				ret.add(ranks.get(i));
			}
			render("Application/ranking.html", ranks);
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
		render("Application/ranking.html", ranks);
		return;		
	}
	
	public static void logout() {
		try {
			Secure.logout();
		} catch (Throwable e) {
			e.printStackTrace();
		}
	}

}
